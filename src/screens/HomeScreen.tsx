import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Linking,
} from 'react-native';
import { ELECTRICITY_PROVIDERS, GAS_PROVIDERS } from '../constants/providers';
import { ProviderInfo, BillData, SavedMeter, BillMonthHistory } from '../types/bill';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { APP_CONFIG } from '../constants/appConfig';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { AdBanner } from '../components/AdBanner';
import { ApiService, generate12MonthHistory, sanitizeBillingMonth, createInitializedBill } from '../services/api';
import { StorageService } from '../services/storage';
import { NotificationService } from '../services/notification';
import { getMeterDisplayName } from '../utils/meterUtils';
import { AppIcon } from '../components/AppIcon';
import { CustomPopup, PopupConfig } from '../components/CustomPopup';
import { DashboardHeroCard } from '../components/home/DashboardHeroCard';
import { DashboardBillCard } from '../components/home/DashboardBillCard';
import { OfficialBillModal } from '../components/bill/OfficialBillModal';
import { NewMeterFab } from '../components/NewMeterFab';
import { styles } from '../styles/HomeScreen.styles';

interface HomeScreenProps {
  language: Language;
  darkMode: boolean;
  savedMeters: SavedMeter[];
  onBillChecked: (bill: BillData) => void;
  onRefreshSaved: () => void;
  onToggleLanguage?: (lang: Language) => void;
  onToggleTheme?: (isDark: boolean) => void;
  onNavigateAnalytics?: () => void;
  onOpenSelectProvider?: () => void;
}

type FilterType = 'all' | 'electricity' | 'gas';

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  darkMode,
  savedMeters,
  onBillChecked,
  onRefreshSaved,
  onToggleLanguage,
  onToggleTheme,
  onOpenSelectProvider,
}) => {
  const t = TRANSLATIONS[language];
  const isUrdu = language === 'ur';

  // State
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [loadingMeterId, setLoadingMeterId] = useState<string | null>(null);
  const [loadingOfficialMeterId, setLoadingOfficialMeterId] = useState<string | null>(null);
  const [officialModalBill, setOfficialModalBill] = useState<BillData | null>(null);
  const [showOfficialModal, setShowOfficialModal] = useState<boolean>(false);
  const [heroHistory, setHeroHistory] = useState<BillMonthHistory[]>([]);
  const [popup, setPopup] = useState<PopupConfig>({
    visible: false,
    title: '',
    message: '',
  });

  // Filtered meters list
  const filteredMeters = useMemo(() => {
    if (filterType === 'electricity') {
      return savedMeters.filter((m) => m.utilityType === 'electricity');
    }
    if (filterType === 'gas') {
      return savedMeters.filter((m) => m.utilityType === 'gas');
    }
    return savedMeters;
  }, [savedMeters, filterType]);

  const electricityCount = useMemo(
    () => savedMeters.filter((m) => m.utilityType !== 'gas').length,
    [savedMeters]
  );
  const gasCount = useMemo(
    () => savedMeters.filter((m) => m.utilityType === 'gas').length,
    [savedMeters]
  );

  // Totals for currently filtered meters (used in hero card)
  const { totalDueAmount, unpaidBillsCount } = useMemo(() => {
    let sum = 0;
    let unpaidCount = 0;
    filteredMeters.forEach((m) => {
      if (m.lastBillStatus !== 'paid') {
        unpaidCount += 1;
        sum += m.lastBillAmount || 0;
      }
    });
    return { totalDueAmount: sum, unpaidBillsCount: unpaidCount };
  }, [filteredMeters]);

  // Helper to ensure current bill month is included and history is in strict chronological ascending order
  const enrichWithCurrentBill = (bill: BillData): BillMonthHistory[] => {
    const base = bill.history12Months || [];
    const currentLabel = sanitizeBillingMonth(bill.billMonth);
    const yrStr = currentLabel.split(/[\s-]+/)[1] || '26';
    const fullYear = 2000 + (parseInt(yrStr, 10) || 26);

    const MON_MAP_ORDER: Record<string, number> = {
      JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
      JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
    };

    if (base.length === 0) {
      if (!bill.unitsConsumed && !bill.payableWithinDueDate) return [];
      return generate12MonthHistory(bill.unitsConsumed || 0, bill.payableWithinDueDate || 0, currentLabel, bill.utilityType);
    }

    const currentEntry: BillMonthHistory = {
      month: currentLabel,
      year: fullYear,
      units: bill.unitsConsumed || 0,
      amount: bill.payableWithinDueDate || 0,
      status: bill.billStatus === 'paid' ? 'paid' : 'unpaid',
    };

    const combined = [...base];
    const existingIdx = combined.findIndex((b) => (b.month || '').trim().toUpperCase() === currentLabel);
    if (existingIdx !== -1) {
      combined[existingIdx] = currentEntry;
    } else {
      combined.push(currentEntry);
    }

    // Deduplicate by timestamp and sort ascending (oldest -> newest)
    const seen = new Set<string>();
    const result: BillMonthHistory[] = [];
    combined.forEach((item) => {
      const mStr = (item.month || '').trim().toUpperCase();
      const parts = mStr.split(/[\s\-_]+/);
      const abbr = parts[0]?.slice(0, 3) || 'AUG';
      const y = item.year || (parts[1] ? 2000 + parseInt(parts[1], 10) : 2026);
      const key = `${abbr}_${y}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({
          ...item,
          month: `${abbr} ${String(y).slice(-2)}`,
          year: y,
        });
      }
    });

    result.sort((a, b) => {
      const aAbbr = a.month.slice(0, 3).toUpperCase();
      const bAbbr = b.month.slice(0, 3).toUpperCase();
      const aTs = (a.year || 2026) * 12 + (MON_MAP_ORDER[aAbbr] ?? 0);
      const bTs = (b.year || 2026) * 12 + (MON_MAP_ORDER[bAbbr] ?? 0);
      return aTs - bTs;
    });

    return result;
  };

  // Load trend history dynamically for the hero graph
  const loadTrendHistory = useCallback(async () => {
    // If no saved meters at all or all bills are paid (total due is 0)
    if (!savedMeters || savedMeters.length === 0 || (totalDueAmount === 0 && unpaidBillsCount === 0)) {
      setHeroHistory([]);
      return;
    }

    // 1. Try finding cached bill for first filtered meter or any saved meter
    const primaryMeter = filteredMeters[0] || savedMeters[0];
    if (primaryMeter && primaryMeter.lastBillStatus !== 'paid') {
      const cached = await StorageService.getCachedBill(primaryMeter.company, primaryMeter.referenceNumber);
      if (cached?.history12Months && cached.history12Months.length > 0) {
        setHeroHistory(enrichWithCurrentBill(cached));
        return;
      }
    }

    // 2. If primary meter has lastBillAmount and is unpaid, generate dynamic history
    if (primaryMeter && primaryMeter.lastBillStatus !== 'paid' && primaryMeter.lastBillAmount && primaryMeter.lastBillAmount > 0) {
      const estimatedUnits = Math.max(50, Math.round(primaryMeter.lastBillAmount / 38));
      const dyn = generate12MonthHistory(estimatedUnits, primaryMeter.lastBillAmount, primaryMeter.lastBillMonth);
      setHeroHistory(dyn);
      return;
    }

    // 3. Default dynamic history based on current total due if meters exist
    if (totalDueAmount > 0) {
      const targetMonth = filteredMeters[0]?.lastBillMonth || savedMeters[0]?.lastBillMonth;
      const baseUnits = Math.max(80, Math.round(totalDueAmount / 38));
      const dyn = generate12MonthHistory(baseUnits, totalDueAmount, targetMonth);
      setHeroHistory(dyn);
      return;
    }

    setHeroHistory([]);
  }, [filteredMeters, savedMeters, totalDueAmount, unpaidBillsCount]);

  useEffect(() => {
    loadTrendHistory();
  }, [loadTrendHistory]);

  const [refreshing, setRefreshing] = useState(false);

  const handlePullRefresh = async () => {
    setRefreshing(true);
    try {
      await NotificationService.autoSyncSavedMeters(isUrdu);
      onRefreshSaved();
      await loadTrendHistory();
    } catch {
      // ignore
    } finally {
      setRefreshing(false);
    }
  };

  // Check saved bill
  const handleCheckSavedBill = async (meter: SavedMeter) => {
    // 1. Instant cache check first (<5ms open time)
    const cachedBill = await StorageService.getCachedBill(meter.company, meter.referenceNumber);
    if (cachedBill && !cachedBill.isMockData) {
      onBillChecked(cachedBill);
      // Background sync fresh data if needed
      ApiService.fetchBill(meter.company, meter.referenceNumber, true)
        .then(async (fresh) => {
          if (fresh) {
            await StorageService.cacheBill(fresh);
            onRefreshSaved();
          }
        })
        .catch(() => {});
      return;
    }

    setLoadingMeterId(meter.id);

    try {
      const bill = await ApiService.fetchBill(meter.company, meter.referenceNumber, true);
      await StorageService.cacheBill(bill);
      await StorageService.saveMeter({
        ...meter,
        consumerName: bill.consumerName || meter.consumerName,
        consumerAddress: bill.consumerAddress || meter.consumerAddress,
        lastBillAmount: bill.payableWithinDueDate,
        lastDueDate: bill.dueDate,
        lastBillStatus: bill.billStatus,
        lastBillMonth: bill.billMonth,
      });
      onRefreshSaved();
      onBillChecked(bill);
    } catch {
      // Direct in-app fallback: open cached or initialized bill
      let bill: BillData | null = await StorageService.getCachedBill(meter.company, meter.referenceNumber);
      if (!bill) {
        const initBill = createInitializedBill(meter.company, meter.referenceNumber);
        initBill.consumerName = meter.consumerName || meter.nickname || `${meter.company} Consumer`;
        initBill.consumerAddress = meter.consumerAddress || initBill.consumerAddress;
        initBill.payableWithinDueDate = meter.lastBillAmount || 0;
        initBill.dueDate = meter.lastDueDate || initBill.dueDate;
        initBill.billMonth = meter.lastBillMonth || initBill.billMonth;
        initBill.billStatus = meter.lastBillStatus || 'unpaid';
        bill = initBill;
      }
      onBillChecked(bill);
    } finally {
      setLoadingMeterId(null);
    }
  };

  // Delete saved meter directly from home card
  const handleDeleteMeter = (meter: SavedMeter) => {
    setPopup({
      visible: true,
      type: 'warning',
      title: isUrdu ? 'میٹر حذف کریں؟' : 'Delete Saved Meter?',
      message: `${t.deleteConfirm}\n(${getMeterDisplayName(meter)} - ${meter.referenceNumber})`,
      primaryText: isUrdu ? 'ہاں، ڈیلیٹ کریں' : 'Yes, Delete',
      secondaryText: isUrdu ? 'کینسل' : 'Cancel',
      onPrimaryPress: async () => {
        setPopup((p) => ({ ...p, visible: false }));
        await StorageService.deleteMeter(meter.id);
        onRefreshSaved();
      },
      onClose: () => setPopup((p) => ({ ...p, visible: false })),
    });
  };

  // Open official duplicate bill live view modal
  const handleOpenOfficialView = async (meter: SavedMeter) => {
    setLoadingOfficialMeterId(meter.id);
    try {
      // 1. Check local cache first for full BillData
      let bill = await StorageService.getCachedBill(meter.company, meter.referenceNumber);
      if (!bill) {
        try {
          bill = await ApiService.fetchBill(meter.company, meter.referenceNumber, false);
          if (bill) {
            await StorageService.cacheBill(bill);
          }
        } catch {
          // Construct minimal valid BillData from SavedMeter
          bill = {
            company: meter.company,
            companyName: `${meter.company} Utility`,
            referenceNo: meter.referenceNumber,
            consumerName: meter.consumerName || meter.nickname || `${meter.company} Consumer`,
            consumerAddress: meter.consumerAddress || 'N/A',
            consumerId: meter.referenceNumber,
            tariff: 'General',
            load: '1 kW',
            dueDate: meter.lastDueDate || '2026-09-20',
            payableWithinDueDate: meter.lastBillAmount || 0,
            payableAfterDueDate: Math.round((meter.lastBillAmount || 0) * 1.08),
            latePaymentSurcharge: Math.round((meter.lastBillAmount || 0) * 0.08),
            billMonth: meter.lastBillMonth || 'AUG 26',
            billingMonth: meter.lastBillMonth || 'AUG 26',
            issueDate: 'N/A',
            readingDate: 'N/A',
            unitsConsumed: Math.max(0, Math.round((meter.lastBillAmount || 0) / 38)),
            billStatus: meter.lastBillStatus || 'unpaid',
            meterNo: 'N/A',
            fpaAmount: 0,
            tvFee: 0,
            gstAmount: 0,
            electricityDuty: 0,
            history12Months: [],
            utilityType: meter.utilityType,
            fetchedAt: new Date().toISOString(),
          };
        }
      }
      setOfficialModalBill(bill);
      setShowOfficialModal(true);
    } finally {
      setLoadingOfficialMeterId(null);
    }
  };

  return (
    <View style={styles.outerContainer}>
      {/* TopAppBar Component */}
      <View style={styles.topAppBar}>
        <View style={styles.brandTitleRow}>
          <Image
            source={require('../assets/images/app-logo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.brandTitle}>{APP_CONFIG.name}</Text>
        </View>
      </View>

      <ScrollView
        style={[styles.container, darkMode ? styles.darkBg : styles.lightBg]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handlePullRefresh}
            colors={['#10B981', '#006D35']}
            tintColor={darkMode ? '#62FF96' : '#006D35'}
            progressBackgroundColor={darkMode ? '#132033' : '#FFFFFF'}
          />
        }
      >
        {/* Dark Navy Hero Header Section with 6-Month SVG Graph */}
        <DashboardHeroCard
          totalDueAmount={totalDueAmount}
          unpaidBillsCount={unpaidBillsCount}
          history={heroHistory}
          billMonth={filteredMeters[0]?.lastBillMonth || savedMeters[0]?.lastBillMonth}
          language={language}
          darkMode={darkMode}
          onOpenNotifications={() => {
            setPopup({
              visible: true,
              type: 'info',
              title: isUrdu ? 'بل الرٹس اور اطلاعات' : 'Bill Due Date Alerts',
              message: isUrdu
                ? 'تمام یوٹیلیٹی بلوں کی آخری تاریخ کی یاد دہانی اور نوٹیفیکیشنز فعال ہیں۔'
                : 'Auto-sync and due date reminders are active for your saved meters.',
              primaryText: isUrdu ? 'ٹھیک ہے' : 'Got it',
              onClose: () => setPopup((p) => ({ ...p, visible: false })),
            });
          }}
          onToggleLanguage={onToggleLanguage}
          onToggleTheme={onToggleTheme}
          onAddBill={() => onOpenSelectProvider && onOpenSelectProvider()}
        />

        {/* Main Content Canvas (Overlapping Hero by -16px) */}
        <View style={styles.mainCanvas}>
          {/* Section Header & Quick Filter Tabs */}
          <View
            style={[
              styles.sectionFilterCard,
              darkMode ? styles.sectionFilterCardDark : styles.sectionFilterCardLight,
              isUrdu && styles.rtlRow,
            ]}
          >
            <View style={styles.sectionTitleCol}>
              <Text style={[styles.sectionTitle, darkMode ? styles.darkText : styles.lightText, isUrdu && styles.rtlText]}>
                {t.savedUtilityBills}
              </Text>
              <Text style={[styles.sectionSub, darkMode ? styles.darkSub : styles.lightSub, isUrdu && styles.rtlText]}>
                {savedMeters.length} {t.activeMetersConnected}
              </Text>
            </View>

            {/* Segmented Filter Tabs */}
            <View style={[styles.filterTabsWrap, darkMode && styles.filterTabsWrapDark]}>
              <TouchableOpacity
                style={[
                  styles.filterTabItem,
                  filterType === 'all' && (darkMode ? styles.filterTabActiveDark : styles.filterTabActive),
                ]}
                onPress={() => {
  setFilterType('all');
  // Keep current utilityType or default to electricity for consistency
}}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    !darkMode && styles.filterTabTextLight,
                    filterType === 'all' && (darkMode ? styles.filterTabTextActiveDark : styles.filterTabTextActive),
                  ]}
                >
                  {t.filterAll} ({savedMeters.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterTabItem,
                  filterType === 'electricity' && (darkMode ? styles.filterTabActiveDark : styles.filterTabActive),
                ]}
                onPress={() => setFilterType('electricity')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    !darkMode && styles.filterTabTextLight,
                    filterType === 'electricity' && (darkMode ? styles.filterTabTextActiveDark : styles.filterTabTextActive),
                  ]}
                >
                  {t.filterElectricity} ({electricityCount})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterTabItem,
                  filterType === 'gas' && (darkMode ? styles.filterTabActiveDark : styles.filterTabActive),
                ]}
                onPress={() => setFilterType('gas')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    !darkMode && styles.filterTabTextLight,
                    filterType === 'gas' && (darkMode ? styles.filterTabTextActiveDark : styles.filterTabTextActive),
                  ]}
                >
                  {t.filterGas} ({gasCount})
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Saved Utility Bill Cards */}
          <View style={styles.billsListContainer}>
            {filteredMeters.length === 0 ? (
              <View
                style={[
                  styles.emptyBillsBox,
                  darkMode ? styles.emptyBillsBoxDark : styles.emptyBillsBoxLight,
                ]}
              >
                <AppIcon name="receipt" size={32} color="#CBD5E1" />
                <Text style={[styles.emptyBillsTitle, darkMode ? styles.darkText : styles.lightText]}>
                  {t.noSavedBills}
                </Text>
                <Text style={[styles.emptyBillsSub, darkMode ? styles.darkSub : styles.lightSub]}>
                  {isUrdu
                    ? 'نیا میٹر شامل کرنے کے لیے نیچے دیے گئے بٹن پر کلک کریں۔'
                    : 'Tap the green + button below to add your electricity or gas meter.'}
                </Text>
              </View>
            ) : (
              filteredMeters.map((meter) => (
                <DashboardBillCard
                  key={meter.id}
                  meter={meter}
                  language={language}
                  darkMode={darkMode}
                  isLoading={loadingMeterId === meter.id}
                  isLoadingOfficial={loadingOfficialMeterId === meter.id}
                  onCheckBill={handleCheckSavedBill}
                  onOfficialView={handleOpenOfficialView}
                  onDeleteMeter={handleDeleteMeter}
                  onStatusChange={onRefreshSaved}
                />
              ))
            )}
          </View>

          {/* Quick Utility Sync Banner */}
          <View style={[styles.syncBanner, darkMode ? styles.syncBannerDark : styles.syncBannerLight, isUrdu && styles.rtlRow]}>
            <View style={[styles.syncBannerLeft, isUrdu && styles.rtlRow]}>
              <AppIcon name="refresh" size={24} color={darkMode ? '#62FF96' : '#006D35'} />
              <View>
                <Text style={[styles.syncBannerTitle, darkMode ? styles.darkText : styles.lightText, isUrdu && styles.rtlText]}>
                  {t.autoFetchEnabled}
                </Text>
                <Text style={[styles.syncBannerSub, darkMode ? styles.darkSub : styles.lightSub, isUrdu && styles.rtlText]}>
                  {t.autoFetchDesc}
                </Text>
              </View>
            </View>
            <View style={[styles.syncConnectedBadge, darkMode ? styles.syncConnectedBadgeDark : styles.syncConnectedBadgeLight]}>
              <Text style={[styles.syncConnectedText, darkMode && styles.syncConnectedTextDark]}>
                {t.connectedBadge}
              </Text>
            </View>
          </View>

          <DisclaimerBanner language={language} darkMode={darkMode} />
          <AdBanner darkMode={darkMode} language={language} />
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Reusable Floating Action Button (New Meter FAB) */}
      {onOpenSelectProvider && (
        <NewMeterFab
          onPress={onOpenSelectProvider}
          language={language}
        />
      )}

      {/* Official Duplicate Bill Modal */}
      {officialModalBill && (
        <OfficialBillModal
          visible={showOfficialModal}
          bill={officialModalBill}
          language={language}
          darkMode={darkMode}
          onClose={() => setShowOfficialModal(false)}
        />
      )}

      {/* Custom Popup Dialog */}
      <CustomPopup
        {...popup}
        darkMode={darkMode}
        isUrdu={isUrdu}
      />
    </View>
  );
};


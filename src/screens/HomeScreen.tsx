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
import { ApiService, generate12MonthHistory } from '../services/api';
import { StorageService } from '../services/storage';
import { NotificationService } from '../services/notification';
import { BillPdfService } from '../services/billPdf';
import { AppIcon } from '../components/AppIcon';
import { CustomPopup, PopupConfig } from '../components/CustomPopup';
import { DashboardHeroCard } from '../components/home/DashboardHeroCard';
import { DashboardBillCard } from '../components/home/DashboardBillCard';
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
  const [downloadingMeterId, setDownloadingMeterId] = useState<string | null>(null);
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

  // Helper to ensure current bill month is always the last entry in history
  const enrichWithCurrentBill = (bill: BillData): BillMonthHistory[] => {
    const base = bill.history12Months || [];
    if (!bill.billMonth || base.length === 0) return base;

    const currentLabel = bill.billMonth.trim().toUpperCase();

    // Check if currentLabel already exists in base
    const existingIndex = base.findIndex((b) => (b.month || '').trim().toUpperCase() === currentLabel);
    if (existingIndex !== -1) {
      const updated = [...base];
      updated[existingIndex] = {
        ...updated[existingIndex],
        units: bill.unitsConsumed || updated[existingIndex].units,
        amount: bill.payableWithinDueDate || updated[existingIndex].amount,
        status: bill.billStatus === 'paid' ? 'paid' : 'unpaid',
      };
      // Slice up to the current bill month so no future months exist after it
      return updated.slice(0, existingIndex + 1);
    }

    const lastLabel = (base[base.length - 1].month || '').trim().toUpperCase();
    if (lastLabel === currentLabel) return base;

    const yrStr = currentLabel.split(/[\s-]+/)[1] || '26';
    const fullYear = 2000 + (parseInt(yrStr, 10) || 26);

    const currentEntry: BillMonthHistory = {
      month: currentLabel,
      year: fullYear,
      units: bill.unitsConsumed || 0,
      amount: bill.payableWithinDueDate || 0,
      status: bill.billStatus === 'paid' ? 'paid' : 'unpaid',
    };

    return [...base, currentEntry];
  };

  // Load trend history dynamically for the hero graph
  const loadTrendHistory = useCallback(async () => {
    // 1. Try finding cached bill for first filtered meter or any saved meter
    const primaryMeter = filteredMeters[0] || savedMeters[0];
    if (primaryMeter) {
      const cached = await StorageService.getCachedBill(primaryMeter.company, primaryMeter.referenceNumber);
      if (cached?.history12Months && cached.history12Months.length > 0) {
        setHeroHistory(enrichWithCurrentBill(cached));
        return;
      }
    }

    // 2. Try last checked bill in storage
    const lastChecked = await StorageService.getLastCheckedBill();
    if (lastChecked?.history12Months && lastChecked.history12Months.length > 0) {
      setHeroHistory(enrichWithCurrentBill(lastChecked));
      return;
    }

    // 3. If primary meter has lastBillAmount, generate dynamic history
    if (primaryMeter && primaryMeter.lastBillAmount && primaryMeter.lastBillAmount > 0) {
      const estimatedUnits = Math.max(50, Math.round(primaryMeter.lastBillAmount / 38));
      const dyn = generate12MonthHistory(estimatedUnits, primaryMeter.lastBillAmount, primaryMeter.lastBillMonth);
      setHeroHistory(dyn);
      return;
    }

    // 4. Default dynamic history based on current total due or fallback
    const targetMonth = filteredMeters[0]?.lastBillMonth || savedMeters[0]?.lastBillMonth;
    const baseAmount = totalDueAmount > 0 ? totalDueAmount : 14500;
    const baseUnits = Math.max(80, Math.round(baseAmount / 38));
    const dyn = generate12MonthHistory(baseUnits, baseAmount, targetMonth);
    setHeroHistory(dyn);
  }, [filteredMeters, savedMeters, totalDueAmount]);

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

  const handleFetchFailure = (provider: ProviderInfo, refNo: string) => {
    const portalUrl = provider.portalUrl || 'https://bill.pitc.com.pk/';
    setPopup({
      visible: true,
      type: 'error',
      title: isUrdu ? 'سرور سے بل موصول نہیں ہوا' : 'Live Bill Fetch Failed',
      message: isUrdu
        ? `سرور سے بل موصول نہیں ہو سکا۔ کیا آپ ${provider.name} کے لائیو سرکاری پورٹل پر چیک کرنا چاہتے ہیں؟\n\nحوالہ نمبر: ${refNo}`
        : `Could not fetch bill from the server. Would you like to view it directly on the official ${provider.name} portal?\n\nReference No: ${refNo}`,
      primaryText: isUrdu ? 'سرکاری پورٹل کھولیں' : 'Open Official Portal',
      secondaryText: isUrdu ? 'کینسل' : 'Cancel',
      onPrimaryPress: () => {
        setPopup((p) => ({ ...p, visible: false }));
        Linking.openURL(portalUrl);
      },
      onClose: () => setPopup((p) => ({ ...p, visible: false })),
    });
  };

  // Check saved bill
  const handleCheckSavedBill = async (meter: SavedMeter) => {
    setLoadingMeterId(meter.id);
    const prov =
      [...ELECTRICITY_PROVIDERS, ...GAS_PROVIDERS].find((p) => p.code === meter.company) ||
      ELECTRICITY_PROVIDERS[0];

    try {
      const bill = await ApiService.fetchBill(meter.company, meter.referenceNumber);
      await StorageService.cacheBill(bill);
      if (bill.consumerName && (!meter.consumerName || meter.consumerName !== bill.consumerName)) {
        await StorageService.saveMeter({
          ...meter,
          consumerName: bill.consumerName,
          consumerAddress: bill.consumerAddress || meter.consumerAddress,
          lastBillAmount: bill.payableWithinDueDate,
          lastDueDate: bill.dueDate,
          lastBillStatus: bill.billStatus,
          lastBillMonth: bill.billMonth,
        });
      }
      onBillChecked(bill);
    } catch {
      handleFetchFailure(prov, meter.referenceNumber);
    } finally {
      setLoadingMeterId(null);
    }
  };

  // Download PDF / open official bill portal
  const handleDownloadPdf = async (meter: SavedMeter) => {
    setDownloadingMeterId(meter.id);
    try {
      const billData: Partial<BillData> & { company: string; referenceNo: string } = {
        company: meter.company,
        referenceNo: meter.referenceNumber,
        consumerName: meter.consumerName || meter.nickname || `${meter.company} Consumer`,
        consumerId: meter.referenceNumber,
        tariff: 'General',
        load: '1 kW',
        dueDate: meter.lastDueDate || '2024-09-20',
        payableWithinDueDate: meter.lastBillAmount || 0,
        payableAfterDueDate: Math.round((meter.lastBillAmount || 0) * 1.08),
        billingMonth: meter.lastBillMonth || 'AUG 26',
        readingDate: 'N/A',
        issueDate: 'N/A',
        unitsConsumed: 0,
        billStatus: meter.lastBillStatus || 'unpaid',
        utilityType: meter.utilityType,
      };
      await BillPdfService.requestOfficialBillPdf(billData);
    } catch {
      // ignore
    } finally {
      setDownloadingMeterId(null);
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
                  isDownloadingPdf={downloadingMeterId === meter.id}
                  onCheckBill={handleCheckSavedBill}
                  onDownloadPdf={handleDownloadPdf}
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

      {/* Custom Popup Dialog */}
      <CustomPopup
        {...popup}
        darkMode={darkMode}
        isUrdu={isUrdu}
      />
    </View>
  );
};


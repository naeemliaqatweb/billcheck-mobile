import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SavedMeter, BillData } from '../types/bill';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { AdBanner } from '../components/AdBanner';
import { StorageService } from '../services/storage';
import { ApiService, createInitializedBill } from '../services/api';
import { getMeterDisplayName } from '../utils/meterUtils';
import { AppIcon } from '../components/AppIcon';
import { CustomPopup, PopupConfig } from '../components/CustomPopup';
import { DashboardBillCard } from '../components/home/DashboardBillCard';
import { OfficialBillModal } from '../components/bill/OfficialBillModal';
import { NewMeterFab } from '../components/NewMeterFab';
import { styles } from '../styles/SavedBillsScreen.styles';

interface SavedBillsScreenProps {
  savedMeters: SavedMeter[];
  language: Language;
  darkMode: boolean;
  onSelectMeter: (bill: BillData) => void;
  onRefreshSaved: () => void;
  onOpenSelectProvider?: () => void;
}

export const SavedBillsScreen: React.FC<SavedBillsScreenProps> = ({
  savedMeters,
  language,
  darkMode,
  onSelectMeter,
  onRefreshSaved,
  onOpenSelectProvider,
}) => {
  const t = TRANSLATIONS[language];
  const isUrdu = language === 'ur';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'electricity' | 'gas'>('all');
  const [loadingMeterId, setLoadingMeterId] = useState<string | null>(null);
  const [loadingOfficialMeterId, setLoadingOfficialMeterId] = useState<string | null>(null);
  const [officialModalBill, setOfficialModalBill] = useState<BillData | null>(null);
  const [showOfficialModal, setShowOfficialModal] = useState<boolean>(false);
  const [refreshingAll, setRefreshingAll] = useState<boolean>(false);
  const [popup, setPopup] = useState<PopupConfig>({
    visible: false,
    title: '',
    message: '',
  });

  // Calculate bento stats
  const totalOutstanding = useMemo(() => {
    return savedMeters.reduce((sum, m) => {
      if (m.lastBillStatus !== 'paid' && m.lastBillAmount) {
        return sum + m.lastBillAmount;
      }
      return sum;
    }, 0);
  }, [savedMeters]);

  const pendingDueCount = useMemo(() => {
    return savedMeters.filter((m) => m.lastBillStatus !== 'paid').length;
  }, [savedMeters]);

  const elecCount = useMemo(() => {
    return savedMeters.filter((m) => m.utilityType !== 'gas').length;
  }, [savedMeters]);

  const gasCount = useMemo(() => {
    return savedMeters.filter((m) => m.utilityType === 'gas').length;
  }, [savedMeters]);

  // Filter meters by search query & category
  const filteredMeters = useMemo(() => {
    return savedMeters.filter((meter) => {
      const matchesType =
        filterType === 'all' ||
        (filterType === 'electricity' && meter.utilityType !== 'gas') ||
        (filterType === 'gas' && meter.utilityType === 'gas');

      if (!matchesType) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const displayName = getMeterDisplayName(meter).toLowerCase();
      const ref = (meter.referenceNumber || '').toLowerCase();
      const consumer = (meter.consumerName || '').toLowerCase();

      return displayName.includes(q) || ref.includes(q) || consumer.includes(q);
    });
  }, [savedMeters, filterType, searchQuery]);

  const handleDelete = (meter: SavedMeter) => {
    setPopup({
      visible: true,
      type: 'error',
      title: isUrdu ? 'میٹر ہٹائیں' : 'Remove Saved Meter',
      message: `${t.deleteConfirm}\n(${getMeterDisplayName(meter)} - ${meter.referenceNumber})`,
      primaryText: isUrdu ? 'ہٹائیں' : 'Delete',
      secondaryText: isUrdu ? 'منسوخ' : 'Cancel',
      onPrimaryPress: async () => {
        setPopup((p) => ({ ...p, visible: false }));
        await StorageService.deleteMeter(meter.id);
        onRefreshSaved();
      },
      onClose: () => setPopup((p) => ({ ...p, visible: false })),
    });
  };

  const handleOpenMeter = async (meter: SavedMeter) => {
    // 1. Instant cache check first (<5ms)
    const cached = await StorageService.getCachedBill(meter.company, meter.referenceNumber);
    if (cached && !cached.isMockData) {
      onSelectMeter(cached);
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
      onSelectMeter(bill);
    } catch {
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
      onSelectMeter(bill);
    } finally {
      setLoadingMeterId(null);
    }
  };

  const handleOpenOfficialView = async (meter: SavedMeter) => {
    setLoadingOfficialMeterId(meter.id);
    try {
      let bill = await StorageService.getCachedBill(meter.company, meter.referenceNumber);
      if (!bill) {
        try {
          bill = await ApiService.fetchBill(meter.company, meter.referenceNumber, false);
          if (bill) {
            await StorageService.cacheBill(bill);
          }
        } catch {
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

  const handleRefreshAll = async () => {
    if (savedMeters.length === 0) return;
    setRefreshingAll(true);
    try {
      for (const meter of savedMeters) {
        try {
          const fresh = await ApiService.fetchBill(meter.company, meter.referenceNumber, false);
          if (fresh) {
            await StorageService.cacheBill(fresh);
            await StorageService.saveMeter({
              ...meter,
              consumerName: fresh.consumerName || meter.consumerName,
              consumerAddress: fresh.consumerAddress || meter.consumerAddress,
              lastBillAmount: fresh.payableWithinDueDate,
              lastDueDate: fresh.dueDate,
              lastBillStatus: fresh.billStatus,
              lastBillMonth: fresh.billMonth,
              lastCheckedDate: new Date().toISOString().split('T')[0],
            });
          }
        } catch {
          // ignore single failure
        }
      }
      onRefreshSaved();
    } finally {
      setRefreshingAll(false);
    }
  };

  return (
    <View style={[styles.outerContainer, darkMode ? styles.darkBg : styles.lightBg]}>
      {/* Top App Bar */}
      <View style={styles.topAppBar}>
        <View style={styles.topAppLeft}>
          <Image
            source={require('../assets/images/app-logo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={styles.appBarTitleGroup}>
            <Text style={styles.appBarMainTitle}>BillCheck PK</Text>
            <Text style={styles.appBarSubtitle}>
              {isUrdu ? 'محفوظ شدہ میٹرز' : 'Saved Meters'}
            </Text>
          </View>
        </View>

        <View style={styles.topAppRight}>
          <TouchableOpacity
            style={styles.topIconBtn}
            onPress={handleRefreshAll}
            disabled={refreshingAll}
            activeOpacity={0.7}
            accessibilityLabel="Refresh All"
          >
            {refreshingAll ? (
              <ActivityIndicator size="small" color="#62FF96" />
            ) : (
              <AppIcon name="refresh" size={17} color="#62FF96" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshingAll}
            onRefresh={handleRefreshAll}
            colors={['#10B981', '#006D35']}
            tintColor={darkMode ? '#62FF96' : '#006D35'}
            progressBackgroundColor={darkMode ? '#132033' : '#FFFFFF'}
          />
        }
      >
        {/* Subheader Utility Banner with Circuit Motif */}
        <View style={styles.circuitBanner}>
          <View style={styles.gridSyncRow}>
            <View style={styles.gridSyncLeft}>
              <View style={styles.pulseDot} />
              <Text style={styles.gridSyncText}>PAKISTAN NATIONAL GRID SYNC</Text>
            </View>
            <Text style={styles.liveTagText}>{isUrdu ? 'لائیو' : 'Live'}</Text>
          </View>

          <Text style={styles.bannerHeadline}>
            {isUrdu ? 'محفوظ شدہ میٹرز' : 'Saved Meters'}
          </Text>
          <Text style={styles.bannerDescription}>
            {isUrdu
              ? 'اپنے تمام یوٹیلیٹی میٹرز اور لائیو ٹیرف بلز کو فوری مینیج کریں۔'
              : 'Manage quick-access utility consumer IDs & live tariff bills.'}
          </Text>

          {/* Quick Stats Bento Strip */}
          <View style={styles.bentoStrip}>
            <View style={styles.bentoCol}>
              <Text style={styles.bentoLabel}>Active Feeders</Text>
              <Text style={styles.bentoVal}>{savedMeters.length} Meters</Text>
            </View>

            <View style={styles.bentoDivider} />

            <View style={styles.bentoCol}>
              <Text style={styles.bentoLabel}>Total Outstanding</Text>
              <Text style={styles.bentoValGreen}>
                Rs. {totalOutstanding.toLocaleString()}
              </Text>
            </View>

            <View style={styles.bentoDivider} />

            <View style={[styles.bentoCol, styles.bentoColRight]}>
              <Text style={styles.bentoLabel}>Due Soon</Text>
              <View style={styles.duePill}>
                <Text style={styles.duePillText}>{pendingDueCount} Pending</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main Content Canvas */}
        <View style={styles.mainCanvas}>
          {/* Search & Fast Filter Bar */}
          <View
            style={[
              styles.searchBarContainer,
              darkMode ? styles.searchBarDark : styles.searchBarLight,
            ]}
          >
            <AppIcon name="search" size={18} color="#778598" />
            <TextInput
              style={[
                styles.searchInput,
                darkMode ? styles.darkText : styles.lightText,
                isUrdu && styles.rtlText,
              ]}
              placeholder={
                isUrdu
                  ? 'میٹر کا نام، کمپنی یا 14 ہندسوں کا ریفرنس نمبر تلاش کریں...'
                  : 'Search nickname, company or 14-digit ref...'
              }
              placeholderTextColor={darkMode ? '#778598' : '#94A3B8'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
                <AppIcon name="close" size={16} color="#778598" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Segmented Category Filter Chips */}
          <View style={styles.filterRow}>
            {/* All */}
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterType === 'all'
                  ? styles.filterChipActive
                  : (darkMode ? styles.filterChipInactiveDark : styles.filterChipInactiveLight),
              ]}
              onPress={() => setFilterType('all')}
              activeOpacity={0.7}
            >
              <Text
                style={
                  filterType === 'all'
                    ? styles.filterChipTextActive
                    : (darkMode ? styles.filterChipTextInactiveDark : styles.filterChipTextInactiveLight)
                }
              >
                {t.filterAll}
              </Text>
              {filterType === 'all' && (
                <View style={styles.countBadgeActive}>
                  <Text style={styles.countBadgeTextActive}>{savedMeters.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Electricity */}
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterType === 'electricity'
                  ? styles.filterChipActive
                  : (darkMode ? styles.filterChipInactiveDark : styles.filterChipInactiveLight),
              ]}
              onPress={() => setFilterType('electricity')}
              activeOpacity={0.7}
            >
              <AppIcon
                name="bolt"
                size={14}
                color={filterType === 'electricity' ? '#FFFFFF' : '#006D35'}
              />
              <Text
                style={
                  filterType === 'electricity'
                    ? styles.filterChipTextActive
                    : (darkMode ? styles.filterChipTextInactiveDark : styles.filterChipTextInactiveLight)
                }
              >
                {t.filterElectricity} ({elecCount})
              </Text>
            </TouchableOpacity>

            {/* Gas */}
            <TouchableOpacity
              style={[
                styles.filterChip,
                filterType === 'gas'
                  ? styles.filterChipActive
                  : (darkMode ? styles.filterChipInactiveDark : styles.filterChipInactiveLight),
              ]}
              onPress={() => setFilterType('gas')}
              activeOpacity={0.7}
            >
              <AppIcon
                name="flame"
                size={14}
                color={filterType === 'gas' ? '#FFFFFF' : '#BA1A1A'}
              />
              <Text
                style={
                  filterType === 'gas'
                    ? styles.filterChipTextActive
                    : (darkMode ? styles.filterChipTextInactiveDark : styles.filterChipTextInactiveLight)
                }
              >
                {t.filterGas} ({gasCount})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Meter Cards List */}
          {filteredMeters.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                darkMode ? styles.emptyCardDark : styles.emptyCardLight,
              ]}
            >
              <View style={styles.emptyIconCircle}>
                <AppIcon name="receipt" size={36} color="#778598" />
              </View>
              <Text style={[styles.emptyTitle, darkMode ? styles.darkText : styles.lightText]}>
                {savedMeters.length === 0 ? t.noSavedBills : (isUrdu ? 'کوئی میٹر نہیں ملا' : 'No Meters Found')}
              </Text>
              <Text style={[styles.emptySub, darkMode ? styles.darkSub : styles.lightSub]}>
                {isUrdu
                  ? 'نیا بل چیک کریں اور "یہ میٹر محفوظ کریں" دبا کر یہاں شامل کریں۔'
                  : 'Check any bill from Home or tap "Add Another Meter" below.'}
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
                onCheckBill={handleOpenMeter}
                onOfficialView={handleOpenOfficialView}
                onDeleteMeter={handleDelete}
                onStatusChange={onRefreshSaved}
              />
            ))
          )}

          {/* Add Another Meter Prominent Action Card */}
          <TouchableOpacity
            style={[
              styles.addAnotherCard,
              darkMode ? styles.addAnotherCardDark : styles.addAnotherCardLight,
            ]}
            onPress={() => onOpenSelectProvider && onOpenSelectProvider()}
            activeOpacity={0.8}
          >
            <View style={styles.addIconCircle}>
              <AppIcon name="plus" size={16} color="#62FF96" />
            </View>
            <Text
              style={[
                styles.addAnotherText,
                darkMode ? styles.darkText : styles.lightText,
              ]}
            >
              {isUrdu ? 'نیا میٹر شامل کریں' : 'Add Another Meter'}
            </Text>
          </TouchableOpacity>

          {/* Security & Trust Footnote */}
          <View style={styles.securityFootnote}>
            <View style={styles.securityTitleRow}>
              <AppIcon name="shield" size={14} color="#006D35" />
              <Text style={styles.securityTitle}>
                Encrypted offline reference storage • Arcloom Tech
              </Text>
            </View>
            <Text style={styles.securitySub}>
              No passwords stored. Direct connection to DISCO & Gas utility public APIs.
            </Text>
          </View>

          <AdBanner darkMode={darkMode} language={language} />
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

      <CustomPopup {...popup} darkMode={darkMode} isUrdu={isUrdu} />
    </View>
  );
};

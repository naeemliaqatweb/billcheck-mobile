import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Share,
} from 'react-native';
import { SavedMeter, BillData } from '../types/bill';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { AdBanner } from '../components/AdBanner';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';
import { AppIcon } from '../components/AppIcon';
import { ProviderLogo } from '../components/ProviderLogo';
import { CustomPopup, PopupConfig } from '../components/CustomPopup';
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
      const nickname = (meter.nickname || '').toLowerCase();
      const ref = (meter.referenceNumber || '').toLowerCase();
      const company = (meter.company || '').toLowerCase();

      return nickname.includes(q) || ref.includes(q) || company.includes(q);
    });
  }, [savedMeters, filterType, searchQuery]);

  const handleDelete = (meter: SavedMeter) => {
    setPopup({
      visible: true,
      type: 'error',
      title: isUrdu ? 'میٹر ہٹائیں' : 'Remove Saved Meter',
      message: `${t.deleteConfirm}\n(${meter.nickname} - ${meter.referenceNumber})`,
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
    setLoadingMeterId(meter.id);
    try {
      const bill = await ApiService.fetchBill(meter.company, meter.referenceNumber);
      await StorageService.cacheBill(bill);
      onSelectMeter(bill);
    } catch {
      setPopup({
        visible: true,
        type: 'error',
        title: t.errorTitle,
        message: t.fetchFailed,
        primaryText: isUrdu ? 'ٹھیک ہے' : 'OK',
        onClose: () => setPopup((p) => ({ ...p, visible: false })),
      });
    } finally {
      setLoadingMeterId(null);
    }
  };

  const handleCopyRef = (meter: SavedMeter) => {
    setPopup({
      visible: true,
      type: 'info',
      title: isUrdu ? 'ریفرنس نمبر' : 'Reference Number',
      message: `${meter.company} Ref: ${meter.referenceNumber}\n${meter.nickname}`,
      primaryText: isUrdu ? 'شیئر کریں' : 'Share',
      secondaryText: isUrdu ? 'ٹھیک ہے' : 'OK',
      onPrimaryPress: async () => {
        setPopup((p) => ({ ...p, visible: false }));
        try {
          await Share.share({
            message: `${meter.company} Reference Number: ${meter.referenceNumber} (${meter.nickname})`,
          });
        } catch {
          // ignore
        }
      },
      onClose: () => setPopup((p) => ({ ...p, visible: false })),
    });
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
              lastBillAmount: fresh.payableWithinDueDate,
              lastDueDate: fresh.dueDate,
              lastBillStatus: fresh.billStatus,
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
      >
        {/* Subheader Utility Banner with Circuit Motif */}
        <View style={styles.circuitBanner}>
          <View style={styles.gridSyncRow}>
            <View style={styles.gridSyncLeft}>
              <View style={styles.pulseDot} />
              <Text style={styles.gridSyncText}>PAKISTAN NATIONAL GRID SYNC</Text>
            </View>
            <Text style={styles.liveTagText}>v2.4 Live</Text>
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
                color={filterType === 'electricity' ? '#62FF96' : '#006D35'}
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
                color={filterType === 'gas' ? '#62FF96' : '#BA1A1A'}
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
                darkMode ? styles.meterCardDark : styles.meterCardLight,
              ]}
            >
              <View style={styles.emptyIconCircle}>
                <AppIcon name="receipt" size={36} color="#778598" />
              </View>
              <Text style={[styles.emptyTitle, darkMode ? styles.darkText : styles.lightText]}>
                {savedMeters.length === 0 ? t.noSavedBills : 'کوئی میٹر نہیں ملا / No Meters Found'}
              </Text>
              <Text style={[styles.emptySub, darkMode ? styles.darkSub : styles.lightSub]}>
                {isUrdu
                  ? 'نیا بل چیک کریں اور "یہ میٹر محفوظ کریں" دبا کر یہاں شامل کریں۔'
                  : 'Check any bill from Home or tap "Add Another Meter" below.'}
              </Text>
            </View>
          ) : (
            filteredMeters.map((meter) => {
              const isLoadingThis = loadingMeterId === meter.id;
              const isPaid = meter.lastBillStatus === 'paid';
              const isOverdue = meter.lastBillStatus === 'overdue';

              return (
                <View
                  key={meter.id}
                  style={[
                    styles.meterCard,
                    darkMode ? styles.meterCardDark : styles.meterCardLight,
                  ]}
                >
                  {/* Card Top Row: Provider Logo + Meter Info */}
                  <View style={styles.cardTopRow}>
                    {/* PROVIDER LOGO BOX (Stitch Requirement) */}
                    <View
                      style={[
                        styles.logoBoxWrapper,
                        darkMode && styles.logoBoxDark,
                      ]}
                    >
                      <ProviderLogo code={meter.company} size={40} />
                    </View>

                    {/* Meter Info Column */}
                    <View style={styles.cardMiddleInfo}>
                      <View style={styles.nicknameRow}>
                        <Text
                          style={[
                            styles.cardNickname,
                            darkMode ? styles.darkText : styles.lightText,
                          ]}
                          numberOfLines={1}
                        >
                          {meter.nickname || `${meter.company} Meter`}
                        </Text>
                        <View
                          style={[
                            styles.companyPill,
                            darkMode && styles.companyPillDark,
                          ]}
                        >
                          <Text style={styles.companyPillText}>{meter.company}</Text>
                        </View>
                      </View>

                      {/* Reference Number with Copy Button */}
                      <View style={styles.refRow}>
                        <Text
                          style={[
                            styles.refText,
                            darkMode ? styles.darkText : styles.lightText,
                          ]}
                        >
                          {meter.referenceNumber}
                        </Text>
                        <TouchableOpacity
                          style={styles.copyIconBtn}
                          onPress={() => handleCopyRef(meter)}
                          activeOpacity={0.7}
                          accessibilityLabel="Copy Reference"
                        >
                          <AppIcon name="share" size={13} color="#778598" />
                        </TouchableOpacity>
                      </View>

                      {/* Meta Stats Row */}
                      <View style={styles.metaStatsRow}>
                        <Text
                          style={[
                            styles.metaCheckedText,
                            darkMode ? styles.darkSub : styles.lightSub,
                          ]}
                        >
                          {meter.lastCheckedDate
                            ? `Checked ${meter.lastCheckedDate}`
                            : 'Synchronized'}
                        </Text>
                        <Text style={darkMode ? styles.darkSub : styles.lightSub}>•</Text>
                        {meter.lastBillAmount ? (
                          <Text
                            style={[
                              styles.metaAmountText,
                              darkMode ? styles.darkText : styles.lightText,
                            ]}
                          >
                            Rs. {meter.lastBillAmount.toLocaleString()}
                          </Text>
                        ) : null}

                        {/* Status Badge */}
                        {isPaid ? (
                          <View style={styles.dueBadgePaid}>
                            <Text style={styles.dueBadgeTextPaid}>Paid</Text>
                          </View>
                        ) : isOverdue ? (
                          <View style={styles.dueBadgeOverdue}>
                            <Text style={styles.dueBadgeTextOverdue}>Overdue</Text>
                          </View>
                        ) : (
                          <View style={styles.dueBadgeDue}>
                            <Text style={styles.dueBadgeTextDue}>
                              {meter.lastDueDate ? `Due ${meter.lastDueDate}` : 'Due Soon'}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Card Bottom CTA Action Bar */}
                  <View style={styles.cardBottomBar}>
                    <View style={styles.phaseInfoLeft}>
                      <View
                        style={[
                          styles.phaseDot,
                          {
                            backgroundColor: isPaid
                              ? '#00A854'
                              : meter.utilityType === 'gas'
                              ? '#006D35'
                              : '#62FF96',
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.phaseText,
                          darkMode ? styles.darkSub : styles.lightSub,
                        ]}
                      >
                        {meter.utilityType === 'gas' ? 'Gas Consumer' : 'Domestic 1-Phase'}
                      </Text>
                    </View>

                    <View style={styles.actionsRight}>
                      {/* Delete Meter */}
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDelete(meter)}
                        activeOpacity={0.7}
                        accessibilityLabel="Delete Meter"
                      >
                        <AppIcon name="trash" size={16} color="#BA1A1A" />
                      </TouchableOpacity>

                      {/* View Bill Button */}
                      <TouchableOpacity
                        style={styles.viewBillBtn}
                        onPress={() => handleOpenMeter(meter)}
                        disabled={isLoadingThis}
                        activeOpacity={0.85}
                      >
                        {isLoadingThis ? (
                          <ActivityIndicator size="small" color="#00210B" />
                        ) : (
                          <>
                            <Text style={styles.viewBillBtnText}>{t.checkBillBtn}</Text>
                            <AppIcon name="arrow-right" size={14} color="#00210B" />
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
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

      <CustomPopup {...popup} darkMode={darkMode} isUrdu={isUrdu} />
    </View>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Image,
} from 'react-native';
import { BillData, SavedMeter, BillMonthHistory } from '../types/bill';
import { Language } from '../i18n/translations';
import { AdBanner } from '../components/AdBanner';
import { AppIcon } from '../components/AppIcon';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';
import { AnalyticsTelemetryChart } from '../components/analytics/AnalyticsTelemetryChart';
import { AnalyticsBentoGrid } from '../components/analytics/AnalyticsBentoGrid';
import { RegulatoryNoticeCard } from '../components/analytics/RegulatoryNoticeCard';
import { HistoryTable } from '../components/HistoryTable';
import { NewMeterFab } from '../components/NewMeterFab';
import { CustomPopup, PopupConfig } from '../components/CustomPopup';
import { styles } from '../styles/HistoryScreen.styles';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

interface HistoryScreenProps {
  currentBill: BillData | null;
  savedMeters?: SavedMeter[];
  language: Language;
  darkMode: boolean;
  onSelectBill?: (bill: BillData) => void;
  onNavigateHome?: () => void;
  onOpenSelectProvider?: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  currentBill,
  savedMeters = [],
  language,
  darkMode,
  onSelectBill: _onSelectBill,
  onNavigateHome: _onNavigateHome,
  onOpenSelectProvider,
}) => {
  const isUrdu = language === 'ur';

  // Utility category filter: 'electricity' vs 'gas'
  const [utilityType, setUtilityType] = useState<'electricity' | 'gas'>('electricity');
  const [selectedYear, setSelectedYear] = useState<string>('2024');

  const [activeBill, setActiveBill] = useState<BillData | null>(currentBill);
  const [selectedMeterId, setSelectedMeterId] = useState<string | null>(
    currentBill ? `${currentBill.company}_${currentBill.referenceNo}` : (savedMeters[0]?.id || null)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [popup, setPopup] = useState<PopupConfig>({
    visible: false,
    title: '',
    message: '',
  });

  // Filter saved meters based on the selected utility type
  const filteredMeters = useMemo(() => {
    return savedMeters.filter((m) => {
      if (utilityType === 'gas') return m.utilityType === 'gas';
      return m.utilityType !== 'gas';
    });
  }, [savedMeters, utilityType]);

  useEffect(() => {
    const initHistory = async () => {
      if (currentBill && currentBill.history12Months && currentBill.history12Months.length > 0) {
        setActiveBill(currentBill);
        setSelectedMeterId(`${currentBill.company}_${currentBill.referenceNo}`);
        setUtilityType(currentBill.company?.toLowerCase().includes('gas') || currentBill.company === 'SNGPL' || currentBill.company === 'SSGC' ? 'gas' : 'electricity');
        return;
      }

      if (savedMeters.length > 0) {
        const matching = savedMeters.find((m) => utilityType === 'gas' ? m.utilityType === 'gas' : m.utilityType !== 'gas') || savedMeters[0];
        await loadMeterData(matching);
        return;
      }

      // Check last cached bill from storage
      const lastChecked = await StorageService.getLastCheckedBill();
      if (lastChecked && lastChecked.history12Months && lastChecked.history12Months.length > 0) {
        setActiveBill(lastChecked);
        setSelectedMeterId(`${lastChecked.company}_${lastChecked.referenceNo}`);
      }
    };

    initHistory();
  }, [currentBill, savedMeters, utilityType]);

  const loadMeterData = async (meter: SavedMeter) => {
    setLoading(true);
    setSelectedMeterId(meter.id);
    try {
      const cached = await StorageService.getCachedBill(meter.company, meter.referenceNumber);
      if (cached && cached.history12Months && cached.history12Months.length > 0) {
        setActiveBill(cached);
        setLoading(false);
        return;
      }

      const fresh = await ApiService.fetchBill(meter.company, meter.referenceNumber, false);
      if (fresh) {
        await StorageService.cacheBill(fresh);
        setActiveBill(fresh);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshActiveMeter = async () => {
    if (!activeBill) return;
    setRefreshing(true);
    try {
      const fresh = await ApiService.fetchBill(activeBill.company, activeBill.referenceNo, false);
      if (fresh) {
        await StorageService.cacheBill(fresh);
        setActiveBill(fresh);
      }
    } catch {
      // fallback
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadDemoMeter = async () => {
    setLoading(true);
    try {
      const demoBill = await ApiService.fetchBill('LESCO', '15115371598719', false);
      if (demoBill) {
        await StorageService.cacheBill(demoBill);
        setActiveBill(demoBill);
        setSelectedMeterId('LESCO_15115371598719');
        setUtilityType('electricity');
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsv = async () => {
    if (!activeBill || !historyData.length) {
      setPopup({
        visible: true,
        type: 'info',
        title: isUrdu ? 'کوئی ڈیٹا نہیں' : 'No Data',
        message: isUrdu ? 'براہ کرم پہلے کسی میٹر کا ڈیٹا منتخب کریں۔' : 'Please load a meter first to export telemetry data.',
        primaryText: isUrdu ? 'ٹھیک ہے' : 'OK',
        onClose: () => setPopup((p) => ({ ...p, visible: false })),
      });
      return;
    }

    const csvRows = [
      'Month,Units,PayableAmount,BillStatus',
      ...historyData.map((h) => `${h.month},${h.units},${h.amount},${h.status}`),
    ];
    const csvContent = csvRows.join('\n');

    try {
      await Share.share({
        title: `${activeBill.company} 12-Month Telemetry Export`,
        message: `BillCheck PK Telemetry Export for ${activeBill.company} (${activeBill.referenceNo}):\n\n${csvContent}`,
      });
    } catch {
      // ignore
    }
  };

  const handleOpenSimulator = () => {
    setPopup({
      visible: true,
      type: 'info',
      title: isUrdu ? 'نیپرا ٹیرف سمیلیٹر' : 'NEPRA Tariff Simulator',
      message: isUrdu
        ? 'بجلی اور گیس کے نئے نیپرا ٹیرف سلیبس کے مطابق بل کا تخمینہ جانچیں۔ آف پیک ریٹس اور پروٹیکٹڈ کیٹیگری کے فوائد خودکار کیلکولیٹ کیے جاتے ہیں۔'
        : 'Simulate progressive multi-slab tariff costs, FPA, and protected category benefits instantly across all Pakistani DISCOs.',
      primaryText: isUrdu ? 'ٹھیک ہے' : 'Got it',
      onClose: () => setPopup((p) => ({ ...p, visible: false })),
    });
  };

  // Build enriched history: providers return previous months only, so we
  // append the current bill as the final entry if it isn't already there.
  const historyData: BillMonthHistory[] = useMemo(() => {
    const base: BillMonthHistory[] = activeBill?.history12Months || [];
    if (!activeBill || !activeBill.billMonth) return base;

    // Normalise: 'AUG 26' and 'Aug 26' should be treated the same
    const currentLabel = activeBill.billMonth.trim().toUpperCase();
    const lastLabel = base.length > 0 ? (base[base.length - 1].month || '').trim().toUpperCase() : '';

    if (lastLabel === currentLabel) return base; // already in history

    // Derive 2-digit year from label e.g. 'AUG 26' -> 2026
    const yrStr = currentLabel.split(' ')[1] || '26';
    const fullYear = 2000 + parseInt(yrStr, 10);

    const currentEntry: BillMonthHistory = {
      month: activeBill.billMonth.trim().toUpperCase(), // e.g. 'AUG 26'
      year: fullYear,
      units: activeBill.unitsConsumed || 0,
      amount: activeBill.payableWithinDueDate || 0,
      status: activeBill.billStatus === 'paid' ? 'paid' : 'unpaid',
    };

    return [...base, currentEntry];
  }, [activeBill]);

  const hasHistory = historyData.length > 0;

  const meterDisplayLabel = activeBill
    ? `${activeBill.company} # ${activeBill.formattedRefNo || activeBill.referenceNo}`
    : 'LESCO # 08 11254 0938400 U';

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
          <View style={styles.appTitleGroup}>
            <Text style={styles.appTitle}>
              BillCheck PK
            </Text>
            <Text style={styles.appSubtitle}>
              {isUrdu ? 'تجزیہ و رجحانات' : 'Analytics & Trends'}
            </Text>
          </View>
        </View>

        <View style={styles.topAppRight}>
          <View style={styles.livePill}>
            <Text style={styles.liveText}>LIVE</Text>
            <View style={styles.pulseDot} />
          </View>

          <TouchableOpacity
            style={styles.topBoltBtn}
            onPress={handleRefreshActiveMeter}
            disabled={refreshing}
            activeOpacity={0.7}
            accessibilityLabel="Refresh Telemetry"
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#62FF96" />
            ) : (
              <AppIcon name="bolt" size={19} color="#62FF96" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefreshActiveMeter}
            colors={['#10B981', '#006D35']}
            tintColor={darkMode ? '#62FF96' : '#006D35'}
            progressBackgroundColor={darkMode ? '#132033' : '#FFFFFF'}
          />
        }
      >
        <View style={styles.mainCanvas}>
          {/* Screen Title & Year Picker Row */}
          <View style={styles.screenTitleRow}>
            <View>
              <Text style={[styles.screenHeadline, darkMode ? styles.darkText : styles.lightText]}>
                {isUrdu ? 'تجزیہ اور رجحانات' : 'Analytics & Trends'}
              </Text>
              <Text style={[styles.screenSubheadline, darkMode ? styles.darkSub : styles.lightSub]}>
                {isUrdu ? 'کثیر فراہم کنندہ کنزمپشن ٹیلی میٹری' : 'Multi-provider consumption telemetry'}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.yearPickerBtn, !darkMode && styles.yearPickerBtnLight]}
              onPress={() => setSelectedYear((y) => (y === '2024' ? '2025' : '2024'))}
              activeOpacity={0.8}
            >
              <AppIcon name="calendar" size={14} color={darkMode ? '#62FF96' : '#006D35'} />
              <Text style={[styles.yearPickerText, !darkMode && styles.yearPickerTextLight]}>{selectedYear}</Text>
              <AppIcon name="chevron-down" size={14} color={darkMode ? '#62FF96' : '#006D35'} />
            </TouchableOpacity>
          </View>

          {/* Segmented Pill Switcher (Electricity vs Gas) */}
          <View style={[styles.segmentedContainer, !darkMode && styles.segmentedContainerLight]}>
            <TouchableOpacity
              style={[
                styles.segmentedBtn,
                utilityType === 'electricity' && styles.segmentedBtnActive,
              ]}
              onPress={() => setUtilityType('electricity')}
              activeOpacity={0.85}
            >
              <AppIcon
                name="zap"
                size={15}
                color={utilityType === 'electricity' ? '#FFFFFF' : '#778598'}
              />
              <Text
                style={[
                  styles.segmentedText,
                  utilityType === 'electricity' && styles.segmentedTextActive,
                ]}
              >
                {isUrdu ? 'بجلی (kWh / Rs)' : 'Electricity (kWh / Rs)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentedBtn,
                utilityType === 'gas' && styles.segmentedBtnActive,
              ]}
              onPress={() => setUtilityType('gas')}
              activeOpacity={0.85}
            >
              <AppIcon
                name="flame"
                size={15}
                color={utilityType === 'gas' ? '#FFFFFF' : '#778598'}
              />
              <Text
                style={[
                  styles.segmentedText,
                  utilityType === 'gas' && styles.segmentedTextActive,
                ]}
              >
                {isUrdu ? 'سوئی گیس (MMBTU / Rs)' : 'Gas (MMBTU / Rs)'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Saved Meters Horizontal Chip Selector */}
          {filteredMeters.length > 0 && (
            <View style={styles.meterSelectorSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.meterChipScroll}
              >
                {filteredMeters.map((m) => {
                  const isSelected = selectedMeterId === m.id;
                  return (
                    <TouchableOpacity
                      key={m.id}
                      style={[
                        styles.meterChip,
                        isSelected
                          ? styles.meterChipActive
                          : darkMode
                          ? styles.meterChipDark
                          : styles.meterChipLight,
                      ]}
                      onPress={() => loadMeterData(m)}
                      activeOpacity={0.7}
                    >
                      <AppIcon
                        name={m.utilityType === 'gas' ? 'flame' : 'zap'}
                        size={13}
                        color={isSelected ? '#FFFFFF' : '#62FF96'}
                      />
                      <Text
                        style={[
                          styles.meterChipText,
                          isSelected
                            ? { color: '#FFFFFF' }
                            : darkMode
                            ? styles.darkText
                            : styles.lightText,
                        ]}
                      >
                        {m.nickname || m.company} ({m.company})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Main State Handling */}
          {loading ? (
            <SkeletonLoader darkMode={darkMode} />
          ) : !hasHistory ? (
            <View style={[styles.emptyCard, darkMode ? styles.darkCard : styles.lightCard]}>
              <AppIcon name="stats" size={44} color="#62FF96" />
              <Text style={[styles.emptyTitle, darkMode ? styles.darkText : styles.lightText]}>
                {isUrdu ? 'کوئی ٹیلی میٹری ڈیٹا موجود نہیں' : 'No Telemetry Data Available'}
              </Text>
              <Text style={[styles.emptyDesc, darkMode ? styles.darkSub : styles.lightSub]}>
                {isUrdu
                  ? 'اپنا پہلا بل چیک کریں یا لیسکو کا ریئل 12 ماہ کا لائیو ٹیلی میٹری ڈیٹا لوڈ کریں۔'
                  : 'Check a bill on the home screen or load the live LESCO 12-month telemetry dataset below.'}
              </Text>
              <TouchableOpacity
                style={styles.demoMeterBtn}
                onPress={handleLoadDemoMeter}
                activeOpacity={0.8}
              >
                <AppIcon name="bolt" size={16} color="#FFFFFF" />
                <Text style={styles.demoMeterBtnText}>
                  {isUrdu ? 'لیسکو 12 ماہ کا لائیو ڈیٹا لوڈ کریں' : 'Load Live LESCO 12-Mo Data (15115371598719)'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* 1. Neon Glow Hero Chart Card */}
              <AnalyticsTelemetryChart
                history={historyData}
                meterLabel={meterDisplayLabel}
                utilityType={utilityType}
                darkMode={darkMode}
                language={language}
              />

              {/* 2. Key Telemetry Bento Grid (3 Cards matching Stitch) */}
              <AnalyticsBentoGrid
                historyData={historyData}
                utilityType={utilityType}
                darkMode={darkMode}
                language={language}
              />

              {/* 3. Regulatory Notice Banner */}
              <RegulatoryNoticeCard
                darkMode={darkMode}
                language={language}
              />

              {/* 4. Action Buttons (Download CSV & Tariff Simulator) */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[
                    styles.actionBtnOutline,
                    darkMode ? styles.actionBtnOutlineDark : styles.actionBtnOutlineLight,
                  ]}
                  onPress={handleDownloadCsv}
                  activeOpacity={0.8}
                >
                  <AppIcon name="file-download" size={17} color={darkMode ? '#F8F9FF' : '#0B1C30'} />
                  <Text
                    style={[
                      styles.actionBtnOutlineText,
                      darkMode ? styles.darkText : styles.lightText,
                    ]}
                  >
                    {isUrdu ? 'CSV ڈاؤن لوڈ کریں' : 'Download CSV'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtnPrimary}
                  onPress={handleOpenSimulator}
                  activeOpacity={0.85}
                >
                  <AppIcon name="calculate" size={18} color="#FFFFFF" />
                  <Text style={styles.actionBtnPrimaryText}>
                    {isUrdu ? 'ٹیرف سمیلیٹر' : 'Tariff Simulator'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 5. Complete 12-Month Tabular Breakdown Archive */}
              <HistoryTable
                history={historyData}
                darkMode={darkMode}
                language={language}
              />
            </>
          )}

          <AdBanner darkMode={darkMode} language={language} />
        </View>
      </ScrollView>

      {/* Floating Action Button (New Meter FAB) */}
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

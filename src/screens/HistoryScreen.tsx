import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { BillData, SavedMeter, BillMonthHistory } from '../types/bill';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { ConsumptionChart } from '../components/ConsumptionChart';
import { HistoryTable } from '../components/HistoryTable';
import { AdBanner } from '../components/AdBanner';
import { AppIcon } from '../components/AppIcon';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';
import { EnergySavingTips } from '../components/history/EnergySavingTips';
import { ConsumptionMetricsGrid } from '../components/history/ConsumptionMetricsGrid';
import { styles } from '../styles/HistoryScreen.styles';

interface HistoryScreenProps {
  currentBill: BillData | null;
  savedMeters?: SavedMeter[];
  language: Language;
  darkMode: boolean;
  onSelectBill?: (bill: BillData) => void;
  onNavigateHome?: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  currentBill,
  savedMeters = [],
  language,
  darkMode,
  onNavigateHome,
}) => {
  const t = TRANSLATIONS[language];
  const isUrdu = language === 'ur';

  const [activeBill, setActiveBill] = useState<BillData | null>(currentBill);
  const [selectedMeterId, setSelectedMeterId] = useState<string | null>(
    currentBill ? `${currentBill.company}_${currentBill.referenceNo}` : (savedMeters[0]?.id || null)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const initHistory = async () => {
      if (currentBill && currentBill.history12Months && currentBill.history12Months.length > 0) {
        setActiveBill(currentBill);
        setSelectedMeterId(`${currentBill.company}_${currentBill.referenceNo}`);
        return;
      }

      if (savedMeters.length > 0) {
        await loadMeterData(savedMeters[0]);
        return;
      }

      // Check last checked bill from storage
      const lastChecked = await StorageService.getLastCheckedBill();
      if (lastChecked && lastChecked.history12Months && lastChecked.history12Months.length > 0) {
        setActiveBill(lastChecked);
        setSelectedMeterId(`${lastChecked.company}_${lastChecked.referenceNo}`);
      }
    };

    initHistory();
  }, [currentBill, savedMeters]);

  const loadMeterData = async (meter: SavedMeter) => {
    setSelectedMeterId(meter.id);
    setLoading(true);
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
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const historyData: BillMonthHistory[] = activeBill?.history12Months || [];
  const hasHistory = historyData.length > 0;

  const rawName = activeBill?.consumerName || '';
  const cleanConsumerName =
    rawName.replace(/[\.\s]+$/, '').trim() ||
    activeBill?.formattedRefNo ||
    activeBill?.referenceNo ||
    '';

  const getChipLabel = (nickname: string, company: string) => {
    const nick = nickname.trim();
    const comp = company.trim().toUpperCase();
    if (nick.toUpperCase().includes(comp)) {
      return nick;
    }
    return `${nick} (${comp})`;
  };

  return (
    <ScrollView
      style={[styles.container, darkMode ? styles.darkBg : styles.lightBg]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.headerTitleRow}>
              <AppIcon name="stats" size={24} color="#6366F1" />
              <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText, isUrdu && styles.rtlText]}>
                {t.analyticsTitle}
              </Text>
            </View>
            <Text style={[styles.subtitle, darkMode ? styles.darkSub : styles.lightSub, isUrdu && styles.rtlText]} numberOfLines={1}>
              {activeBill
                ? `${activeBill.company} • ${cleanConsumerName}`
                : (isUrdu ? 'آپ کے بجلی و گیس بلوں کا 12 ماہ کا مکمل تجزیہ' : '12-Month Real Consumption & Cost Analytics')}
            </Text>
          </View>

          {activeBill && (
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[
                  styles.headerActionBtn,
                  darkMode ? styles.headerActionBtnDark : styles.headerActionBtnLight,
                ]}
                onPress={handleRefreshActiveMeter}
                disabled={refreshing}
                activeOpacity={0.7}
              >
                {refreshing ? (
                  <ActivityIndicator size="small" color="#6366F1" />
                ) : (
                  <AppIcon name="refresh" size={16} color="#6366F1" />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Meter Switcher Tabs */}
      {savedMeters.length > 0 && (
        <View style={styles.meterSelectorWrap}>
          <Text style={[styles.meterSelectorLabel, darkMode ? styles.darkSub : styles.lightSub]}>
            {isUrdu ? 'میٹر منتخب کریں:' : 'Select Saved Meter:'}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.meterScroll}
          >
            {savedMeters.map((meter) => {
              const isSelected = selectedMeterId === meter.id;
              return (
                <TouchableOpacity
                  key={meter.id}
                  style={[
                    styles.meterChip,
                    isSelected
                      ? styles.meterChipActive
                      : (darkMode ? styles.meterChipDark : styles.meterChipLight),
                  ]}
                  onPress={() => loadMeterData(meter)}
                  activeOpacity={0.7}
                >
                  <AppIcon
                    name={meter.utilityType === 'gas' ? 'flame' : 'bolt'}
                    size={14}
                    color={isSelected ? '#FFFFFF' : (meter.utilityType === 'gas' ? '#0284C7' : '#10B981')}
                  />
                  <Text
                    style={[
                      styles.meterChipText,
                      isSelected ? styles.meterChipTextActive : (darkMode ? styles.darkText : styles.lightText),
                    ]}
                  >
                    {getChipLabel(meter.nickname, meter.company)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={[styles.loadingText, darkMode ? styles.darkSub : styles.lightSub]}>
            {isUrdu ? 'ڈیٹا حاصل کیا جا رہا ہے...' : 'Loading Consumption Analytics...'}
          </Text>
        </View>
      ) : !hasHistory ? (
        <View style={[styles.emptyCard, darkMode ? styles.darkCard : styles.lightCard]}>
          <AppIcon name="history" size={48} color="#6366F1" />
          <Text style={[styles.emptyTitle, darkMode ? styles.darkText : styles.lightText]}>
            {isUrdu ? 'کوئی بلنگ ڈیٹا موجود نہیں' : 'No Bill Data Available Yet'}
          </Text>
          <Text style={[styles.emptyDesc, darkMode ? styles.darkSub : styles.lightSub, isUrdu && styles.rtlText]}>
            {isUrdu
              ? 'اپنا پہلا بل ہوم اسکرین پر چیک کریں یا نیچے دیے گئے بٹن سے لیسکو کا ریئل 12 ماہ کا کنزمپشن تجزیہ لائیو دیکھیں۔'
              : 'Check or save a utility bill from the Home screen, or load the real LESCO meter analytics below to view 12-month usage trends & charts.'}
          </Text>

          <View style={styles.emptyBtnWrap}>
            <TouchableOpacity style={styles.demoMeterBtn} onPress={handleLoadDemoMeter} activeOpacity={0.8}>
              <AppIcon name="zap" size={16} color="#FFFFFF" />
              <Text style={styles.demoMeterBtnText}>
                {isUrdu ? 'لیسکو کا 12 ماہ کا ریئل ڈیٹا لوڈ کریں (15115371598719)' : 'Load Live LESCO 12-Mo Analytics (15115371598719)'}
              </Text>
            </TouchableOpacity>

            {onNavigateHome && (
              <TouchableOpacity style={styles.checkBillBtn} onPress={onNavigateHome} activeOpacity={0.8}>
                <AppIcon name="search" size={16} color="#FFFFFF" />
                <Text style={styles.checkBillBtnText}>
                  {isUrdu ? 'ہوم اسکرین سے نیا بل چیک کریں' : 'Check Another Bill from Home'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <ConsumptionMetricsGrid historyData={historyData} darkMode={darkMode} language={language} />

          {/* 12-Month Consumption Chart */}
          <ConsumptionChart history={historyData} darkMode={darkMode} language={language} />

          {/* 12-Month Tabular History */}
          <View style={{ marginTop: 12 }}>
            <HistoryTable history={historyData} darkMode={darkMode} language={language} />
          </View>

          {/* Energy Saving Insights */}
          <EnergySavingTips darkMode={darkMode} language={language} />
        </>
      )}

      <AdBanner darkMode={darkMode} language={language} />
    </ScrollView>
  );
};

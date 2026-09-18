import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, RefreshControl } from 'react-native';
import { AppIcon } from '../components/AppIcon';
import {
  ELECTRICITY_PROVIDERS,
  GAS_PROVIDERS,
  ProviderInfo,
} from '../constants/providers';
import { BillData, SavedMeter } from '../types/bill';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { StorageService } from '../services/storage';
import { ApiService, createInitializedBill, SngplConsumerParams } from '../services/api';
import { NotificationService } from '../services/notification';
import { CustomPopup, PopupConfig } from '../components/CustomPopup';
import { RefGuideModal } from '../components/RefGuideModal';
import { AddBillTopHeader } from '../components/addbill/AddBillTopHeader';
import { AddBillSubtitleSection } from '../components/addbill/AddBillSubtitleSection';
import { AddBillTypeSelector } from '../components/addbill/AddBillTypeSelector';
import { AddBillFormFields } from '../components/addbill/AddBillFormFields';
import { AddBillGasSection } from '../components/addbill/AddBillGasSection';
import { AddBillMockupGuide } from '../components/addbill/AddBillMockupGuide';
import { AddBillActionButtons } from '../components/addbill/AddBillActionButtons';
import { styles } from '../styles/AddBillScreen.styles';

interface AddBillScreenProps {
  language: Language;
  darkMode: boolean;
  initialProvider?: ProviderInfo;
  onChangeProvider: () => void;
  onBack: () => void;
  onBillChecked: (bill: BillData) => void;
  onSaveMeterComplete?: () => void;
}

export const AddBillScreen: React.FC<AddBillScreenProps> = ({
  language,
  darkMode,
  initialProvider,
  onChangeProvider,
  onBack,
  onBillChecked,
  onSaveMeterComplete,
}) => {
  const t = TRANSLATIONS[language];
  const isUrdu = language === 'ur';

  const defaultProvider = initialProvider || ELECTRICITY_PROVIDERS[0];
  const [utilityType, setUtilityType] = useState<'electricity' | 'gas'>(
    defaultProvider.type || 'electricity'
  );
  const [selectedProvider, setSelectedProvider] = useState<ProviderInfo>(defaultProvider);
  const [referenceNo, setReferenceNo] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showRefGuideModal, setShowRefGuideModal] = useState(false);
  const [popup, setPopup] = useState<PopupConfig>({
    visible: false,
    title: '',
    message: '',
  });

  // SNGPL Specific States
  const [sngplParams, setSngplParams] = useState<SngplConsumerParams | null>(null);
  const [fetchingSngpl, setFetchingSngpl] = useState(false);
  const [currentReading, setCurrentReading] = useState('');
  const [currentReadingDate, setCurrentReadingDate] = useState(() => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  });

  const isSngpl = selectedProvider.code === 'SNGPL';
  const [useManualReading, setUseManualReading] = useState(false);

  const handlePullRefresh = () => {
    setRefreshing(true);
    setReferenceNo('');
    setNickname('');
    setSngplParams(null);
    setCurrentReading('');
    setTimeout(() => {
      setRefreshing(false);
    }, 400);
  };

  useEffect(() => {
    if (initialProvider) {
      setSelectedProvider(initialProvider);
      setUtilityType(initialProvider.type);
      setSngplParams(null);
      setCurrentReading('');
    }
  }, [initialProvider]);

  const handleSelectType = (type: 'electricity' | 'gas') => {
    setUtilityType(type);
    setSngplParams(null);
    setCurrentReading('');
    if (type === 'electricity' && selectedProvider.type !== 'electricity') {
      setSelectedProvider(ELECTRICITY_PROVIDERS[0]);
    } else if (type === 'gas' && selectedProvider.type !== 'gas') {
      setSelectedProvider(GAS_PROVIDERS[0]);
    }
  };

  const handleReferenceChange = (text: string) => {
    const maxLen = selectedProvider.refLength || (selectedProvider.type === 'gas' ? 10 : 14);
    const clean = text.replace(/[^0-9a-zA-Z]/g, '').slice(0, maxLen);
    setReferenceNo(clean);
    if (sngplParams) {
      setSngplParams(null);
    }
  };

  const isRefValid = () => {
    const clean = referenceNo.replace(/[^0-9a-zA-Z]/g, '');
    if (selectedProvider.type === 'gas' || selectedProvider.code === 'KELECTRIC' || selectedProvider.code === 'KE') {
      return clean.length >= 10;
    }
    return clean.length >= 14;
  };

  const handleFetchSngpl = async () => {
    const cleanRef = referenceNo.replace(/[^0-9]/g, '').trim();
    if (!cleanRef || cleanRef.length < 10) {
      setPopup({
        visible: true,
        type: 'error',
        title: t.errorTitle,
        message: t.invalidRef,
        primaryText: isUrdu ? 'ٹھیک ہے' : 'OK',
        onClose: () => setPopup((p) => ({ ...p, visible: false })),
      });
      return;
    }

    setFetchingSngpl(true);
    try {
      const params = await ApiService.fetchSngplParams(cleanRef);
      setSngplParams(params);
    } catch {
      setPopup({
        visible: true,
        type: 'error',
        title: t.errorTitle,
        message: isUrdu
          ? 'سوئی گیس سرور سے ڈیٹا حاصل نہ ہو سکا۔ براہ کرم کنزیومر نمبر چیک کریں۔'
          : 'Could not fetch consumer data from SNGPL server. Please check your Consumer Number.',
        primaryText: isUrdu ? 'ٹھیک ہے' : 'OK',
        onClose: () => setPopup((p) => ({ ...p, visible: false })),
      });
    } finally {
      setFetchingSngpl(false);
    }
  };

  const handleCalculateAndSaveSngplBill = async () => {
    const cleanRef = referenceNo.replace(/[^0-9]/g, '').trim();
    if (!sngplParams) {
      await handleFetchSngpl();
      return;
    }

    const curRead = currentReading.replace(/[^0-9]/g, '').trim();
    if (!curRead || curRead.length < 6) {
      setPopup({
        visible: true,
        type: 'warning',
        title: t.errorTitle,
        message: t.invalidCurrentReading,
        primaryText: isUrdu ? 'ٹھیک ہے' : 'OK',
        onClose: () => setPopup((p) => ({ ...p, visible: false })),
      });
      return;
    }

    setLoading(true);
    try {
      const bill = await ApiService.estimateSngplBill({
        accountId: cleanRef,
        category: sngplParams.category,
        protectedStatus: sngplParams.protectedStatus,
        previousRead: sngplParams.previousRead,
        previousReadDt: sngplParams.previousReadDt,
        currentRead: curRead,
        currentReadDt: currentReadingDate || '18-09-2026',
        gcv: sngplParams.gcv,
        pressureFactor: sngplParams.pressureFactor,
        nickname,
      });

      await StorageService.cacheBill(bill);

      const newMeter: SavedMeter = {
        id: `meter_sngpl_${Date.now()}`,
        nickname: nickname.trim() || `${selectedProvider.name} (${cleanRef})`,
        company: selectedProvider.code,
        referenceNumber: cleanRef,
        utilityType: 'gas',
        lastBillAmount: bill.payableWithinDueDate,
        lastDueDate: bill.dueDate,
        lastBillStatus: bill.billStatus,
        lastBillMonth: bill.billMonth,
        consumerName: bill.consumerName,
        consumerAddress: bill.consumerAddress,
        createdAt: new Date().toISOString(),
      };

      await StorageService.saveMeter(newMeter);
      await NotificationService.notifyMeterAdded(newMeter, isUrdu);
      onSaveMeterComplete?.();
      onBillChecked(bill);
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
      setLoading(false);
    }
  };

  const handleFetchBill = async () => {
    const cleanRef = referenceNo.replace(/[^0-9a-zA-Z]/g, '').trim();

    if (!cleanRef || cleanRef.length < 8) {
      setPopup({
        visible: true,
        type: 'error',
        title: t.errorTitle,
        message: t.invalidRef,
        primaryText: isUrdu ? 'ٹھیک ہے' : 'OK',
        onClose: () => setPopup((p) => ({ ...p, visible: false })),
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Check if we have fresh cached bill first
      let bill: BillData | null = await StorageService.getCachedBill(selectedProvider.code, cleanRef);

      // 2. Fetch live bill if not in cache
      if (!bill || bill.isMockData) {
        try {
          bill = await ApiService.fetchBill(selectedProvider.code, cleanRef);
        } catch {
          bill = createInitializedBill(selectedProvider.code, cleanRef);
        }
      }

      await StorageService.cacheBill(bill);

      const cleanConsumer = bill.consumerName && !bill.consumerName.toUpperCase().includes('CONSUMER')
        ? bill.consumerName.split(/[\n,]/)[0].trim()
        : '';

      const newMeter: SavedMeter = {
        id: `meter_${selectedProvider.code.toLowerCase()}_${Date.now()}`,
        nickname: nickname.trim() || cleanConsumer || `${selectedProvider.name} Meter`,
        company: selectedProvider.code,
        referenceNumber: cleanRef,
        utilityType: selectedProvider.type,
        lastBillAmount: bill.payableWithinDueDate,
        lastDueDate: bill.dueDate,
        lastBillStatus: bill.billStatus,
        lastBillMonth: bill.billMonth,
        consumerName: bill.consumerName,
        consumerAddress: bill.consumerAddress,
        createdAt: new Date().toISOString(),
      };

      await StorageService.saveMeter(newMeter);
      await NotificationService.notifyMeterAdded(newMeter, isUrdu).catch(() => {});
      onSaveMeterComplete?.();

      onBillChecked(bill);
    } catch {
      const fallbackBill = createInitializedBill(selectedProvider.code, cleanRef);
      onBillChecked(fallbackBill);
    } finally {
      setLoading(false);
    }
  };

  const showHelpGuide = () => {
    setShowRefGuideModal(true);
  };

  return (
    <View style={[styles.outerContainer, darkMode ? styles.darkBg : styles.lightBg]}>
      {/* ── Fixed Deep Navy Header ── */}
      <AddBillTopHeader
        onBack={onBack}
        onHelpPress={showHelpGuide}
        title={t.addNewBillTitle}
        backText={t.backBtn}
      />

      {/* ── Main Scrollable Canvas ── */}
      <ScrollView
        style={styles.container}
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
        {/* Subtitle & Context */}
        <AddBillSubtitleSection
          darkMode={darkMode}
          isUrdu={isUrdu}
          liveGridSyncedText={t.liveGridSynced}
          enterUtilityDetailsText={t.enterUtilityDetails}
          enterUtilitySubText={t.enterUtilitySub}
        />

        {/* Segmented Utility Switcher */}
        <AddBillTypeSelector
          utilityType={utilityType}
          onSelectType={handleSelectType}
          darkMode={darkMode}
          electricityLabel={t.electricityTab}
          gasLabel={t.gasTab}
        />

        {/* ── Form Card Container ── */}
        <AddBillFormFields
          selectedProvider={selectedProvider}
          onChangeProvider={onChangeProvider}
          referenceNo={referenceNo}
          onChangeReferenceNo={handleReferenceChange}
          onClearReferenceNo={() => {
            setReferenceNo('');
            setSngplParams(null);
            setCurrentReading('');
          }}
          isRefValid={isRefValid()}
          nickname={nickname}
          onChangeNickname={setNickname}
          darkMode={darkMode}
          isUrdu={isUrdu}
          labels={{
            selectDistCompany: t.selectDistCompany,
            discoSngplBadge: t.discoSngplBadge,
            changeCompany: t.changeCompany,
            enter14DigitRef: t.enter14DigitRef,
            enterConsumerIdLabel: t.enterConsumerIdLabel,
            requiredBadge: t.requiredBadge,
            refFormatNotice: t.refFormatNotice,
            refDigitsValid: t.refDigitsValid,
            billNickname: t.billNickname,
            optionalBadge: t.optionalBadge,
            billNicknamePlaceholder: t.billNicknamePlaceholder,
            billNicknameSub: t.billNicknameSub,
          }}
        />

        {/* ── SNGPL Calculation Options ── */}
        {isSngpl && (
          <TouchableOpacity
            style={[
              styles.gasOptionToggle,
              darkMode ? styles.gasOptionToggleDark : styles.gasOptionToggleLight,
            ]}
            onPress={() => setUseManualReading(!useManualReading)}
            activeOpacity={0.8}
          >
            <View style={styles.gasOptionToggleInner}>
              <AppIcon name={useManualReading ? 'close' : 'calculator'} size={18} color="#006D35" />
              <Text
                style={[
                  styles.gasOptionToggleText,
                  darkMode ? styles.darkText : styles.lightText,
                  isUrdu && styles.rtlText,
                ]}
              >
                {useManualReading
                  ? (isUrdu ? 'براہ راست بل حاصل کرنے کے موڈ پر واپس جائیں' : 'Switch back to Instant Bill Check')
                  : (isUrdu ? 'نئی میٹر ریڈنگ سے غیر بل شدہ رقم کا اندازہ لگائیں؟' : 'Estimate unbilled amount from meter counter reading?')}
              </Text>
            </View>
            <Text style={styles.gasOptionToggleAction}>
              {useManualReading ? (isUrdu ? 'بند کریں' : 'Close') : (isUrdu ? 'کھولیں' : 'Open')}
            </Text>
          </TouchableOpacity>
        )}

        {/* ── SNGPL 2-Step Gas Flow Section (Optional for manual estimations) ── */}
        {isSngpl && useManualReading && (
          <AddBillGasSection
            sngplParams={sngplParams}
            fetchingSngpl={fetchingSngpl}
            onFetchSngpl={handleFetchSngpl}
            currentReading={currentReading}
            onChangeCurrentReading={setCurrentReading}
            currentReadingDate={currentReadingDate}
            onChangeCurrentReadingDate={setCurrentReadingDate}
            isRefValid={isRefValid()}
            darkMode={darkMode}
            isUrdu={isUrdu}
            labels={{
              fetchSngplDetails: t.fetchSngplDetails,
              fetchingSngplDetails: t.fetchingSngplDetails,
              sngplBaselineTitle: t.sngplBaselineTitle,
              sngplCategory: t.sngplCategory,
              sngplStatus: t.sngplStatus,
              sngplPrevReading: t.sngplPrevReading,
              sngplPrevReadingDate: t.sngplPrevReadingDate,
              sngplGcvPressure: t.sngplGcvPressure,
              sngplCurrentReadingLabel: t.sngplCurrentReadingLabel,
              sngplCurrentReadingPlaceholder: t.sngplCurrentReadingPlaceholder,
              sngplCurrentReadingSub: t.sngplCurrentReadingSub,
              sngplCurrentReadingDateLabel: t.sngplCurrentReadingDateLabel,
              sngplNoAutoFetchNoticeTitle: t.sngplNoAutoFetchNoticeTitle,
              sngplNoAutoFetchNoticeBody: t.sngplNoAutoFetchNoticeBody,
              requiredBadge: t.requiredBadge,
            }}
          />
        )}

        {/* ── Helpful Visual Guidance Card ── */}
        <AddBillMockupGuide
          selectedProvider={selectedProvider}
          referenceNo={referenceNo}
          darkMode={darkMode}
          isUrdu={isUrdu}
          guideTitle={t.whereToFindRefTitle}
          guideSubtitle={t.whereToFindRefSub}
          onOpenRefGuide={() => setShowRefGuideModal(true)}
        />

        {/* ── Action Buttons & Security Footer ── */}
        <AddBillActionButtons
          loading={loading || fetchingSngpl}
          onFetchBill={
            isSngpl && useManualReading
              ? sngplParams
                ? handleCalculateAndSaveSngplBill
                : handleFetchSngpl
              : handleFetchBill
          }
          darkMode={darkMode}
          getBillCtaText={
            isSngpl && useManualReading
              ? sngplParams
                ? t.sngplCalculateCta
                : t.fetchSngplDetails
              : selectedProvider.type === 'gas'
              ? (isUrdu ? `${selectedProvider.name} بل حاصل کریں` : `Check ${selectedProvider.code} Bill`)
              : t.getBillCta
          }
          encryptedNoticeText={t.encryptedNotice}
        />
      </ScrollView>

      {/* Reference Number Help Modal with Genuine Crop */}
      <RefGuideModal
        visible={showRefGuideModal}
        onClose={() => setShowRefGuideModal(false)}
        darkMode={darkMode}
        language={language}
      />

      {/* Global Dialog */}
      <CustomPopup {...popup} darkMode={darkMode} isUrdu={isUrdu} />
    </View>
  );
};

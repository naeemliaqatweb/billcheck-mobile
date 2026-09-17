import React, { useState, useEffect } from 'react';
import { View, ScrollView, Linking, RefreshControl } from 'react-native';
import {
  ELECTRICITY_PROVIDERS,
  GAS_PROVIDERS,
  ProviderInfo,
} from '../constants/providers';
import { BillData, SavedMeter } from '../types/bill';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { StorageService } from '../services/storage';
import { ApiService, createInitializedBill } from '../services/api';
import { NotificationService } from '../services/notification';
import { CustomPopup, PopupConfig } from '../components/CustomPopup';
import { RefGuideModal } from '../components/RefGuideModal';
import { AddBillTopHeader } from '../components/addbill/AddBillTopHeader';
import { AddBillSubtitleSection } from '../components/addbill/AddBillSubtitleSection';
import { AddBillTypeSelector } from '../components/addbill/AddBillTypeSelector';
import { AddBillFormFields } from '../components/addbill/AddBillFormFields';
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

  const handlePullRefresh = () => {
    setRefreshing(true);
    setReferenceNo('');
    setNickname('');
    setTimeout(() => {
      setRefreshing(false);
    }, 400);
  };

  useEffect(() => {
    if (initialProvider) {
      setSelectedProvider(initialProvider);
      setUtilityType(initialProvider.type);
    }
  }, [initialProvider]);

  const handleSelectType = (type: 'electricity' | 'gas') => {
    setUtilityType(type);
    if (type === 'electricity' && selectedProvider.type !== 'electricity') {
      setSelectedProvider(ELECTRICITY_PROVIDERS[0]);
    } else if (type === 'gas' && selectedProvider.type !== 'gas') {
      setSelectedProvider(GAS_PROVIDERS[0]);
    }
  };

  const isRefValid = () => {
    const clean = referenceNo.replace(/[^0-9a-zA-Z]/g, '');
    if (selectedProvider.type === 'gas' || selectedProvider.code === 'KELECTRIC' || selectedProvider.code === 'KE') {
      return clean.length >= 10;
    }
    return clean.length >= 14;
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
      const bill = await ApiService.fetchBill(selectedProvider.code, cleanRef);
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
      await NotificationService.notifyMeterAdded(newMeter, isUrdu);
      onSaveMeterComplete?.();
      onBillChecked(bill);
    } catch {
      const portalUrl = selectedProvider.portalUrl || 'https://bill.pitc.com.pk/';
      const fallbackBill = createInitializedBill(selectedProvider.code, cleanRef);

      setPopup({
        visible: true,
        type: 'warning',
        title: isUrdu ? 'سرکاری پورٹل مینٹیننس پر ہے' : 'Government Server Under Maintenance',
        message: isUrdu
          ? `${selectedProvider.name} کا سرکاری سرور اس وقت مینٹیننس پر ہے۔ کیا آپ یہ میٹر محفوظ کر کے پورٹل پر اصل بل دیکھنا چاہتے ہیں؟`
          : `The official ${selectedProvider.name} server is currently undergoing scheduled maintenance. Would you like to save this meter and view the official portal?`,
        primaryText: isUrdu ? 'میٹر محفوظ کریں و پورٹل دیکھیں' : 'Save Meter & View Portal',
        secondaryText: isUrdu ? 'صرف پورٹل کھولیں' : 'Open Portal Only',
        onPrimaryPress: async () => {
          setPopup((p) => ({ ...p, visible: false }));
          await StorageService.cacheBill(fallbackBill);
          const newMeter: SavedMeter = {
            id: `meter_${selectedProvider.code.toLowerCase()}_${Date.now()}`,
            nickname: nickname.trim() || `${selectedProvider.name} Meter`,
            company: selectedProvider.code,
            referenceNumber: cleanRef,
            utilityType: selectedProvider.type,
            lastBillAmount: fallbackBill.payableWithinDueDate,
            lastDueDate: fallbackBill.dueDate,
            lastBillStatus: fallbackBill.billStatus,
            lastBillMonth: fallbackBill.billMonth,
            consumerName: fallbackBill.consumerName,
            consumerAddress: fallbackBill.consumerAddress,
            createdAt: new Date().toISOString(),
          };
          await StorageService.saveMeter(newMeter);
          await NotificationService.notifyMeterAdded(newMeter, isUrdu);
          onSaveMeterComplete?.();
          Linking.openURL(portalUrl).catch(() => {});
          onBillChecked(fallbackBill);
        },
        onSecondaryPress: () => {
          setPopup((p) => ({ ...p, visible: false }));
          Linking.openURL(portalUrl).catch(() => {});
        },
        onClose: () => setPopup((p) => ({ ...p, visible: false })),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScanQrDemo = () => {
    const sampleRef =
      selectedProvider.code === 'LESCO'
        ? '15115371598719'
        : selectedProvider.code === 'KELECTRIC' || selectedProvider.code === 'KE'
        ? '0400012345678'
        : selectedProvider.code === 'SNGPL'
        ? '98421055191'
        : '04112230987600';

    setReferenceNo(sampleRef);
    setNickname('Home - Ground Floor');
    setPopup({
      visible: true,
      type: 'success',
      title: isUrdu ? 'بارکوڈ کامیابی سے اسکین ہوا!' : 'QR Barcode Scanned!',
      message: isUrdu
        ? `ریفرنس نمبر: ${sampleRef}\nکمپنی: ${selectedProvider.name}`
        : `Autofilled reference ${sampleRef} for ${selectedProvider.name}.`,
      primaryText: isUrdu ? 'بل حاصل کریں' : 'Fetch Bill Now',
      onPrimaryPress: () => {
        setPopup((p) => ({ ...p, visible: false }));
      },
      onClose: () => setPopup((p) => ({ ...p, visible: false })),
    });
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
          onChangeReferenceNo={(text) => setReferenceNo(text.replace(/[^0-9a-zA-Z]/g, ''))}
          onClearReferenceNo={() => setReferenceNo('')}
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
          loading={loading}
          onFetchBill={handleFetchBill}
          onScanDemo={handleScanQrDemo}
          darkMode={darkMode}
          getBillCtaText={t.getBillCta}
          scanBarcodeText={t.scanBillBarcodeQr}
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

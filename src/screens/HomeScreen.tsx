import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Linking,
} from 'react-native';
import { ELECTRICITY_PROVIDERS, GAS_PROVIDERS } from '../constants/providers';
import { ProviderInfo, BillData, SavedMeter } from '../types/bill';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { AdBanner } from '../components/AdBanner';
import { ApiService } from '../services/api';
import { StorageService } from '../services/storage';
import { AddMeterModal } from '../components/AddMeterModal';
import { AppIcon } from '../components/AppIcon';
import { CustomPopup, PopupConfig } from '../components/CustomPopup';
import { ProviderSelector } from '../components/ProviderSelector';
import { QuickSavedBills } from '../components/QuickSavedBills';
import { ReferenceInputCard } from '../components/home/ReferenceInputCard';
import { styles } from '../styles/HomeScreen.styles';

interface HomeScreenProps {
  language: Language;
  darkMode: boolean;
  savedMeters: SavedMeter[];
  onBillChecked: (bill: BillData) => void;
  onRefreshSaved: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  darkMode,
  savedMeters,
  onBillChecked,
  onRefreshSaved,
}) => {
  const t = TRANSLATIONS[language];
  const isUrdu = language === 'ur';

  const [utilityType, setUtilityType] = useState<'electricity' | 'gas'>('electricity');
  const [selectedProvider, setSelectedProvider] = useState<ProviderInfo>(ELECTRICITY_PROVIDERS[0]);
  const [referenceNo, setReferenceNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [addMeterVisible, setAddMeterVisible] = useState(false);
  const [popup, setPopup] = useState<PopupConfig>({
    visible: false,
    title: '',
    message: '',
  });

  // FAB pulse animation
  const fabScale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(fabScale, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(fabScale, { toValue: 1.0, duration: 900, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const activeProviders = utilityType === 'electricity' ? ELECTRICITY_PROVIDERS : GAS_PROVIDERS;

  const handleSelectType = (type: 'electricity' | 'gas') => {
    setUtilityType(type);
    setSelectedProvider(type === 'electricity' ? ELECTRICITY_PROVIDERS[0] : GAS_PROVIDERS[0]);
    setReferenceNo('');
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

  const handleCheckBill = async () => {
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
      onBillChecked(bill);
    } catch {
      handleFetchFailure(selectedProvider, cleanRef);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCheck = async (meter: SavedMeter) => {
    const prov = [...ELECTRICITY_PROVIDERS, ...GAS_PROVIDERS].find((p) => p.code === meter.company) || ELECTRICITY_PROVIDERS[0];
    setSelectedProvider(prov);
    setUtilityType(meter.utilityType);
    setReferenceNo(meter.referenceNumber);

    setLoading(true);
    try {
      const bill = await ApiService.fetchBill(meter.company, meter.referenceNumber);
      await StorageService.cacheBill(bill);
      onBillChecked(bill);
    } catch {
      handleFetchFailure(prov, meter.referenceNumber);
    } finally {
      setLoading(false);
    }
  };

  const handleMeterAdded = (freshBill?: BillData) => {
    setAddMeterVisible(false);
    onRefreshSaved();
    setPopup({
      visible: true,
      type: 'success',
      title: isUrdu ? '🎉 نیا میٹر شامل ہو گیا!' : '🎉 Meter Added Successfully!',
      message: freshBill && freshBill.payableWithinDueDate > 0
        ? (isUrdu
            ? `${freshBill.company}: بل کی تصدیق ہو گئی ہے۔\nکل رقم: Rs. ${freshBill.payableWithinDueDate.toLocaleString()} (تاریخ: ${freshBill.dueDate})`
            : `${freshBill.company}: Live bill verified!\nAmount Due: Rs. ${freshBill.payableWithinDueDate.toLocaleString()} (Due: ${freshBill.dueDate})`)
        : (isUrdu ? 'میٹر آپ کی محفوظ فہرست میں شامل ہو گیا ہے۔' : 'Meter saved to your dashboard list.'),
      primaryText: freshBill && freshBill.payableWithinDueDate > 0
        ? (isUrdu ? 'بل دیکھیں' : 'View Bill Now')
        : (isUrdu ? 'ٹھیک ہے' : 'Done'),
      secondaryText: freshBill && freshBill.payableWithinDueDate > 0 ? (isUrdu ? 'بعد میں' : 'Later') : undefined,
      onPrimaryPress: () => {
        setPopup((p) => ({ ...p, visible: false }));
        if (freshBill && freshBill.payableWithinDueDate > 0) {
          onBillChecked(freshBill);
        }
      },
      onClose: () => setPopup((p) => ({ ...p, visible: false })),
    });
  };

  return (
    <View style={[styles.outerContainer, darkMode ? styles.darkBg : styles.lightBg]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <Text style={styles.brandBadge}>BILLCHECK PK</Text>
            <Text style={[styles.langBadge, darkMode ? styles.darkSub : styles.lightSub]}>
              {isUrdu ? 'اردو' : 'English'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image
              source={require('../assets/images/app-logo.png')}
              style={{ width: 38, height: 38, borderRadius: 8 }}
              resizeMode="contain"
            />
            <Text style={[styles.appTitle, darkMode ? styles.darkText : styles.lightText, isUrdu && styles.rtlText]}>
              {t.appName}
            </Text>
          </View>
          <Text style={[styles.appSubtitle, darkMode ? styles.darkSub : styles.lightSub, isUrdu && styles.rtlText]}>
            {t.tagline}
          </Text>
        </View>

        {/* Disclaimer Banner */}
        <DisclaimerBanner language={language} darkMode={darkMode} />

        {/* Utility Switcher */}
        <View style={[styles.tabSelector, darkMode ? styles.darkCard : styles.lightCard]}>
          <TouchableOpacity
            style={[styles.tabButton, utilityType === 'electricity' && styles.activeTab]}
            onPress={() => handleSelectType('electricity')}
          >
            <View style={styles.tabContentRow}>
              <AppIcon name="bolt" size={18} color={utilityType === 'electricity' ? '#10B981' : (darkMode ? '#94A3B8' : '#64748B')} />
              <Text style={[styles.tabButtonText, utilityType === 'electricity' ? styles.activeTabText : (darkMode ? styles.darkSub : styles.lightSub)]}>
                {t.electricityBills}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, utilityType === 'gas' && styles.activeTab]}
            onPress={() => handleSelectType('gas')}
          >
            <View style={styles.tabContentRow}>
              <AppIcon name="flame" size={18} color={utilityType === 'gas' ? '#0284C7' : (darkMode ? '#94A3B8' : '#64748B')} />
              <Text style={[styles.tabButtonText, utilityType === 'gas' ? styles.activeTabText : (darkMode ? styles.darkSub : styles.lightSub)]}>
                {t.gasBills}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Provider Horizontal Selector */}
        <ProviderSelector
          providers={activeProviders}
          selectedProvider={selectedProvider}
          onSelectProvider={setSelectedProvider}
          darkMode={darkMode}
          label={t.selectProvider}
          isUrdu={isUrdu}
        />

        {/* Reference Input Card */}
        <ReferenceInputCard
          utilityType={utilityType}
          selectedProvider={selectedProvider}
          referenceNo={referenceNo}
          onChangeReferenceNo={setReferenceNo}
          onCheckBill={handleCheckBill}
          loading={loading}
          darkMode={darkMode}
          isUrdu={isUrdu}
          labels={{
            referenceNumber: t.referenceNumber,
            consumerId: t.consumerId,
            whereToFindRef: t.whereToFindRef,
            refExplanation: t.refExplanation,
            checkBillBtn: t.checkBillBtn,
          }}
        />

        {/* Quick Saved Bills */}
        <QuickSavedBills
          savedMeters={savedMeters}
          darkMode={darkMode}
          isUrdu={isUrdu}
          title={t.quickSavedBills}
          onQuickCheck={handleQuickCheck}
        />

        <AdBanner darkMode={darkMode} language={language} />
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity
          style={[styles.fabInner, { backgroundColor: '#10B981' }]}
          onPress={() => setAddMeterVisible(true)}
          activeOpacity={0.85}
        >
          <AppIcon name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Modals */}
      <AddMeterModal
        visible={addMeterVisible}
        onClose={() => setAddMeterVisible(false)}
        onAdded={handleMeterAdded}
        language={language}
        darkMode={darkMode}
      />

      <CustomPopup
        {...popup}
        darkMode={darkMode}
        isUrdu={isUrdu}
      />
    </View>
  );
};

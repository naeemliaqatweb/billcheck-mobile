import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Linking,
  Image,
  RefreshControl,
} from 'react-native';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { APP_CONFIG } from '../constants/appConfig';
import { AdBanner } from '../components/AdBanner';
import { AppIcon } from '../components/AppIcon';
import { CustomPopup, PopupConfig } from '../components/CustomPopup';
import { StorageService } from '../services/storage';
import { styles } from '../styles/SettingsScreen.styles';

interface SettingsScreenProps {
  language: Language;
  darkMode: boolean;
  onToggleLanguage: (lang: Language) => void;
  onToggleTheme: (dark: boolean) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  language,
  darkMode,
  onToggleLanguage,
  onToggleTheme,
}) => {
  const t = TRANSLATIONS[language];
  const isUrdu = language === 'ur';

  const [savedCount, setSavedCount] = useState<number>(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [popup, setPopup] = useState<PopupConfig>({
    visible: false,
    title: '',
    message: '',
  });

  // Load saved meters count and notification preferences
  const loadPreferences = useCallback(async () => {
    try {
      const [meters, notifs] = await Promise.all([
        StorageService.getSavedMeters(),
        StorageService.getNotifications(),
      ]);
      setSavedCount(meters.length);
      setNotificationsEnabled(notifs);
    } catch {
      // ignore
    }
  }, []);

  const handlePullRefresh = async () => {
    setRefreshing(true);
    await loadPreferences();
    setRefreshing(false);
  };

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const handleToggleNotifications = async (val: boolean) => {
    setNotificationsEnabled(val);
    await StorageService.setNotifications(val);
  };

  const showPrivacyPolicy = () => {
    setPopup({
      visible: true,
      type: 'info',
      title: isUrdu ? 'رازداری کی پالیسی (Privacy Policy)' : 'Privacy Policy & Data Security',
      message: isUrdu
        ? `${APP_CONFIG.nameUrdu} صارفین کی رازداری کا مکمل احترام کرتا ہے۔ ہم کوئی بھی ذاتی ڈیٹا، شناختی کارڈ نمبر یا پاس ورڈ اکٹھا نہیں کرتے۔ تمام ریفرنس نمبرز اور بلز صرف آپ کے موبائل کی لوکل میموری میں محفوظ رہتے ہیں۔\n\nمکمل سرکاری رازداری کی پالیسی آن لائن پڑھنے کے لیے نیچے دیے گئے بٹن پر کلک کریں۔`
        : `${APP_CONFIG.name} strictly respects consumer privacy. We operate under zero-retention architecture. No personal data, CNICs, or passwords are harvested or stored on external servers. All saved meters remain exclusively in your local device storage.\n\nTap below to read the complete official Privacy Policy online.`,
      primaryText: isUrdu ? 'آن لائن پالیسی کھولیں' : 'Open Online Policy',
      secondaryText: isUrdu ? 'بند کریں' : 'Close',
      onPrimary: () => {
        Linking.openURL(APP_CONFIG.privacyPolicyUrl).catch(() => {});
      },
      onSecondary: () => setPopup((p) => ({ ...p, visible: false })),
      onClose: () => setPopup((p) => ({ ...p, visible: false })),
    });
  };

  const showAboutCompany = () => {
    setPopup({
      visible: true,
      type: 'info',
      title: isUrdu ? 'ارکلوم ٹیک (Arcloom Tech)' : 'About Arcloom Tech',
      message: isUrdu
        ? `${APP_CONFIG.nameUrdu} ارکلوم ٹیک کی جانب سے تیار کردہ جدید یوٹیلیٹی ٹریکر ہے۔ ہمارا مقصد پاکستانی صارفین کے لیے بجلی، گیس اور دیگر بلوں کی تصدیق اور ادائیگی کے عمل کو آسان، تیز اور محفوظ بنانا ہے۔`
        : `${APP_CONFIG.name} is engineered by Arcloom Tech, an independent fintech and civic infrastructure laboratory in Pakistan. Our mission is to provide lightning-fast, transparent, and user-friendly utility billing solutions.`,
      primaryText: isUrdu ? 'ٹھیک ہے' : 'Got it',
      onClose: () => setPopup((p) => ({ ...p, visible: false })),
    });
  };

  const showTaxStatementsInfo = () => {
    setPopup({
      visible: true,
      type: 'info',
      title: isUrdu ? 'انکم ٹیکس سرٹیفکیٹ و ہسٹری' : 'Tax Statements & Certificates',
      message: isUrdu
        ? 'بجلی اور گیس کے بلوں پر کٹنے والا ایڈوانس ودہولڈنگ ٹیکس (Section 235) آپ کے ڈپلیکیٹ بل پر درج ہوتا ہے۔ آپ سالانہ انکم ٹیکس ریٹرن میں کٹوتی کلیم کرنے کے لیے اپنے بل پی ڈی ایف فارمیٹ میں ڈاؤن لوڈ کر کے محفوظ کر سکتے ہیں۔'
        : 'Electricity & Gas bills contain withholding income tax (Section 235/235A) required for annual FBR tax returns. Download and keep copies of your monthly PDF bills from the bill lookup or saved bills tab to claim your advance tax credits.',
      primaryText: isUrdu ? 'سمجھ گیا' : 'Got it',
      onClose: () => setPopup((p) => ({ ...p, visible: false })),
    });
  };

  const showHelplineDirectory = () => {
    setPopup({
      visible: true,
      type: 'info',
      title: isUrdu ? 'ہنگامی ہیلپ لائن ڈائریکٹری' : 'Emergency Helpline Directory',
      message: isUrdu
        ? '• LESCO (لاہور): 118 / 042-99204033\n• K-Electric (کراچی): 118 / 021-99000\n• IESCO (اسلام آباد): 118 / 051-9252937\n• FESCO (فیصل آباد): 118 / 041-9220184\n• MEPCO (ملتان): 118 / 061-9220313\n• SNGPL (سوئی گیس): 1199\n• SSGC (سوئی سدرن): 1199'
        : '• LESCO (Lahore): 118 / 042-99204033\n• K-Electric (Karachi): 118 / 021-99000\n• IESCO (Islamabad): 118 / 051-9252937\n• FESCO (Faisalabad): 118 / 041-9220184\n• MEPCO (Multan): 118 / 061-9220313\n• SNGPL Gas: 1199\n• SSGC Gas: 1199',
      primaryText: isUrdu ? 'بند کریں' : 'Close',
      onClose: () => setPopup((p) => ({ ...p, visible: false })),
    });
  };

  const showManagedBillsInfo = () => {
    setPopup({
      visible: true,
      type: 'info',
      title: isUrdu ? 'محفوظ کردہ میٹرز' : 'Managed Bills & Meters',
      message: isUrdu
        ? `آپ کے موبائل میں اس وقت ${savedCount} فعال میٹرز محفوظ ہیں۔ آپ ہوم اسکرین یا سیوڈ ٹیب سے مزید میٹرز شامل یا حذف کر سکتے ہیں۔`
        : `You currently have ${savedCount} active utility reference numbers saved on this device. You can manage or delete them anytime from the Saved Meters tab.`,
      primaryText: isUrdu ? 'ٹھیک ہے' : 'OK',
      onClose: () => setPopup((p) => ({ ...p, visible: false })),
    });
  };

  const promptResetApp = () => {
    setPopup({
      visible: true,
      type: 'warning',
      title: t.clearCacheConfirmTitle,
      message: t.clearCacheConfirmMsg,
      primaryText: t.confirmResetBtn,
      secondaryText: t.cancelBtn,
      onPrimary: async () => {
        await StorageService.resetAppAndCache();
        setSavedCount(0);
        setPopup({
          visible: true,
          type: 'success',
          title: t.clearCacheSuccessTitle,
          message: t.clearCacheSuccessMsg,
          primaryText: isUrdu ? 'ٹھیک ہے' : 'Done',
          onClose: () => setPopup((p) => ({ ...p, visible: false })),
        });
      },
      onSecondary: () => setPopup((p) => ({ ...p, visible: false })),
      onClose: () => setPopup((p) => ({ ...p, visible: false })),
    });
  };

  return (
    <View style={[styles.outerContainer, darkMode ? styles.darkBg : styles.lightBg]}>
      {/* Top App Bar */}
      <View style={styles.topAppBar}>
        <View style={styles.brandTitleRow}>
          <Image
            source={require('../assets/images/app-logo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={styles.appBarTitleGroup}>
            <Text style={styles.brandTitle}>{APP_CONFIG.name}</Text>
            <Text style={styles.appBarSubtitle}>
              {isUrdu ? 'ترتیبات و معلومات' : 'Settings & Preferences'}
            </Text>
          </View>
        </View>
      </View>

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
        {/* ── 1. Deep Navy Hero Card (Stitch 100% Match) ── */}
        <View style={styles.heroCard}>
          {/* Top row: Brand & Version */}
          <View style={styles.heroTopRow}>
            <View style={styles.heroBrandLeft}>
              <View style={styles.heroLogoBox}>
                <View style={styles.heroLogoRow}>
                  <AppIcon name="bolt" size={19} color="#62FF96" />
                  <AppIcon
                    name="flame"
                    size={14}
                    color="#FF8A80"
                    containerStyle={{ marginLeft: -4 }}
                  />
                </View>
              </View>
              <View>
                <Text style={styles.heroTitle}>{APP_CONFIG.name}</Text>
                <Text style={styles.heroSubtitle}>
                  {isUrdu ? 'ارکلوم ٹیک کی انجینئرنگ' : 'Engineered by Arcloom Tech'}
                </Text>
              </View>
            </View>
            <View style={styles.heroVersionBadge}>
              <Text style={styles.heroVersionText}>v1.0.0</Text>
            </View>
          </View>

          {/* User / Session Identity Ribbon */}
          <View style={styles.heroUserRibbon}>
            <View style={styles.heroUserLeft}>
              <View style={styles.heroAvatar}>
                <Text style={styles.heroAvatarText}>PK</Text>
              </View>
              <View>
                <Text style={styles.heroUserName}>
                  {isUrdu ? 'یوٹیلیٹی حب (پاکستان)' : 'Utility Hub (Pakistan)'}
                </Text>
                <View style={styles.heroUserStatusRow}>
                  <Text style={styles.heroUserStatusText}>
                    {isUrdu ? 'لوکل ڈیٹا اسٹوریج' : 'Storage: Local Encrypted'}
                  </Text>
                  <View style={styles.activeDot} />
                  <Text style={styles.heroUserStatusText}>{t.activeSession}</Text>
                </View>
              </View>
            </View>
            <AppIcon name="verified-user" size={20} color="#62FF96" />
          </View>
        </View>

        {/* ── 2. Bento Quick Metrics (2 Columns) ── */}
        <View style={styles.metricsRow}>
          {/* Metric 1: Electricity DISCOs */}
          <View
            style={[
              styles.metricCard,
              darkMode ? styles.darkCardBg : styles.lightCardBg,
            ]}
          >
            <View
              style={[
                styles.metricIconBox,
                {
                  backgroundColor: darkMode ? 'rgba(98, 255, 150, 0.12)' : '#E8F5E9',
                  borderColor: darkMode ? 'rgba(98, 255, 150, 0.30)' : '#C8E6C9',
                },
              ]}
            >
              <AppIcon name="gauge" size={18} color={darkMode ? '#62FF96' : '#006D35'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.metricLabel,
                  darkMode ? styles.darkSub : styles.lightSub,
                  isUrdu && styles.rtlText,
                ]}
              >
                {t.trackedDiscos}
              </Text>
              <Text
                style={[
                  styles.metricValue,
                  darkMode ? styles.darkText : styles.lightText,
                  isUrdu && styles.rtlText,
                ]}
                numberOfLines={1}
              >
                {t.trackedDiscosVal}
              </Text>
            </View>
          </View>

          {/* Metric 2: Gas SNGPL / SSGC */}
          <View
            style={[
              styles.metricCard,
              darkMode ? styles.darkCardBg : styles.lightCardBg,
            ]}
          >
            <View
              style={[
                styles.metricIconBox,
                {
                  backgroundColor: darkMode ? 'rgba(255, 138, 128, 0.15)' : '#FFEBEE',
                  borderColor: darkMode ? 'rgba(255, 138, 128, 0.32)' : '#FFCDD2',
                },
              ]}
            >
              <AppIcon name="flame" size={18} color={darkMode ? '#FF8A80' : '#D32F2F'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.metricLabel,
                  darkMode ? styles.darkSub : styles.lightSub,
                  isUrdu && styles.rtlText,
                ]}
              >
                {t.trackedGas}
              </Text>
              <Text
                style={[
                  styles.metricValue,
                  darkMode ? styles.darkText : styles.lightText,
                  isUrdu && styles.rtlText,
                ]}
                numberOfLines={1}
              >
                {t.trackedGasVal}
              </Text>
            </View>
          </View>
        </View>

        {/* ── 3. Configuration & Services Menu List ── */}
        <View style={[styles.menuCard, darkMode ? styles.darkCardBg : styles.lightCardBg]}>
          {/* Card Header Bar */}
          <View
            style={[
              styles.menuHeader,
              darkMode ? styles.darkMenuHeader : styles.lightMenuHeader,
            ]}
          >
            <Text
              style={[
                styles.menuHeaderText,
                darkMode ? styles.darkSub : styles.lightSub,
              ]}
            >
              {t.configurationAndServices}
            </Text>
            <Text
              style={[
                styles.menuHeaderBadge,
                darkMode && styles.menuHeaderBadgeDark,
              ]}
            >
              {t.preferencesCount}
            </Text>
          </View>

          {/* Row 1: Language Switcher */}
          <View style={[styles.menuRow, styles.menuRowBorder]}>
            <View style={styles.menuRowLeft}>
              <View
                style={[
                  styles.menuIconBox,
                  {
                    backgroundColor: darkMode ? 'rgba(2, 132, 199, 0.15)' : '#E0F2FE',
                    borderColor: darkMode ? 'rgba(56, 189, 248, 0.35)' : '#BAE6FD',
                  },
                ]}
              >
                <AppIcon name="globe" size={18} color={darkMode ? '#38BDF8' : '#0284C7'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.menuRowTitle,
                    darkMode ? styles.darkText : styles.lightText,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {t.language}
                </Text>
                <Text
                  style={[
                    styles.menuRowSubtitle,
                    darkMode ? styles.darkSub : styles.lightSub,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {language === 'en' ? 'English (Default)' : 'اردو (Urdu)'}
                </Text>
              </View>
            </View>
            <View style={styles.langToggleRow}>
              <TouchableOpacity
                style={[styles.langChoice, language === 'en' && styles.langChoiceActive]}
                onPress={() => onToggleLanguage('en')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.langChoiceText,
                    language === 'en'
                      ? styles.langActiveText
                      : darkMode
                      ? styles.darkSub
                      : styles.lightSub,
                  ]}
                >
                  EN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langChoice, language === 'ur' && styles.langChoiceActive]}
                onPress={() => onToggleLanguage('ur')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.langChoiceText,
                    language === 'ur'
                      ? styles.langActiveText
                      : darkMode
                      ? styles.darkSub
                      : styles.lightSub,
                  ]}
                >
                  اردو
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Row 2: Dark Mode Switcher */}
          <View style={[styles.menuRow, styles.menuRowBorder]}>
            <View style={styles.menuRowLeft}>
              <View
                style={[
                  styles.menuIconBox,
                  {
                    backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.15)' : '#EEF2FF',
                    borderColor: darkMode ? 'rgba(129, 140, 248, 0.35)' : '#C7D2FE',
                  },
                ]}
              >
                <AppIcon name="moon" size={18} color={darkMode ? '#818CF8' : '#6366F1'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.menuRowTitle,
                    darkMode ? styles.darkText : styles.lightText,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {t.darkMode}
                </Text>
                <Text
                  style={[
                    styles.menuRowSubtitle,
                    darkMode ? styles.darkSub : styles.lightSub,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {darkMode ? 'Dark Slate' : 'Light Clean'}
                </Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={onToggleTheme}
              trackColor={{ false: '#CBD5E1', true: '#006D35' }}
              thumbColor={darkMode ? '#3FFF8B' : '#FFFFFF'}
            />
          </View>

          {/* Row 3: Managed Bills & Meters */}
          <TouchableOpacity
            style={[styles.menuRow, styles.menuRowBorder]}
            onPress={showManagedBillsInfo}
            activeOpacity={0.7}
          >
            <View style={styles.menuRowLeft}>
              <View
                style={[
                  styles.menuIconBox,
                  {
                    backgroundColor: darkMode ? 'rgba(98, 255, 150, 0.15)' : '#E8F5E9',
                    borderColor: darkMode ? 'rgba(98, 255, 150, 0.35)' : '#C8E6C9',
                  },
                ]}
              >
                <AppIcon
                  name="receipt-long"
                  size={18}
                  color={darkMode ? '#62FF96' : '#006D35'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.menuRowTitle,
                    darkMode ? styles.darkText : styles.lightText,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {t.managedBillsMenu}
                </Text>
                <Text
                  style={[
                    styles.menuRowSubtitle,
                    darkMode ? styles.darkSub : styles.lightSub,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {savedCount} {t.activeNumbersLinked}
                </Text>
              </View>
            </View>
            <View style={styles.menuRowRight}>
              <View
                style={[
                  styles.countPill,
                  {
                    backgroundColor: darkMode ? 'rgba(98, 255, 150, 0.15)' : '#E8F5E9',
                    borderColor: darkMode ? 'rgba(98, 255, 150, 0.30)' : '#C8E6C9',
                    borderWidth: 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.countPillText,
                    { color: darkMode ? '#62FF96' : '#006D35' },
                  ]}
                >
                  {savedCount} {t.activeBadge}
                </Text>
              </View>
              <AppIcon
                name="chevron-right"
                size={16}
                color={darkMode ? '#64748B' : '#94A3B8'}
              />
            </View>
          </TouchableOpacity>

          {/* Row 4: Download History & Tax Statements */}
          <TouchableOpacity
            style={[styles.menuRow, styles.menuRowBorder]}
            onPress={showTaxStatementsInfo}
            activeOpacity={0.7}
          >
            <View style={styles.menuRowLeft}>
              <View
                style={[
                  styles.menuIconBox,
                  {
                    backgroundColor: darkMode ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7',
                    borderColor: darkMode ? 'rgba(251, 191, 36, 0.35)' : '#FDE68A',
                  },
                ]}
              >
                <AppIcon
                  name="file-download"
                  size={18}
                  color={darkMode ? '#FBBF24' : '#D97706'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.menuRowTitle,
                    darkMode ? styles.darkText : styles.lightText,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {t.downloadHistoryTax}
                </Text>
                <Text
                  style={[
                    styles.menuRowSubtitle,
                    darkMode ? styles.darkSub : styles.lightSub,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {t.downloadHistorySub}
                </Text>
              </View>
            </View>
            <AppIcon
              name="chevron-right"
              size={16}
              color={darkMode ? '#64748B' : '#94A3B8'}
            />
          </TouchableOpacity>

          {/* Row 5: Bill Notification Reminders */}
          <View style={[styles.menuRow, styles.menuRowBorder]}>
            <View style={styles.menuRowLeft}>
              <View
                style={[
                  styles.menuIconBox,
                  {
                    backgroundColor: darkMode ? 'rgba(63, 255, 139, 0.15)' : '#E8F5E9',
                    borderColor: darkMode ? 'rgba(63, 255, 139, 0.35)' : '#C8E6C9',
                  },
                ]}
              >
                <AppIcon
                  name="bell-ring"
                  size={18}
                  color={darkMode ? '#3FFF8B' : '#006D35'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.menuRowTitle,
                    darkMode ? styles.darkText : styles.lightText,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {t.billNotifications}
                </Text>
                <Text
                  style={[
                    styles.menuRowSubtitle,
                    darkMode ? styles.darkSub : styles.lightSub,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {t.billNotificationsSub}
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#CBD5E1', true: '#006D35' }}
              thumbColor={notificationsEnabled ? '#3FFF8B' : '#FFFFFF'}
            />
          </View>

          {/* Row 6: DISCO & SNGPL Helpline Directory */}
          <TouchableOpacity
            style={[styles.menuRow, styles.menuRowBorder]}
            onPress={showHelplineDirectory}
            activeOpacity={0.7}
          >
            <View style={styles.menuRowLeft}>
              <View
                style={[
                  styles.menuIconBox,
                  {
                    backgroundColor: darkMode ? 'rgba(20, 184, 166, 0.15)' : '#CCFBF1',
                    borderColor: darkMode ? 'rgba(45, 212, 191, 0.35)' : '#99F6E4',
                  },
                ]}
              >
                <AppIcon
                  name="phone-call"
                  size={18}
                  color={darkMode ? '#2DD4BF' : '#0D9488'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.menuRowTitle,
                    darkMode ? styles.darkText : styles.lightText,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {t.helplineDirectory}
                </Text>
                <Text
                  style={[
                    styles.menuRowSubtitle,
                    darkMode ? styles.darkSub : styles.lightSub,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {t.helplineDirectorySub}
                </Text>
              </View>
            </View>
            <AppIcon
              name="chevron-right"
              size={16}
              color={darkMode ? '#64748B' : '#94A3B8'}
            />
          </TouchableOpacity>

          {/* Row 7: About Arcloom Tech */}
          <TouchableOpacity
            style={[styles.menuRow, styles.menuRowBorder]}
            onPress={showAboutCompany}
            activeOpacity={0.7}
          >
            <View style={styles.menuRowLeft}>
              <View
                style={[
                  styles.menuIconBox,
                  {
                    backgroundColor: darkMode ? 'rgba(168, 85, 247, 0.15)' : '#F3E8FF',
                    borderColor: darkMode ? 'rgba(192, 132, 252, 0.35)' : '#E9D5FF',
                  },
                ]}
              >
                <AppIcon
                  name="corporate-fare"
                  size={18}
                  color={darkMode ? '#C084FC' : '#9333EA'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.menuRowTitle,
                    darkMode ? styles.darkText : styles.lightText,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {t.aboutCompany}
                </Text>
                <Text
                  style={[
                    styles.menuRowSubtitle,
                    darkMode ? styles.darkSub : styles.lightSub,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {t.aboutCompanySub}
                </Text>
              </View>
            </View>
            <AppIcon
              name="chevron-right"
              size={16}
              color={darkMode ? '#64748B' : '#94A3B8'}
            />
          </TouchableOpacity>

          {/* Row 8: Privacy Policy & Data Security */}
          <TouchableOpacity
            style={styles.menuRow}
            onPress={showPrivacyPolicy}
            activeOpacity={0.7}
          >
            <View style={styles.menuRowLeft}>
              <View
                style={[
                  styles.menuIconBox,
                  {
                    backgroundColor: darkMode ? 'rgba(244, 63, 94, 0.15)' : '#FFE4E6',
                    borderColor: darkMode ? 'rgba(251, 113, 133, 0.35)' : '#FECDD3',
                  },
                ]}
              >
                <AppIcon
                  name="security"
                  size={18}
                  color={darkMode ? '#FB7185' : '#E11D48'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.menuRowTitle,
                    darkMode ? styles.darkText : styles.lightText,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {t.privacyAndSecurity}
                </Text>
                <Text
                  style={[
                    styles.menuRowSubtitle,
                    darkMode ? styles.darkSub : styles.lightSub,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {t.privacyAndSecuritySub}
                </Text>
              </View>
            </View>
            <AppIcon
              name="chevron-right"
              size={16}
              color={darkMode ? '#64748B' : '#94A3B8'}
            />
          </TouchableOpacity>
        </View>

        {/* ── 4. Dedicated Prominent Non-Affiliation / DISCLAIMER Card (Stitch 100% Match) ── */}
        <View
          style={[
            styles.disclaimerCard,
            darkMode ? styles.darkCardBg : styles.lightCardBg,
          ]}
        >
          <View style={styles.disclaimerTop}>
            <View
              style={[
                styles.disclaimerIconBox,
                {
                  backgroundColor: darkMode ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
                  borderColor: darkMode ? 'rgba(239, 68, 68, 0.35)' : '#FECACA',
                },
              ]}
            >
              <AppIcon name="shield" size={18} color="#EF4444" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.disclaimerHeaderRow}>
                <AppIcon name="alert" size={14} color="#EF4444" />
                <Text
                  style={[
                    styles.disclaimerTitle,
                    darkMode ? styles.darkText : styles.lightText,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {t.officialDisclaimerTitle}
                </Text>
              </View>
              <Text
                style={[
                  styles.disclaimerBody,
                  darkMode ? styles.darkSub : styles.lightSub,
                  isUrdu && styles.rtlText,
                ]}
              >
                {t.officialDisclaimerText}
              </Text>

              <View style={styles.disclaimerFooter}>
                <Text style={styles.disclaimerFooterLeft}>
                  {t.publicGatewaySync}
                </Text>
                <View style={styles.disclaimerFooterRight}>
                  <View style={styles.activeDot} />
                  <Text
                    style={[
                      styles.disclaimerFooterRightText,
                      darkMode && styles.disclaimerFooterRightDark,
                    ]}
                  >
                    {t.verifiedPublicApis}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── 5. Clear Cache / Reset Button ── */}
        <TouchableOpacity
          style={[
            styles.resetButton,
            darkMode ? styles.darkCardBg : styles.lightCardBg,
          ]}
          onPress={promptResetApp}
          activeOpacity={0.7}
        >
          <AppIcon name="logout" size={17} color={darkMode ? '#F8FAFC' : '#0F172A'} />
          <Text
            style={[
              styles.resetButtonText,
              darkMode ? styles.darkText : styles.lightText,
            ]}
          >
            {t.clearCacheResetBtn}
          </Text>
        </TouchableOpacity>

        {/* ── 6. App Metadata & Copyright ── */}
        <View style={styles.footerSection}>
          <Text
            style={[
              styles.footerTextMain,
              darkMode ? styles.darkSub : styles.lightSub,
            ]}
          >
            {t.appFooterVersion}
          </Text>
          <Text style={styles.footerTextSub}>{t.appFooterLicense}</Text>
        </View>

        {/* ── 7. Optional Ad / Promotion Banner ── */}
        <View style={{ marginTop: 14 }}>
          <AdBanner darkMode={darkMode} language={language} />
        </View>
      </ScrollView>

      {/* ── Interactive Popups & Dialogs ── */}
      <CustomPopup {...popup} darkMode={darkMode} isUrdu={isUrdu} />
    </View>
  );
};

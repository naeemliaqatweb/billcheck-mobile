import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { AdBanner } from '../components/AdBanner';
import { AppIcon } from '../components/AppIcon';
import { CustomPopup, PopupConfig } from '../components/CustomPopup';
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
  const [popup, setPopup] = useState<PopupConfig>({
    visible: false,
    title: '',
    message: '',
  });

  const showPrivacyPolicy = () => {
    setPopup({
      visible: true,
      type: 'info',
      title: isUrdu ? 'رازداری کی پالیسی (Privacy Policy)' : 'Privacy Policy',
      message: isUrdu
        ? 'بل چیک پی کے (BillCheck PK) ارکلوم ٹیک (Arcloom Tech) کی جانب سے آپ کی رازداری کا مکمل احترام کرتا ہے۔ ہم کوئی بھی ذاتی ڈیٹا، شناختی کارڈ یا پاس ورڈ اکٹھا یا محفوظ نہیں کرتے۔ آپ کے تمام میٹرز اور ریفرنس نمبرز صرف اور صرف آپ کے اپنے موبائل کی لوکل میموری میں محفوظ رہتے ہیں۔'
        : 'BillCheck PK by Arcloom Tech respects your privacy. We DO NOT collect, harvest, or store personal identifiable information (PII). Any reference numbers or meter nicknames you save remain exclusively on your local device storage.',
      primaryText: isUrdu ? 'سمجھ گیا' : 'Got it',
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
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <AppIcon name="settings" size={24} color="#F59E0B" />
            <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText, isUrdu && styles.rtlText]}>
              {t.settingsTitle}
            </Text>
          </View>
          <Text style={[styles.subtitle, darkMode ? styles.darkSub : styles.lightSub, isUrdu && styles.rtlText]}>
            {t.appPreferences}
          </Text>
        </View>

        {/* Preferences Section */}
        <View style={[styles.sectionCard, darkMode ? styles.darkCard : styles.lightCard]}>
          {/* Language Switcher */}
          <View style={styles.settingRow}>
            <View style={styles.labelWithIcon}>
              <AppIcon name="globe" size={20} color="#0284C7" />
              <View style={{ marginLeft: 10 }}>
                <Text style={[styles.settingLabel, darkMode ? styles.darkText : styles.lightText]}>
                  {t.language}
                </Text>
                <Text style={[styles.settingSub, darkMode ? styles.darkSub : styles.lightSub]}>
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
                <Text style={[styles.langChoiceText, language === 'en' ? styles.langActiveText : (darkMode ? styles.darkSub : styles.lightSub)]}>
                  EN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.langChoice, language === 'ur' && styles.langChoiceActive]}
                onPress={() => onToggleLanguage('ur')}
                activeOpacity={0.7}
              >
                <Text style={[styles.langChoiceText, language === 'ur' ? styles.langActiveText : (darkMode ? styles.darkSub : styles.lightSub)]}>
                  اردو
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dark Mode Switcher */}
          <View style={[styles.settingRow, { marginTop: 12 }]}>
            <View style={styles.labelWithIcon}>
              <AppIcon name="moon" size={20} color="#6366F1" />
              <View style={{ marginLeft: 10 }}>
                <Text style={[styles.settingLabel, darkMode ? styles.darkText : styles.lightText]}>
                  {t.darkMode}
                </Text>
                <Text style={[styles.settingSub, darkMode ? styles.darkSub : styles.lightSub]}>
                  {darkMode ? 'Dark Slate' : 'Light Clean'}
                </Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={onToggleTheme}
              trackColor={{ false: '#CBD5E1', true: '#059669' }}
              thumbColor={darkMode ? '#10B981' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Play Store Legal Policy Compliance Section */}
        <View style={[styles.legalCard, darkMode ? styles.darkCard : styles.lightCard]}>
          <View style={styles.legalHeader}>
            <AppIcon name="shield" size={18} color="#059669" />
            <Text style={[styles.legalTitle, isUrdu && styles.rtlText]}>
              {t.legalDisclaimerTitle}
            </Text>
          </View>
          <Text style={[styles.legalBody, darkMode ? styles.darkSub : styles.lightSub, isUrdu && styles.rtlText]}>
            {t.legalDisclaimerText}
          </Text>
          <View style={styles.badgeContainer}>
            <View style={styles.complianceBadgeBox}>
              <AppIcon name="shield" size={13} color="#059669" />
              <Text style={styles.complianceBadgeText}>{t.playStoreCompliantBadge}</Text>
            </View>
          </View>
        </View>

        {/* Privacy and App Info Links */}
        <View style={[styles.sectionCard, darkMode ? styles.darkCard : styles.lightCard]}>
          <View style={styles.linkRow}>
            <View style={styles.labelWithIcon}>
              <Image
                source={require('../assets/images/app-logo.png')}
                style={{ width: 28, height: 28, borderRadius: 6 }}
                resizeMode="contain"
              />
              <Text style={[styles.linkLabel, darkMode ? styles.darkText : styles.lightText, { marginLeft: 10, fontWeight: '700' }]}>
                BillCheck PK
              </Text>
            </View>
            <Text style={[styles.versionText, { color: '#0284C7', fontWeight: '600' }]}>
              Electric & Gas
            </Text>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.linkRow} onPress={showPrivacyPolicy} activeOpacity={0.7}>
            <View style={styles.labelWithIcon}>
              <AppIcon name="lock" size={18} color="#0284C7" />
              <Text style={[styles.linkLabel, darkMode ? styles.darkText : styles.lightText, { marginLeft: 10 }]}>
                {t.privacyPolicy}
              </Text>
            </View>
            <AppIcon name="chevron-right" size={16} color={darkMode ? '#64748B' : '#94A3B8'} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.linkRow}>
            <View style={styles.labelWithIcon}>
              <AppIcon name="business" size={18} color="#6366F1" />
              <Text style={[styles.linkLabel, darkMode ? styles.darkText : styles.lightText, { marginLeft: 10 }]}>
                {isUrdu ? 'ڈیولپر (Developer)' : 'Developer'}
              </Text>
            </View>
            <Text style={[styles.versionText, { color: '#6366F1', fontWeight: '700' }]}>
              Arcloom Tech
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.linkRow}>
            <View style={styles.labelWithIcon}>
              <AppIcon name="document" size={18} color="#10B981" />
              <Text style={[styles.linkLabel, darkMode ? styles.darkText : styles.lightText, { marginLeft: 10 }]}>
                {t.appVersion}
              </Text>
            </View>
            <Text style={[styles.versionText, darkMode ? styles.darkSub : styles.lightSub]}>
              1.0.0 (Production)
            </Text>
          </View>
        </View>

        {/* SpendSense App Promotion Banner */}
        <AdBanner darkMode={darkMode} language={language} />
      </ScrollView>

      {/* ── Custom Animated Popup Modal ── */}
      <CustomPopup
        {...popup}
        darkMode={darkMode}
        isUrdu={isUrdu}
      />
    </View>
  );
};

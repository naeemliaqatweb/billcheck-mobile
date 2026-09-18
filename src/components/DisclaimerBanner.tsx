import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { APP_CONFIG } from '../constants/appConfig';
import { styles } from '../styles/DisclaimerBanner.styles';

interface DisclaimerBannerProps {
  language: 'en' | 'ur';
  darkMode?: boolean;
}

/**
 * Play Store Policy Compliant Government Non-Affiliation Disclaimer Banner
 */
export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ language, darkMode = true }) => {
  const isUrdu = language === 'ur';

  const handleOpenPrivacy = () => {
    Linking.openURL(APP_CONFIG.privacyPolicyUrl).catch(() => {});
  };

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.headerRow}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={[styles.title, darkMode ? styles.darkTitle : styles.lightTitle, isUrdu && styles.rtlText]}>
          {isUrdu ? 'قانونی وضاحت اور ڈسکلیمر' : 'Official Legal Notice'}
        </Text>
      </View>
      <Text style={[styles.description, darkMode ? styles.darkDesc : styles.lightDesc, isUrdu && styles.rtlText]}>
        {isUrdu
          ? 'بل چیک پی کے (BillCheck PK) ارکلوم ٹیک کی جانب سے تیار کردہ ایک غیر سرکاری آزاد ایپ ہے۔ اس کا حکومتِ پاکستان، واپڈا یا کسی بھی ڈسکو سے کوئی سرکاری تعلق نہیں ہے۔'
          : 'BillCheck PK is an independent utility tracking tool by Arcloom Tech. NOT affiliated with or endorsed by any government entity or utility provider.'}
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>
        <TouchableOpacity
          style={[styles.policyLinkRow, isUrdu && styles.rtlRow]}
          onPress={handleOpenPrivacy}
          activeOpacity={0.7}
        >
          <Text style={[styles.policyLinkText, darkMode ? styles.darkLink : styles.lightLink]}>
            {isUrdu ? 'پرائیویسی پالیسی ↗' : 'Privacy Policy ↗'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.policyLinkRow, isUrdu && styles.rtlRow]}
          onPress={() => Linking.openURL(APP_CONFIG.officialSourcesUrl).catch(() => {})}
          activeOpacity={0.7}
        >
          <Text style={[styles.policyLinkText, darkMode ? styles.darkLink : styles.lightLink]}>
            {isUrdu ? 'سرکاری معلومات کے ذرائع (PITC) ↗' : 'Official Sources (PITC) ↗'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



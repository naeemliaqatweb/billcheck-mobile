import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { APP_CONFIG } from '../constants/appConfig';

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
      <TouchableOpacity
        style={[styles.policyLinkRow, isUrdu && styles.rtlRow]}
        onPress={handleOpenPrivacy}
        activeOpacity={0.7}
      >
        <Text style={[styles.policyLinkText, darkMode ? styles.darkLink : styles.lightLink]}>
          {isUrdu ? 'رازداری کی پالیسی (Privacy Policy) پڑھیں ↗' : 'Read Official Privacy Policy ↗'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  darkContainer: {
    backgroundColor: '#1E1B18',
    borderColor: '#78350F',
  },
  lightContainer: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  icon: {
    fontSize: 14,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
  },
  darkTitle: {
    color: '#FBBF24',
  },
  lightTitle: {
    color: '#92400E',
  },
  description: {
    fontSize: 11,
    lineHeight: 16,
  },
  darkDesc: {
    color: '#FDE68A',
  },
  lightDesc: {
    color: '#78350F',
  },
  policyLinkRow: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  policyLinkText: {
    fontSize: 11,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  darkLink: {
    color: '#62FF96',
  },
  lightLink: {
    color: '#006D35',
  },
  rtlText: {
    textAlign: 'right',
  },
  rtlRow: {
    alignSelf: 'flex-end',
  },
});


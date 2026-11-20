import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, ViewStyle } from 'react-native';
import { AppIcon } from './AppIcon';
import { styles } from '../styles/SpendSenseBanner.styles';

export type PromoAppType = 'spendsense' | 'filervault';

export interface AdBannerProps {
  darkMode?: boolean;
  language?: 'en' | 'ur';
  variant?: 'compact' | 'full';
  containerStyle?: ViewStyle;
  app?: PromoAppType;
}

interface AppPromoConfig {
  name: string;
  taglineEn: string;
  taglineUr: string;
  descEn: string;
  descUr: string;
  playStoreUrl: string;
  marketUrl: string;
  logo: any;
  accentColor: string;
  pills: { icon: string; labelEn: string; labelUr: string }[];
  highlightEn: string;
  highlightUr: string;
}

const PROMO_APPS: Record<PromoAppType, AppPromoConfig> = {
  spendsense: {
    name: 'SpendSense',
    taglineEn: 'Smart Budget & Expense Tracker',
    taglineUr: 'سمارٹ بجٹ اور روزمرہ اخراجات ٹریکر',
    descEn: 'Track daily expenses, manage monthly budgets, scan receipts, and gain complete control over your finances.',
    descUr: 'روزمرہ کے گھریلو اخراجات، گروسری اور بلز کا تفصیلی حساب رکھیں اور ماہانہ بچت میں آسانی سے اضافہ کریں۔',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.naeemreactnative.groceryapp',
    marketUrl: 'market://details?id=com.naeemreactnative.groceryapp',
    logo: require('../assets/images/spendsense-logo.png'),
    accentColor: '#10B981',
    pills: [
      { icon: '📊', labelEn: 'Budget Analytics', labelUr: 'بجٹ اینالیٹکس' },
      { icon: '🧾', labelEn: 'Receipt Scanner', labelUr: 'رسید اسکینر' },
      { icon: '👥', labelEn: 'Split with Friends', labelUr: 'بل اسپلٹ' },
    ],
    highlightEn: 'Offline Support',
    highlightUr: 'آف لائن سپورٹ',
  },
  filervault: {
    name: 'FilerVault',
    taglineEn: 'FBR Tax, Wealth Ledger & Active Filer',
    taglineUr: 'ایف بی آر ٹیکس، ویلتھ لیجر اور ایکٹو فائلر',
    descEn: 'Check FBR active filer status, track withholding tax (WHT) on electricity & gas bills, and secure your wealth records.',
    descUr: 'ایف بی آر ایکٹو فائلر لسٹ چیک کریں، بجلی اور گیس بلوں پر کٹنے والا ود ہولڈنگ ٹیکس ٹریک کریں اور اثاثے محفوظ رکھیں۔',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.filervault',
    marketUrl: 'market://details?id=com.filervault',
    logo: require('../assets/images/filervault-logo.png'),
    accentColor: '#0284C7',
    pills: [
      { icon: '🛡️', labelEn: 'FBR Active Filer', labelUr: 'ایکٹو فائلر لسٹ' },
      { icon: '⚡', labelEn: 'Bill Tax Savings', labelUr: 'بلز ٹیکس بچت' },
      { icon: '🔒', labelEn: 'Biometric Vault', labelUr: 'بائیومیٹرک والٹ' },
    ],
    highlightEn: 'FBR Ready • Private',
    highlightUr: 'ایف بی آر مصدقہ • پرائیویٹ',
  },
};

export const AdBanner: React.FC<AdBannerProps> = ({
  darkMode = true,
  language = 'en',
  variant = 'compact',
  containerStyle,
  app = 'spendsense',
}) => {
  const isUrdu = language === 'ur';
  const promo = PROMO_APPS[app] || PROMO_APPS.spendsense;

  const handleOpenPlayStore = async () => {
    try {
      const canOpen = await Linking.canOpenURL(promo.marketUrl);
      if (canOpen) {
        await Linking.openURL(promo.marketUrl);
      } else {
        await Linking.openURL(promo.playStoreUrl);
      }
    } catch {
      Linking.openURL(promo.playStoreUrl);
    }
  };

  // 1. Compact Variant: Icon + Title + Small Description + Install Button
  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={[
          styles.compactContainer,
          darkMode ? styles.darkContainer : styles.lightContainer,
          containerStyle,
        ]}
        onPress={handleOpenPlayStore}
        activeOpacity={0.85}
      >
        <View style={[styles.compactContentRow, isUrdu && styles.rtlRow]}>
          {/* App Logo */}
          <View style={[styles.compactLogoWrap, { borderColor: promo.accentColor }]}>
            <Image
              source={promo.logo}
              style={styles.compactLogoImage}
              resizeMode="cover"
            />
          </View>

          {/* Info Column */}
          <View style={[styles.compactTextWrap, isUrdu && { alignItems: 'flex-end' }]}>
            <View style={[styles.compactTitleRow, isUrdu && styles.rtlRow]}>
              <Text style={[styles.compactAppName, darkMode ? styles.darkText : styles.lightText]}>
                {promo.name}
              </Text>
              <View style={[styles.compactAdBadge, { borderColor: `${promo.accentColor}55`, backgroundColor: `${promo.accentColor}1A` }]}>
                <Text style={[styles.compactAdBadgeText, { color: promo.accentColor }]}>AD</Text>
              </View>
              <View style={styles.compactFreeBadge}>
                <Text style={styles.compactFreeBadgeText}>
                  {isUrdu ? 'مفت' : 'Free'}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.compactTagline,
                darkMode ? styles.darkSub : styles.lightSub,
                isUrdu && styles.rtlText,
              ]}
              numberOfLines={1}
            >
              {isUrdu ? promo.taglineUr : promo.taglineEn}
            </Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.compactInstallBtn, { backgroundColor: promo.accentColor }]}
            onPress={handleOpenPlayStore}
            activeOpacity={0.8}
          >
            <AppIcon name="official" size={11} color="#FFFFFF" />
            <Text style={styles.compactInstallBtnText}>
              {isUrdu ? 'انسٹال' : 'Install'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  // 2. Full Variant: Rich Card with Badges, Feature Pills, Rating & Large CTA
  return (
    <View
      style={[
        styles.container,
        darkMode ? styles.darkContainer : styles.lightContainer,
        containerStyle,
      ]}
    >
      {/* Top Tag Row */}
      <View style={[styles.topRow, isUrdu && styles.rtlRow]}>
        <View style={[styles.featuredBadge, { borderColor: `${promo.accentColor}44`, backgroundColor: `${promo.accentColor}1E` }]}>
          <AppIcon name="sparkles" size={12} color={promo.accentColor} />
          <Text style={[styles.featuredText, { color: promo.accentColor }]}>
            {isUrdu ? 'ہماری تجویز کردہ ایپ' : 'RECOMMENDED APP'}
          </Text>
        </View>
        <View style={styles.freeBadge}>
          <Text style={styles.freeBadgeText}>
            {isUrdu ? '100% مفت' : '100% Free'}
          </Text>
        </View>
      </View>

      {/* App Identity Row */}
      <View style={[styles.contentRow, isUrdu && styles.rtlRow]}>
        <View style={[styles.logoWrap, { borderColor: promo.accentColor }]}>
          <Image
            source={promo.logo}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>

        <View style={[styles.textWrap, isUrdu && { alignItems: 'flex-end' }]}>
          <View style={[styles.appNameRow, isUrdu && styles.rtlRow]}>
            <Text style={[styles.appName, darkMode ? styles.darkText : styles.lightText]}>
              {promo.name}
            </Text>
          </View>
          <Text style={[styles.tagline, isUrdu && styles.rtlText]}>
            {isUrdu ? promo.taglineUr : promo.taglineEn}
          </Text>
        </View>
      </View>

      {/* Feature Description */}
      <Text style={[styles.description, darkMode ? styles.darkSub : styles.lightSub, isUrdu && styles.rtlText]}>
        {isUrdu ? promo.descUr : promo.descEn}
      </Text>

      {/* Feature Pills */}
      <View style={[styles.featuresRow, isUrdu && styles.rtlRow]}>
        {promo.pills.map((pill, idx) => (
          <View key={idx} style={[styles.featurePill, darkMode ? styles.darkPill : styles.lightPill]}>
            <Text style={{ fontSize: 10 }}>{pill.icon}</Text>
            <Text style={[styles.pillText, darkMode ? styles.darkText : styles.lightText]}>
              {isUrdu ? pill.labelUr : pill.labelEn}
            </Text>
          </View>
        ))}
      </View>

      {/* Bottom Action Row */}
      <View style={[styles.actionRow, isUrdu && styles.rtlRow]}>
        <View style={[styles.ratingWrap, isUrdu && styles.rtlRow]}>
          <Text style={styles.ratingStar}>★</Text>
          <Text style={[styles.ratingText, darkMode ? styles.darkText : styles.lightText]}>
            4.9
          </Text>
          <Text style={[styles.ratingText, darkMode ? styles.darkSub : styles.lightSub]}>
            • {isUrdu ? promo.highlightUr : promo.highlightEn}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.installBtn, { backgroundColor: promo.accentColor }]}
          onPress={handleOpenPlayStore}
          activeOpacity={0.8}
        >
          <AppIcon name="official" size={13} color="#FFFFFF" />
          <Text style={styles.installBtnText}>
            {isUrdu ? 'انسٹال کریں' : 'Install Free'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

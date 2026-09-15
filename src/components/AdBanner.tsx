import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, ViewStyle } from 'react-native';
import { AppIcon } from './AppIcon';
import { styles } from '../styles/SpendSenseBanner.styles';

export interface AdBannerProps {
  darkMode?: boolean;
  language?: 'en' | 'ur';
  variant?: 'compact' | 'full';
  containerStyle?: ViewStyle;
}

const SPENDSENSE_PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.naeemreactnative.groceryapp';
const SPENDSENSE_MARKET = 'market://details?id=com.naeemreactnative.groceryapp';

export const AdBanner: React.FC<AdBannerProps> = ({
  darkMode = true,
  language = 'en',
  variant = 'compact',
  containerStyle,
}) => {
  const isUrdu = language === 'ur';

  const handleOpenPlayStore = async () => {
    try {
      const canOpen = await Linking.canOpenURL(SPENDSENSE_MARKET);
      if (canOpen) {
        await Linking.openURL(SPENDSENSE_MARKET);
      } else {
        await Linking.openURL(SPENDSENSE_PLAY_STORE);
      }
    } catch {
      Linking.openURL(SPENDSENSE_PLAY_STORE);
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
          <View style={styles.compactLogoWrap}>
            <Image
              source={require('../assets/images/spendsense-logo.png')}
              style={styles.compactLogoImage}
              resizeMode="cover"
            />
          </View>

          {/* Info Column */}
          <View style={[styles.compactTextWrap, isUrdu && { alignItems: 'flex-end' }]}>
            <View style={[styles.compactTitleRow, isUrdu && styles.rtlRow]}>
              <Text style={[styles.compactAppName, darkMode ? styles.darkText : styles.lightText]}>
                SpendSense
              </Text>
              <View style={styles.compactAdBadge}>
                <Text style={styles.compactAdBadgeText}>AD</Text>
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
              {isUrdu ? 'سمارٹ بجٹ اور روزمرہ اخراجات ٹریکر' : 'Smart Budget & Expense Tracker'}
            </Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.compactInstallBtn}
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
        <View style={styles.featuredBadge}>
          <AppIcon name="sparkles" size={12} color="#10B981" />
          <Text style={styles.featuredText}>
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
        <View style={styles.logoWrap}>
          <Image
            source={require('../assets/images/spendsense-logo.png')}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>

        <View style={[styles.textWrap, isUrdu && { alignItems: 'flex-end' }]}>
          <View style={[styles.appNameRow, isUrdu && styles.rtlRow]}>
            <Text style={[styles.appName, darkMode ? styles.darkText : styles.lightText]}>
              SpendSense
            </Text>
          </View>
          <Text style={[styles.tagline, isUrdu && styles.rtlText]}>
            {isUrdu ? 'سمارٹ بجٹ اور روزمرہ اخراجات ٹریکر' : 'Smart Budget & Expense Tracker'}
          </Text>
        </View>
      </View>

      {/* Feature Description */}
      <Text style={[styles.description, darkMode ? styles.darkSub : styles.lightSub, isUrdu && styles.rtlText]}>
        {isUrdu
          ? 'روزمرہ کے گھریلو اخراجات، گروسری اور بلز کا تفصیلی حساب رکھیں اور ماہانہ بچت میں آسانی سے اضافہ کریں۔'
          : 'Track daily expenses, manage monthly budgets, scan receipts, and gain complete control over your finances.'}
      </Text>

      {/* Feature Pills */}
      <View style={[styles.featuresRow, isUrdu && styles.rtlRow]}>
        <View style={[styles.featurePill, darkMode ? styles.darkPill : styles.lightPill]}>
          <Text style={{ fontSize: 10 }}>📊</Text>
          <Text style={[styles.pillText, darkMode ? styles.darkText : styles.lightText]}>
            {isUrdu ? 'بجٹ اینالیٹکس' : 'Budget Analytics'}
          </Text>
        </View>

        <View style={[styles.featurePill, darkMode ? styles.darkPill : styles.lightPill]}>
          <Text style={{ fontSize: 10 }}>🧾</Text>
          <Text style={[styles.pillText, darkMode ? styles.darkText : styles.lightText]}>
            {isUrdu ? 'رسید اسکینر' : 'Receipt Scanner'}
          </Text>
        </View>

        <View style={[styles.featurePill, darkMode ? styles.darkPill : styles.lightPill]}>
          <Text style={{ fontSize: 10 }}>👥</Text>
          <Text style={[styles.pillText, darkMode ? styles.darkText : styles.lightText]}>
            {isUrdu ? 'بل اسپلٹ' : 'Split with Friends'}
          </Text>
        </View>
      </View>

      {/* Bottom Action Row */}
      <View style={[styles.actionRow, isUrdu && styles.rtlRow]}>
        <View style={[styles.ratingWrap, isUrdu && styles.rtlRow]}>
          <Text style={styles.ratingStar}>★</Text>
          <Text style={[styles.ratingText, darkMode ? styles.darkText : styles.lightText]}>
            4.9
          </Text>
          <Text style={[styles.ratingText, darkMode ? styles.darkSub : styles.lightSub]}>
            • {isUrdu ? 'آف لائن سپورٹ' : 'Offline Support'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.installBtn}
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

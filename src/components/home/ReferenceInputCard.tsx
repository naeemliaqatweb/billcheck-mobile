import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Animated,
} from 'react-native';
import { ProviderInfo } from '../../types/bill';
import { AppIcon } from '../AppIcon';
import { ProviderLogo } from '../ProviderLogo';
import { FloatingLabelInput } from '../FloatingLabelInput';
import { styles } from '../../styles/ReferenceInputCard.styles';

interface ReferenceInputCardProps {
  utilityType: 'electricity' | 'gas';
  selectedProvider: ProviderInfo;
  referenceNo: string;
  onChangeReferenceNo: (text: string) => void;
  onCheckBill: () => void;
  loading: boolean;
  darkMode: boolean;
  isUrdu: boolean;
  labels: {
    referenceNumber: string;
    consumerId: string;
    whereToFindRef: string;
    refExplanation: string;
    checkBillBtn: string;
  };
}

export const ReferenceInputCard: React.FC<ReferenceInputCardProps> = ({
  utilityType,
  selectedProvider,
  referenceNo,
  onChangeReferenceNo,
  onCheckBill,
  loading,
  darkMode,
  isUrdu,
  labels,
}) => {
  const requiredLength = selectedProvider.refLength || (utilityType === 'electricity' ? 14 : 10);
  const isComplete = referenceNo.length === requiredLength;

  // Smooth fade-in animation for button visibility
  const btnAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(btnAnim, {
      toValue: isComplete ? 1 : 0,
      tension: 90,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isComplete]);

  const headingText = isUrdu
    ? (utilityType === 'electricity'
        ? `اپنا ${requiredLength} ہندسوں کا حوالہ نمبر درج کریں`
        : `اپنا ${requiredLength} ہندسوں کا کنزیومر آئی ڈی درج کریں`)
    : (utilityType === 'electricity'
        ? `Enter your ${requiredLength}-digit Reference Number`
        : `Enter your ${requiredLength}-digit Consumer ID`);

  const fieldLabel = utilityType === 'electricity' ? labels.referenceNumber : labels.consumerId;
  const cardBg = darkMode ? '#111827' : '#FFFFFF';

  return (
    <View style={[styles.inputCard, darkMode ? styles.darkCard : styles.lightCard]}>
      {/* Top Heading like the screenshot */}
      <View style={styles.cardHeaderRow}>
        <Text
          style={[
            styles.cardHeadingText,
            darkMode ? styles.darkText : styles.lightText,
            isUrdu && styles.rtlText,
          ]}
        >
          {headingText}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <ProviderLogo
            code={selectedProvider.code}
            size={22}
            badgeColor={selectedProvider.badgeColor}
          />
          <Text style={[styles.providerBadge, { color: selectedProvider.badgeColor }]}>
            {selectedProvider.name}
          </Text>
        </View>
      </View>

      {/* Floating Label Input with Notch and 14-digit Counter */}
      <FloatingLabelInput
        label={fieldLabel}
        value={referenceNo}
        onChangeText={onChangeReferenceNo}
        maxLength={requiredLength}
        keyboardType="numeric"
        accentColor={selectedProvider.badgeColor || '#6366F1'}
        cardBg={cardBg}
        darkMode={darkMode}
        isUrdu={isUrdu}
        showCounter={true}
      />

      {/* Where to find Info Box */}
      <View style={styles.refInfoBox}>
        <View style={styles.refInfoTitleRow}>
          <AppIcon name="info" size={14} color="#38BDF8" />
          <Text style={styles.refInfoTitle}>{labels.whereToFindRef}</Text>
        </View>
        <Text style={[styles.refInfoDesc, darkMode ? styles.darkSub : styles.lightSub, isUrdu && styles.rtlText]}>
          {labels.refExplanation}
        </Text>
      </View>

      {/* Check Bill Button — ONLY VISIBLE WHEN EXACTLY 14 DIGITS ENTERED */}
      {isComplete ? (
        <Animated.View
          style={{
            opacity: btnAnim,
            transform: [
              {
                scale: btnAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.92, 1],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            style={[styles.checkButton, { backgroundColor: selectedProvider.badgeColor }]}
            onPress={onCheckBill}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.btnRow}>
                <AppIcon name="search" size={18} color="#FFFFFF" />
                <Text style={styles.checkButtonText}>{labels.checkBillBtn}</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Text style={[styles.counterHint, darkMode ? styles.darkSub : styles.lightSub]}>
          {isUrdu
            ? `بل چیک کرنے کے لیے تمام ${requiredLength} ہندسے درج کریں (${referenceNo.length}/${requiredLength})`
            : `Enter all ${requiredLength} digits to check bill (${referenceNo.length}/${requiredLength})`}
        </Text>
      )}

      {/* Official Portal Fallback Link */}
      <TouchableOpacity
        style={styles.portalFallbackBtn}
        onPress={() => Linking.openURL(selectedProvider.portalUrl || 'https://bill.pitc.com.pk/')}
        activeOpacity={0.7}
      >
        <View style={styles.portalFallbackRow}>
          <AppIcon name="globe" size={14} color={selectedProvider.badgeColor} />
          <Text style={[styles.portalFallbackText, { color: selectedProvider.badgeColor }]}>
            {isUrdu
              ? `${selectedProvider.name} کے آفیشل پورٹل پر دیکھیں`
              : `Check on Official ${selectedProvider.name} Portal`}
          </Text>
          <AppIcon name="chevron-right" size={14} color={selectedProvider.badgeColor} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

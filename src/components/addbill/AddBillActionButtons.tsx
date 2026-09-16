import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/AddBillScreen.styles';

interface AddBillActionButtonsProps {
  loading: boolean;
  onFetchBill: () => void;
  onScanDemo: () => void;
  darkMode: boolean;
  getBillCtaText: string;
  scanBarcodeText: string;
  encryptedNoticeText: string;
}

export const AddBillActionButtons: React.FC<AddBillActionButtonsProps> = ({
  loading,
  onFetchBill,
  onScanDemo,
  darkMode,
  getBillCtaText,
  scanBarcodeText,
  encryptedNoticeText,
}) => {
  return (
    <>
      {/* Primary Fetch Bill CTA */}
      <TouchableOpacity
        style={styles.primaryCtaBtn}
        onPress={onFetchBill}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <Text style={styles.primaryCtaText}>{getBillCtaText}</Text>
            <AppIcon name="arrow-forward" size={18} color="#FFFFFF" />
          </>
        )}
      </TouchableOpacity>

      {/* Secondary Quick Scan / Demo CTA */}
      <TouchableOpacity
        style={[
          styles.secondaryScanBtn,
          darkMode ? styles.secondaryScanBtnDark : styles.secondaryScanBtnLight,
        ]}
        onPress={onScanDemo}
        activeOpacity={0.7}
      >
        <AppIcon
          name="qr-scanner"
          size={18}
          color={darkMode ? '#62FF96' : '#0C2B4E'}
        />
        <Text
          style={[
            styles.secondaryScanText,
            darkMode ? styles.darkText : styles.lightText,
          ]}
        >
          {scanBarcodeText}
        </Text>
      </TouchableOpacity>

      {/* Encryption Note Footer */}
      <View style={styles.encryptionWrap}>
        <AppIcon name="lock" size={13} color="#74777D" />
        <Text
          style={[
            styles.encryptionText,
            darkMode ? styles.darkSub : styles.lightSub,
          ]}
        >
          {encryptedNoticeText}
        </Text>
      </View>
    </>
  );
};

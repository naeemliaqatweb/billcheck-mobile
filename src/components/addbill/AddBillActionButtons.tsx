import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/AddBillScreen.styles';

interface AddBillActionButtonsProps {
  loading: boolean;
  onFetchBill: () => void;
  darkMode: boolean;
  getBillCtaText: string;
  encryptedNoticeText: string;
}

export const AddBillActionButtons: React.FC<AddBillActionButtonsProps> = ({
  loading,
  onFetchBill,
  darkMode,
  getBillCtaText,
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

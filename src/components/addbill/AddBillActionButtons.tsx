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
  onOpenInAppPortal?: () => void;
  openInAppPortalText?: string;
}

export const AddBillActionButtons: React.FC<AddBillActionButtonsProps> = ({
  loading,
  onFetchBill,
  darkMode,
  getBillCtaText,
  encryptedNoticeText,
  onOpenInAppPortal,
  openInAppPortalText,
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

      {/* Secondary In-App Portal Button */}
      {onOpenInAppPortal && (
        <TouchableOpacity
          style={[
            styles.primaryCtaBtn,
            {
              backgroundColor: 'transparent',
              borderWidth: 1.5,
              borderColor: darkMode ? '#38BDF8' : '#0284C7',
              marginTop: 10,
            },
          ]}
          onPress={onOpenInAppPortal}
          activeOpacity={0.8}
        >
          <AppIcon name="globe" size={17} color={darkMode ? '#38BDF8' : '#0284C7'} />
          <Text
            style={[
              styles.primaryCtaText,
              { color: darkMode ? '#38BDF8' : '#0284C7', marginLeft: 8 },
            ]}
          >
            {openInAppPortalText || '🌐 Open Official Portal In-App'}
          </Text>
        </TouchableOpacity>
      )}

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

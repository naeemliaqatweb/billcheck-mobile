import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import { AppIcon, IconName } from './AppIcon';
import { styles } from '../styles/CustomPopup.styles';

export type PopupType = 'success' | 'error' | 'warning' | 'info' | 'bill-alert';

export interface PopupConfig {
  visible: boolean;
  type?: PopupType;
  title: string;
  message: string;
  primaryText?: string;
  secondaryText?: string;
  confirmText?: string;
  cancelText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  onPrimary?: () => void;
  onSecondary?: () => void;
  onConfirm?: () => void;
  onClose?: () => void;
  autoCloseMs?: number;
}

export interface CustomPopupProps extends PopupConfig {
  darkMode: boolean;
  isUrdu?: boolean;
}

export const CustomPopup: React.FC<CustomPopupProps> = ({
  visible,
  type = 'info',
  title,
  message,
  primaryText,
  secondaryText,
  confirmText,
  cancelText,
  onPrimaryPress,
  onSecondaryPress,
  onPrimary,
  onSecondary,
  onConfirm,
  onClose,
  autoCloseMs,
  darkMode,
  isUrdu = false,
}) => {
  const finalPrimaryText = primaryText || confirmText;
  const finalSecondaryText = secondaryText || cancelText;
  const finalOnPrimaryPress = onPrimary || onPrimaryPress || onConfirm;
  const finalOnSecondaryPress = onSecondary || onSecondaryPress;

  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      if (autoCloseMs && autoCloseMs > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseMs);
        return () => clearTimeout(timer);
      }
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  if (!visible) return null;

  const getTypeTheme = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'check' as IconName,
          iconBg: '#059669',
          borderColor: '#10B981',
          primaryBg: '#059669',
          defaultPrimary: isUrdu ? 'ٹھیک ہے' : 'OK',
        };
      case 'warning':
        return {
          icon: 'alert' as IconName,
          iconBg: '#D97706',
          borderColor: '#F59E0B',
          primaryBg: '#DC2626',
          defaultPrimary: isUrdu ? 'تصدیق کریں' : 'Confirm',
        };
      case 'error':
        return {
          icon: 'close' as IconName,
          iconBg: '#DC2626',
          borderColor: '#EF4444',
          primaryBg: '#DC2626',
          defaultPrimary: isUrdu ? 'ٹھیک ہے' : 'OK',
        };
      case 'bill-alert':
        return {
          icon: 'bolt' as IconName,
          iconBg: '#0284C7',
          borderColor: '#38BDF8',
          primaryBg: '#0284C7',
          defaultPrimary: isUrdu ? 'بل دیکھیں' : 'View Bill',
        };
      default:
        return {
          icon: 'info' as IconName,
          iconBg: '#6366F1',
          borderColor: '#818CF8',
          primaryBg: '#4F46E5',
          defaultPrimary: isUrdu ? 'ٹھیک ہے' : 'Got it',
        };
    }
  };

  const theme = getTypeTheme();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <Animated.View
          style={[
            styles.card,
            darkMode ? styles.darkCard : styles.lightCard,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
              borderColor: darkMode ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          {/* Icon Badge */}
          <View style={[styles.iconCircle, { backgroundColor: theme.iconBg }]}>
            <AppIcon name={theme.icon} size={24} color="#FFFFFF" />
          </View>

          {/* Title */}
          <Text
            style={[
              styles.title,
              darkMode ? styles.darkText : styles.lightText,
              isUrdu && styles.rtlText,
            ]}
          >
            {title}
          </Text>

          {/* Message */}
          <Text
            style={[
              styles.message,
              darkMode ? styles.darkSub : styles.lightSub,
              isUrdu && styles.rtlText,
            ]}
          >
            {message}
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            {finalSecondaryText ? (
              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  darkMode ? styles.darkBtnSec : styles.lightBtnSec,
                  { flex: 1 },
                ]}
                onPress={() => {
                  handleClose();
                  finalOnSecondaryPress?.();
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.secondaryButtonText, darkMode ? styles.darkText : styles.lightText]}
                  numberOfLines={1}
                >
                  {finalSecondaryText}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: theme.primaryBg, flex: 1 },
              ]}
              onPress={() => {
                handleClose();
                finalOnPrimaryPress?.();
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText} numberOfLines={1}>
                {finalPrimaryText || theme.defaultPrimary}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

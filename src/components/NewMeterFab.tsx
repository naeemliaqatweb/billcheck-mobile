import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  ViewStyle,
} from 'react-native';
import { AppIcon } from './AppIcon';
import { Language } from '../i18n/translations';
import { styles } from '../styles/NewMeterFab.styles';

interface NewMeterFabProps {
  onPress: () => void;
  language?: Language;
  style?: ViewStyle;
}

export const NewMeterFab: React.FC<NewMeterFabProps> = ({
  onPress,
  language = 'en',
  style,
}) => {
  const isUrdu = language === 'ur';
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.fabContainer,
        { transform: [{ scale: scaleAnim }] },
        style,
      ]}
    >
      <TouchableOpacity
        style={[styles.fabBtn, isUrdu && styles.fabBtnRtl]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        accessibilityLabel={isUrdu ? 'نیا میٹر شامل کریں' : 'Add New Meter'}
        accessibilityRole="button"
      >
        <AppIcon name="plus" size={18} color="#62FF96" />
        <Text style={styles.fabLabel} numberOfLines={1}>
          {isUrdu ? 'نیا میٹر' : 'New Meter'}
        </Text>
        <Animated.View
          style={[
            styles.pulseDot,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};


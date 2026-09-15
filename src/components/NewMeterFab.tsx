import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { AppIcon } from './AppIcon';
import { Language } from '../i18n/translations';

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
        style={styles.fabBtn}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        accessibilityLabel="Add New Meter"
        accessibilityRole="button"
      >
        <AppIcon name="plus" size={18} color="#62FF96" />
        <Text style={styles.fabLabel}>
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

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 18,
    zIndex: 99,
  },
  fabBtn: {
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: '#0F1C2C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.2,
    borderColor: 'rgba(98, 255, 150, 0.35)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#62FF96',
    marginLeft: 2,
  },
});

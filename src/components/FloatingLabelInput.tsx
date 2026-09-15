import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Animated,
  ViewStyle,
} from 'react-native';
import { styles } from '../styles/FloatingLabelInput.styles';

interface FloatingLabelInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  keyboardType?: 'numeric' | 'default';
  accentColor?: string;
  cardBg?: string;
  darkMode?: boolean;
  isUrdu?: boolean;
  showCounter?: boolean;
  containerStyle?: ViewStyle;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onChangeText,
  maxLength = 14,
  keyboardType = 'numeric',
  accentColor = '#6366F1',
  cardBg,
  darkMode = true,
  isUrdu = false,
  showCounter = true,
  containerStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const anim = useRef(new Animated.Value(value.length > 0 ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isFocused || value.length > 0 ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const bg = cardBg || (darkMode ? '#111827' : '#FFFFFF');
  const textColor = darkMode ? '#F9FAFB' : '#0F172A';
  const subColor = darkMode ? '#9CA3AF' : '#64748B';
  const borderColor = isFocused ? accentColor : (darkMode ? '#374151' : '#CBD5E1');

  const labelTop = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [18, -10],
  });

  const labelFontSize = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 11.5],
  });

  const labelColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [subColor, accentColor],
  });

  const handleTextChange = (text: string) => {
    // Only accept numeric digits up to maxLength (strict enforcement)
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, maxLength);
    onChangeText(cleaned);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputWrapper, { borderColor, backgroundColor: bg }]}>
        {/* Floating Label with background notch */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.labelContainer,
            {
              top: labelTop,
              backgroundColor: bg,
              left: isUrdu ? undefined : 14,
              right: isUrdu ? 14 : undefined,
            },
          ]}
        >
          <Animated.Text
            style={[
              styles.labelText,
              {
                fontSize: labelFontSize,
                color: labelColor,
              },
              isUrdu && styles.rtlText,
            ]}
          >
            {label}
          </Animated.Text>
        </Animated.View>

        {/* Text Input */}
        <TextInput
          style={[
            styles.textInput,
            { color: textColor },
            isUrdu && styles.rtlText,
          ]}
          value={value}
          onChangeText={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          maxLength={maxLength}
          returnKeyType="done"
        />
      </View>

      {/* Bottom Counter (e.g. 14/14) */}
      {showCounter && (
        <View style={styles.bottomRow}>
          <Animated.Text
            style={[
              styles.counterText,
              {
                color:
                  value.length === maxLength
                    ? '#10B981'
                    : subColor,
              },
            ]}
          >
            {value.length}/{maxLength}
          </Animated.Text>
        </View>
      )}
    </View>
  );
};

import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { getProviderLogo } from '../constants/providerLogos';

interface ProviderLogoProps {
  code: string;
  size?: number;
  badgeColor?: string;
  containerStyle?: ViewStyle;
}

export const ProviderLogo: React.FC<ProviderLogoProps> = ({
  code,
  size = 42,
  badgeColor = '#059669',
  containerStyle,
}) => {
  const logo = getProviderLogo(code);
  const radius = Math.round(size / 2);
  const imgSize = Math.round(size * 0.88);

  if (logo) {
    return (
      <View
        style={[
          styles.logoContainer,
          {
            width: size,
            height: size,
            borderRadius: radius,
          },
          containerStyle,
        ]}
      >
        <Image
          source={logo}
          style={{ width: imgSize, height: imgSize }}
          resizeMode="contain"
        />
      </View>
    );
  }

  // Fallback if logo not yet available (e.g. SNGPL, SSGC)
  return (
    <View
      style={[
        styles.fallbackContainer,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: badgeColor,
        },
        containerStyle,
      ]}
    >
      <Text style={[styles.fallbackText, { fontSize: Math.round(size * 0.35) }]}>
        {code ? code.substring(0, 2).toUpperCase() : '??'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: '#FFFFFF',
    fontWeight: '900',
    textAlign: 'center',
  },
});

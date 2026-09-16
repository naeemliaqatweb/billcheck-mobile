import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface ElectricGridAnimationProps {
  darkMode?: boolean;
}

export const ElectricGridAnimation: React.FC<ElectricGridAnimationProps> = ({
  darkMode = true,
}) => {
  return (
    <View style={styles.container} pointerEvents="none">
      {/* Base Pakistani National Grid Illustration Image */}
      <Image
        source={require('../../assets/images/electric_grid_bg.webp')}
        style={[
          styles.bgImage,
          { opacity: darkMode ? 0.65 : 0.50 },
        ]}
        resizeMode="cover"
      />

      {/* Deep Navy Gradient Overlay for Crystal Clear Visibility */}
      <View
        style={[
          styles.overlayTint,
          darkMode ? styles.tintDark : styles.tintLight,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  bgImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlayTint: {
    ...StyleSheet.absoluteFill,
  },
  tintDark: {
    backgroundColor: 'rgba(12, 35, 60, 0.40)',
  },
  tintLight: {
    backgroundColor: 'rgba(12, 35, 60, 0.50)',
  },
});

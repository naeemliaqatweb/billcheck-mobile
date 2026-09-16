import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ElectricGridAnimationProps {
  darkMode?: boolean;
}

export const ElectricGridAnimation: React.FC<ElectricGridAnimationProps> = ({
  darkMode = true,
}) => {
  // 1. Horizontal power pulse sweep along transmission lines
  const pulseSweep = useRef(new Animated.Value(0)).current;

  // 2. Substation node glow breathing
  const nodeGlow = useRef(new Animated.Value(0.4)).current;

  // 3. Electric voltage shimmer / subtle lightning wave
  const voltageShimmer = useRef(new Animated.Value(0.3)).current;

  // 4. Secondary beam sweep in reverse direction
  const reverseBeam = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Power pulse sweep loop
    const sweepAnimation = Animated.loop(
      Animated.timing(pulseSweep, {
        toValue: 1,
        duration: 3500,
        useNativeDriver: true,
      })
    );

    // 2. Substation nodes breathing loop
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(nodeGlow, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(nodeGlow, {
          toValue: 0.35,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    // 3. Shimmer wave
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(voltageShimmer, {
          toValue: 0.85,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(voltageShimmer, {
          toValue: 0.25,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    // 4. Reverse beam
    const reverseAnimation = Animated.loop(
      Animated.timing(reverseBeam, {
        toValue: 1,
        duration: 4800,
        useNativeDriver: true,
      })
    );

    sweepAnimation.start();
    glowAnimation.start();
    shimmerAnimation.start();
    reverseAnimation.start();

    return () => {
      sweepAnimation.stop();
      glowAnimation.stop();
      shimmerAnimation.stop();
      reverseAnimation.stop();
    };
  }, [pulseSweep, nodeGlow, voltageShimmer, reverseBeam]);

  const sweepTranslateX = pulseSweep.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH * 0.6, SCREEN_WIDTH * 1.2],
  });

  const reverseTranslateX = reverseBeam.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_WIDTH * 1.2, -SCREEN_WIDTH * 0.6],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {/* 1. Base Pakistani National Grid Illustration Image */}
      <Image
        source={require('../../assets/images/electric_grid_bg.webp')}
        style={[
          styles.bgImage,
          { opacity: darkMode ? 0.32 : 0.22 },
        ]}
        resizeMode="cover"
      />

      {/* 2. Deep Navy Gradient / Solid Protection Tint */}
      <View
        style={[
          styles.overlayTint,
          darkMode ? styles.tintDark : styles.tintLight,
        ]}
      />

      {/* 3. High-Voltage Power Line Primary Pulse Beam */}
      <Animated.View
        style={[
          styles.energyBeam,
          {
            transform: [{ translateX: sweepTranslateX }, { rotate: '-8deg' }],
            opacity: voltageShimmer,
          },
        ]}
      />

      {/* 4. Secondary Return Transmission Wave */}
      <Animated.View
        style={[
          styles.secondaryEnergyBeam,
          {
            transform: [{ translateX: reverseTranslateX }, { rotate: '12deg' }],
            opacity: nodeGlow,
          },
        ]}
      />

      {/* 5. Pulsing Substation Nodes / Grid Towers */}
      {/* Left Tower Node */}
      <Animated.View
        style={[
          styles.substationNode,
          styles.nodeLeft,
          {
            opacity: nodeGlow,
            transform: [
              {
                scale: nodeGlow.interpolate({
                  inputRange: [0.35, 1],
                  outputRange: [0.85, 1.35],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.nodeCore} />
      </Animated.View>

      {/* Center Substation Node */}
      <Animated.View
        style={[
          styles.substationNode,
          styles.nodeCenter,
          {
            opacity: voltageShimmer,
            transform: [
              {
                scale: voltageShimmer.interpolate({
                  inputRange: [0.25, 0.85],
                  outputRange: [0.9, 1.4],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.nodeCoreCyan} />
      </Animated.View>

      {/* Right Tower Node */}
      <Animated.View
        style={[
          styles.substationNode,
          styles.nodeRight,
          {
            opacity: nodeGlow,
            transform: [
              {
                scale: nodeGlow.interpolate({
                  inputRange: [0.35, 1],
                  outputRange: [0.8, 1.3],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.nodeCore} />
      </Animated.View>

      {/* 6. Subtle Electric Grid Circuit Lines */}
      <View style={styles.circuitMesh}>
        <View style={[styles.circuitLineH, { top: '35%' }]} />
        <View style={[styles.circuitLineH, { top: '65%' }]} />
      </View>
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
    backgroundColor: 'rgba(12, 43, 78, 0.65)',
  },
  tintLight: {
    backgroundColor: 'rgba(12, 43, 78, 0.72)',
  },
  energyBeam: {
    position: 'absolute',
    top: 20,
    width: 140,
    height: 180,
    backgroundColor: 'rgba(98, 255, 150, 0.12)',
    borderRadius: 70,
    shadowColor: '#62FF96',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 18,
  },
  secondaryEnergyBeam: {
    position: 'absolute',
    bottom: 30,
    width: 100,
    height: 140,
    backgroundColor: 'rgba(56, 189, 248, 0.14)',
    borderRadius: 50,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
  },
  substationNode: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(98, 255, 150, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(98, 255, 150, 0.5)',
  },
  nodeCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#62FF96',
    shadowColor: '#62FF96',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  nodeCoreCyan: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  nodeLeft: {
    top: '32%',
    left: '18%',
  },
  nodeCenter: {
    top: '55%',
    left: '52%',
  },
  nodeRight: {
    top: '28%',
    right: '16%',
  },
  circuitMesh: {
    ...StyleSheet.absoluteFill,
    opacity: 0.08,
  },
  circuitLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#62FF96',
  },
});

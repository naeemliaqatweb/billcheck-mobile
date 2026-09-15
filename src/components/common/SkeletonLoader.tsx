import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

interface SkeletonLoaderProps {
  /** Whether to render a dark‑mode styled placeholder. */
  darkMode?: boolean;
}

/**
 * Simple skeleton placeholder used while telemetry data is loading.
 * It displays a shimmering gray block that mimics the size of the main
 * analytics chart. The implementation avoids external dependencies and
 * works on both Android and iOS.
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ darkMode = false }) => {
  const shimmerValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animate = () => {
      shimmerValue.setValue(0);
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => animate());
    };
    animate();
    // cleanup not needed as animation loops for the component lifetime
  }, [shimmerValue]);

  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <Animated.View
        style={[styles.shimmer, { transform: [{ translateX }] }]}>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0e0e0',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
  },
  containerDark: {
    backgroundColor: '#444',
  },
  shimmer: {
    width: 100,
    height: '100%',
    backgroundColor: '#ffffff55',
  },
});

import React from 'react';
import { View, Text } from 'react-native';

interface IconRenderProps {
  s: number;
  stroke: number;
  color: string;
}

export const renderUtilityIcon = (name: string, { s, stroke, color }: IconRenderProps): React.ReactNode | null => {
  switch (name) {
    // ── Stats / Bar Chart ──
    case 'stats': {
      const barW = Math.round(s * 0.18);
      return (
        <View
          style={{
            width: s,
            height: s,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: Math.round(s * 0.1),
            gap: Math.round(s * 0.1),
          }}
        >
          <View style={{ width: barW, height: Math.round(s * 0.42), backgroundColor: color, borderRadius: 2 }} />
          <View style={{ width: barW, height: Math.round(s * 0.8), backgroundColor: color, borderRadius: 2 }} />
          <View style={{ width: barW, height: Math.round(s * 0.6), backgroundColor: color, borderRadius: 2 }} />
        </View>
      );
    }

    // ── Bolt / Electricity ──
    case 'bolt':
    case 'zap':
    case 'flash': {
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              color: color,
              fontSize: Math.round(s * 1.05),
              lineHeight: Math.round(s * 1.15),
              textAlign: 'center',
              includeFontPadding: false,
              fontWeight: '900',
            }}
          >
            ⚡
          </Text>
        </View>
      );
    }

    // ── Flame / Gas ──
    case 'flame': {
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              color: color,
              fontSize: Math.round(s * 1.05),
              lineHeight: Math.round(s * 1.15),
              textAlign: 'center',
              includeFontPadding: false,
            }}
          >
            🔥
          </Text>
        </View>
      );
    }

    // ── Receipt / Document ──
    case 'receipt':
    case 'document': {
      const docW = Math.round(s * 0.58);
      const docH = Math.round(s * 0.75);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: docW,
              height: docH,
              borderRadius: 3,
              borderWidth: stroke,
              borderColor: color,
              padding: 3,
              justifyContent: 'space-around',
            }}
          >
            <View style={{ width: '80%', height: stroke, backgroundColor: color, borderRadius: 1 }} />
            <View style={{ width: '60%', height: stroke, backgroundColor: color, borderRadius: 1 }} />
            <View style={{ width: '90%', height: stroke, backgroundColor: color, borderRadius: 1 }} />
          </View>
        </View>
      );
    }

    // ── Globe ──
    case 'globe': {
      const globeSize = Math.round(s * 0.72);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: globeSize,
              height: globeSize,
              borderRadius: globeSize / 2,
              borderWidth: stroke,
              borderColor: color,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View style={{ width: '100%', height: stroke, backgroundColor: color }} />
            <View
              style={{
                position: 'absolute',
                width: Math.round(globeSize * 0.45),
                height: '100%',
                borderRadius: globeSize / 2,
                borderWidth: stroke,
                borderColor: color,
              }}
            />
          </View>
        </View>
      );
    }

    // ── Speedometer / Meter ──
    case 'speedometer':
    case 'meter': {
      const dial = Math.round(s * 0.72);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: dial,
              height: dial / 2,
              borderTopLeftRadius: dial / 2,
              borderTopRightRadius: dial / 2,
              borderWidth: stroke,
              borderBottomWidth: 0,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <View
              style={{
                width: stroke,
                height: Math.round(dial * 0.38),
                backgroundColor: color,
                transform: [{ rotate: '40deg' }, { translateY: -Math.round(dial * 0.08) }],
                borderRadius: 1,
              }}
            />
          </View>
          <View style={{ width: Math.round(dial * 0.9), height: stroke, backgroundColor: color, borderRadius: 1 }} />
        </View>
      );
    }

    default:
      return null;
  }
};

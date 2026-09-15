import React from 'react';
import { View, Text } from 'react-native';

interface IconRenderProps {
  s: number;
  stroke: number;
  color: string;
}

export const renderStatusIcon = (name: string, { s, stroke, color }: IconRenderProps): React.ReactNode | null => {
  switch (name) {
    // ── Check (Checkmark) ──
    case 'check': {
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: Math.round(s * 0.32),
              height: Math.round(s * 0.6),
              borderBottomWidth: stroke + 0.5,
              borderRightWidth: stroke + 0.5,
              borderColor: color,
              borderRadius: 1,
              transform: [{ rotate: '45deg' }, { translateY: -s * 0.1 }],
            }}
          />
        </View>
      );
    }

    // ── Star (★) ──
    case 'star': {
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              color: color,
              fontSize: s,
              lineHeight: s,
              textAlign: 'center',
              includeFontPadding: false,
            }}
          >
            ★
          </Text>
        </View>
      );
    }

    // ── Person / User ──
    case 'person': {
      const head = Math.round(s * 0.35);
      const bodyW = Math.round(s * 0.65);
      const bodyH = Math.round(s * 0.35);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: head,
              height: head,
              borderRadius: head / 2,
              borderWidth: stroke,
              borderColor: color,
              marginBottom: 2,
            }}
          />
          <View
            style={{
              width: bodyW,
              height: bodyH,
              borderTopLeftRadius: bodyW / 2,
              borderTopRightRadius: bodyW / 2,
              borderWidth: stroke,
              borderBottomWidth: 0,
              borderColor: color,
            }}
          />
        </View>
      );
    }

    // ── Lock ──
    case 'lock': {
      const shackleW = Math.round(s * 0.4);
      const shackleH = Math.round(s * 0.38);
      const bodyW = Math.round(s * 0.6);
      const bodyH = Math.round(s * 0.45);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: shackleW,
              height: shackleH,
              borderTopLeftRadius: shackleW / 2,
              borderTopRightRadius: shackleW / 2,
              borderWidth: stroke,
              borderBottomWidth: 0,
              borderColor: color,
              marginBottom: -1,
            }}
          />
          <View
            style={{
              width: bodyW,
              height: bodyH,
              borderRadius: 3,
              borderWidth: stroke,
              borderColor: color,
            }}
          />
        </View>
      );
    }

    // ── Moon ──
    case 'moon': {
      const moonSize = Math.round(s * 0.68);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: moonSize,
              height: moonSize,
              borderRadius: moonSize / 2,
              borderWidth: stroke + 0.5,
              borderRightColor: color,
              borderTopColor: color,
              borderLeftColor: 'transparent',
              borderBottomColor: 'transparent',
              transform: [{ rotate: '-35deg' }],
            }}
          />
        </View>
      );
    }

    // ── Shield ──
    case 'shield': {
      const shW = Math.round(s * 0.65);
      const shH = Math.round(s * 0.72);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: shW,
              height: shH,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
              borderBottomLeftRadius: shW / 2,
              borderBottomRightRadius: shW / 2,
              borderWidth: stroke,
              borderColor: color,
            }}
          />
        </View>
      );
    }

    // ── Bell (Notification) ──
    case 'bell': {
      const bellW = Math.round(s * 0.58);
      const bellH = Math.round(s * 0.55);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: bellW,
              height: bellH,
              borderTopLeftRadius: bellW / 2,
              borderTopRightRadius: bellW / 2,
              borderWidth: stroke,
              borderColor: color,
            }}
          />
          <View style={{ width: Math.round(s * 0.72), height: stroke, backgroundColor: color, borderRadius: 1 }} />
          <View
            style={{
              width: Math.round(s * 0.2),
              height: Math.round(s * 0.12),
              backgroundColor: color,
              borderRadius: 2,
              marginTop: 1,
            }}
          />
        </View>
      );
    }

    // ── Alert (Warning) ──
    case 'alert': {
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              color: color,
              fontSize: Math.round(s * 0.9),
              lineHeight: s,
              textAlign: 'center',
              includeFontPadding: false,
              fontWeight: '900',
            }}
          >
            ⚠
          </Text>
        </View>
      );
    }

    // ── Info (i in circle) ──
    case 'info': {
      const ring = Math.round(s * 0.75);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: ring,
              height: ring,
              borderRadius: ring / 2,
              borderWidth: stroke,
              borderColor: color,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View style={{ width: stroke, height: stroke, borderRadius: stroke / 2, backgroundColor: color, marginBottom: 2 }} />
            <View style={{ width: stroke, height: Math.round(ring * 0.35), backgroundColor: color, borderRadius: 1 }} />
          </View>
        </View>
      );
    }

    // ── Sparkles ──
    case 'sparkles': {
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              color: color,
              fontSize: Math.round(s * 0.9),
              lineHeight: s,
              textAlign: 'center',
              includeFontPadding: false,
            }}
          >
            ✦
          </Text>
        </View>
      );
    }

    default:
      return null;
  }
};

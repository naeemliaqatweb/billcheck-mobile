import React from 'react';
import { View } from 'react-native';

interface IconRenderProps {
  s: number;
  stroke: number;
  color: string;
}

export const renderActionIcon = (name: string, { s, stroke, color }: IconRenderProps): React.ReactNode | null => {
  switch (name) {
    // ── Plus / Add (+) ──
    case 'add':
    case 'plus': {
      const lineL = Math.round(s * 0.78);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              position: 'absolute',
              width: lineL,
              height: stroke + 0.5,
              backgroundColor: color,
              borderRadius: stroke / 2,
            }}
          />
          <View
            style={{
              position: 'absolute',
              height: lineL,
              width: stroke + 0.5,
              backgroundColor: color,
              borderRadius: stroke / 2,
            }}
          />
        </View>
      );
    }

    // ── Trash (Bin) ──
    case 'trash':
    case 'delete': {
      const bodyW = Math.round(s * 0.55);
      const bodyH = Math.round(s * 0.6);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: Math.round(s * 0.7),
              height: stroke,
              backgroundColor: color,
              borderRadius: 1,
              marginBottom: 2,
            }}
          />
          <View
            style={{
              width: bodyW,
              height: bodyH,
              borderWidth: stroke,
              borderTopWidth: 0,
              borderColor: color,
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View style={{ width: stroke, height: Math.round(bodyH * 0.55), backgroundColor: color, borderRadius: 1 }} />
          </View>
        </View>
      );
    }

    // ── Share (Export) ──
    case 'share': {
      const boxW = Math.round(s * 0.6);
      const boxH = Math.round(s * 0.45);
      const arrow = Math.round(s * 0.28);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: arrow,
              height: arrow,
              borderTopWidth: stroke,
              borderLeftWidth: stroke,
              borderColor: color,
              borderRadius: 1,
              transform: [{ rotate: '45deg' }, { translateY: s * 0.05 }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: stroke,
              height: Math.round(s * 0.4),
              backgroundColor: color,
              borderRadius: 1,
              top: Math.round(s * 0.15),
            }}
          />
          <View
            style={{
              width: boxW,
              height: boxH,
              borderWidth: stroke,
              borderTopWidth: 0,
              borderColor: color,
              borderBottomLeftRadius: 3,
              borderBottomRightRadius: 3,
              marginTop: Math.round(s * 0.1),
            }}
          />
        </View>
      );
    }

    // ── Copy (Sheets) ──
    case 'copy': {
      const sheet = Math.round(s * 0.52);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              position: 'absolute',
              top: s * 0.12,
              left: s * 0.12,
              width: sheet,
              height: sheet,
              borderRadius: 3,
              borderWidth: stroke,
              borderColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: s * 0.12,
              right: s * 0.12,
              width: sheet,
              height: sheet,
              borderRadius: 3,
              borderWidth: stroke,
              borderColor: color,
              backgroundColor: 'transparent',
            }}
          />
        </View>
      );
    }

    // ── Official / Business / Building ──
    case 'official':
    case 'business': {
      const bW = Math.round(s * 0.7);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: bW / 2,
              borderRightWidth: bW / 2,
              borderBottomWidth: Math.round(s * 0.22),
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
            }}
          />
          <View
            style={{
              width: bW,
              height: Math.round(s * 0.36),
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginVertical: 1,
            }}
          >
            <View style={{ width: stroke, height: '100%', backgroundColor: color }} />
            <View style={{ width: stroke, height: '100%', backgroundColor: color }} />
            <View style={{ width: stroke, height: '100%', backgroundColor: color }} />
          </View>
          <View style={{ width: bW + 2, height: stroke, backgroundColor: color, borderRadius: 1 }} />
        </View>
      );
    }

    default:
      return null;
  }
};

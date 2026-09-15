import React from 'react';
import { View, Text } from 'react-native';

interface IconRenderProps {
  s: number;
  stroke: number;
  color: string;
}

export const renderNavIcon = (name: string, { s, stroke, color }: IconRenderProps): React.ReactNode | null => {
  switch (name) {
    // ── Search (Magnifying Glass) ──
    case 'search': {
      const ring = Math.round(s * 0.62);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: ring,
              height: ring,
              borderRadius: ring / 2,
              borderWidth: stroke,
              borderColor: color,
              transform: [{ translateX: -s * 0.08 }, { translateY: -s * 0.08 }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: Math.round(s * 0.38),
              height: stroke,
              backgroundColor: color,
              borderRadius: stroke / 2,
              bottom: Math.round(s * 0.12),
              right: Math.round(s * 0.1),
              transform: [{ rotate: '45deg' }],
            }}
          />
        </View>
      );
    }

    // ── Close / Cancel (X) ──
    case 'close': {
      const lineW = Math.round(s * 0.72);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              position: 'absolute',
              width: lineW,
              height: stroke,
              backgroundColor: color,
              borderRadius: stroke / 2,
              transform: [{ rotate: '45deg' }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: lineW,
              height: stroke,
              backgroundColor: color,
              borderRadius: stroke / 2,
              transform: [{ rotate: '-45deg' }],
            }}
          />
        </View>
      );
    }

    // ── Chevron Right (›) ──
    case 'chevron-right':
    case 'chevron-forward': {
      const arm = Math.round(s * 0.4);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: arm,
              height: arm,
              borderTopWidth: stroke,
              borderRightWidth: stroke,
              borderColor: color,
              borderRadius: 1,
              transform: [{ rotate: '45deg' }, { translateX: -arm * 0.2 }],
            }}
          />
        </View>
      );
    }

    // ── Chevron Down (▾) ──
    case 'chevron-down': {
      const arm = Math.round(s * 0.38);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: arm,
              height: arm,
              borderBottomWidth: stroke,
              borderRightWidth: stroke,
              borderColor: color,
              borderRadius: 1,
              transform: [{ rotate: '45deg' }, { translateY: -arm * 0.2 }],
            }}
          />
        </View>
      );
    }

    // ── Chevron Up (▴) ──
    case 'chevron-up': {
      const arm = Math.round(s * 0.38);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: arm,
              height: arm,
              borderTopWidth: stroke,
              borderLeftWidth: stroke,
              borderColor: color,
              borderRadius: 1,
              transform: [{ rotate: '45deg' }, { translateY: arm * 0.2 }],
            }}
          />
        </View>
      );
    }

    // ── Back Arrow (←) ──
    case 'back': {
      const arm = Math.round(s * 0.36);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              position: 'absolute',
              left: Math.round(s * 0.15),
              width: arm,
              height: arm,
              borderTopWidth: stroke,
              borderLeftWidth: stroke,
              borderColor: color,
              borderRadius: 1,
              transform: [{ rotate: '-45deg' }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: Math.round(s * 0.65),
              height: stroke,
              backgroundColor: color,
              borderRadius: stroke / 2,
              left: Math.round(s * 0.18),
            }}
          />
        </View>
      );
    }

    // ── Home ──
    case 'home': {
      const roofSize = Math.round(s * 0.44);
      const houseW = Math.round(s * 0.62);
      const houseH = Math.round(s * 0.42);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: roofSize,
              height: roofSize,
              borderTopWidth: stroke,
              borderLeftWidth: stroke,
              borderColor: color,
              borderRadius: 1.5,
              transform: [{ rotate: '45deg' }],
              marginBottom: -Math.round(roofSize * 0.32),
            }}
          />
          <View
            style={{
              width: houseW,
              height: houseH,
              borderWidth: stroke,
              borderTopWidth: 0,
              borderColor: color,
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <View
              style={{
                width: Math.max(2, Math.round(houseW * 0.28)),
                height: Math.round(houseH * 0.55),
                backgroundColor: color,
                borderTopLeftRadius: 1,
                borderTopRightRadius: 1,
              }}
            />
          </View>
        </View>
      );
    }

    // ── Settings (Authentic 8-Toothed Gear Cog) ──
    case 'settings': {
      const ringSize = Math.round(s * 0.6);
      const toothL = Math.max(3, Math.round(s * 0.22));
      const toothW = Math.max(2.5, stroke + 0.8);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ position: 'absolute', width: s, height: s, alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ width: toothW, height: toothL, backgroundColor: color, borderRadius: 1 }} />
            <View style={{ width: toothW, height: toothL, backgroundColor: color, borderRadius: 1 }} />
          </View>
          <View style={{ position: 'absolute', width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ position: 'absolute', left: 0, width: toothL, height: toothW, backgroundColor: color, borderRadius: 1 }} />
            <View style={{ position: 'absolute', right: 0, width: toothL, height: toothW, backgroundColor: color, borderRadius: 1 }} />
          </View>
          <View style={{ position: 'absolute', width: s, height: s, transform: [{ rotate: '45deg' }] }}>
            <View style={{ position: 'absolute', width: s, height: s, alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ width: toothW, height: toothL, backgroundColor: color, borderRadius: 1 }} />
              <View style={{ width: toothW, height: toothL, backgroundColor: color, borderRadius: 1 }} />
            </View>
            <View style={{ position: 'absolute', width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ position: 'absolute', left: 0, width: toothL, height: toothW, backgroundColor: color, borderRadius: 1 }} />
              <View style={{ position: 'absolute', right: 0, width: toothL, height: toothW, backgroundColor: color, borderRadius: 1 }} />
            </View>
          </View>
          <View
            style={{
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
              borderWidth: stroke + 1.2,
              borderColor: color,
              backgroundColor: 'transparent',
            }}
          />
        </View>
      );
    }

    // ── Calendar ──
    case 'calendar': {
      const calW = Math.round(s * 0.72);
      const calH = Math.round(s * 0.7);
      return (
        <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
          <View
            style={{
              width: calW,
              height: calH,
              borderRadius: 4,
              borderWidth: stroke,
              borderColor: color,
              overflow: 'hidden',
            }}
          >
            <View style={{ width: '100%', height: Math.round(calH * 0.35), backgroundColor: color }} />
          </View>
          <View style={{ position: 'absolute', top: s * 0.05, flexDirection: 'row', gap: calW * 0.38 }}>
            <View style={{ width: stroke, height: Math.round(s * 0.16), backgroundColor: color, borderRadius: 1 }} />
            <View style={{ width: stroke, height: Math.round(s * 0.16), backgroundColor: color, borderRadius: 1 }} />
          </View>
        </View>
      );
    }

    default:
      return null;
  }
};

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';
import { AppIcon } from '../AppIcon';
import { BillMonthHistory } from '../../types/bill';

interface DashboardTrendGraphProps {
  trendPercentage?: string;
  isUrdu?: boolean;
  trendLabel?: string;
  history?: BillMonthHistory[];
}

const URDU_MONTHS: Record<string, string> = {
  JAN: 'جنوری',
  FEB: 'فروری',
  MAR: 'مارچ',
  APR: 'اپریل',
  MAY: 'مئی',
  JUN: 'جون',
  JUL: 'جولائی',
  AUG: 'اگست',
  SEP: 'ستمبر',
  OCT: 'اکتوبر',
  NOV: 'نومبر',
  DEC: 'دسمبر',
};

const getMonthLabel = (mStr: string, isUrdu: boolean) => {
  if (!mStr) return '';
  const clean = mStr.trim().toUpperCase();
  for (const [key, urVal] of Object.entries(URDU_MONTHS)) {
    if (clean.startsWith(key)) {
      return isUrdu ? urVal : (key.charAt(0) + key.slice(1).toLowerCase());
    }
  }
  return mStr.slice(0, 3);
};

export const DashboardTrendGraph: React.FC<DashboardTrendGraphProps> = ({
  trendPercentage: propTrendPercentage,
  isUrdu = false,
  trendLabel,
  history,
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(310);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const drawAnim = useRef(new Animated.Value(0)).current;

  // Extract or build 6 latest months of data
  const data6 = useMemo(() => {
    if (history && history.length >= 6) {
      return history.slice(-6);
    }
    if (history && history.length > 0) {
      return history;
    }
    // Fallback dynamic 6 months relative to current date
    const SEASON_MUL = [0.38, 0.42, 0.55, 0.75, 0.95, 1.15, 1.20, 1.05, 0.85, 0.65, 0.45, 0.40];
    const MON_ABBR = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const now = new Date();
    const curM = now.getMonth();
    const curY = now.getFullYear();

    const slots: BillMonthHistory[] = [];
    for (let offset = 5; offset >= 0; offset--) {
      const d = new Date(curY, curM - offset, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      const isCur = offset === 0;
      const units = Math.max(50, Math.round(300 * SEASON_MUL[m]));
      const amount = Math.round(units * 40);
      slots.push({
        month: `${MON_ABBR[m]} ${String(y).slice(-2)}`,
        year: y,
        units,
        amount,
        status: isCur ? 'unpaid' : 'paid',
      });
    }
    return slots;
  }, [history]);

  // Smooth drawing animation when mounted or data updates
  useEffect(() => {
    drawAnim.setValue(0);
    Animated.timing(drawAnim, {
      toValue: 1,
      duration: 1300,
      easing: Easing.bezier(0.22, 1, 0.36, 1), // smooth natural easeOut
      useNativeDriver: false,
    }).start();
  }, [drawAnim, data6]);

  // Continuous pulse animation for latest point
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.4,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Calculate dynamic SVG coordinates
  const { linePath, areaPath, lastPoint } = useMemo(() => {
    if (!data6 || data6.length === 0) {
      return { linePath: '', areaPath: '', lastPoint: null };
    }

    const svgW = 310;
    const paddingX = 14;
    const usableW = svgW - paddingX * 2;
    const stepX = usableW / Math.max(1, data6.length - 1);

    const amounts = data6.map((d) => d.amount);
    const minAmount = Math.min(...amounts);
    const maxAmount = Math.max(...amounts);
    const range = maxAmount - minAmount || 1;

    const topY = 10;
    const bottomY = 40;
    const usableH = bottomY - topY;

    const pts = data6.map((item, idx) => {
      const x = paddingX + idx * stepX;
      const ratio = (item.amount - minAmount) / range;
      const y = bottomY - ratio * usableH;
      return { x, y, item, index: idx };
    });

    if (pts.length === 1) {
      const p = pts[0];
      return {
        linePath: `M ${p.x - 20} ${p.y} L ${p.x + 20} ${p.y}`,
        areaPath: `M ${p.x - 20} ${p.y} L ${p.x + 20} ${p.y} L ${p.x + 20} 50 L ${p.x - 20} 50 Z`,
        lastPoint: p,
      };
    }

    let dLine = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      dLine += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const first = pts[0];
    const last = pts[pts.length - 1];
    const dArea = `${dLine} L ${last.x} 50 L ${first.x} 50 Z`;

    return { linePath: dLine, areaPath: dArea, lastPoint: last };
  }, [data6]);

  // Calculate dynamic trend percentage vs previous month
  const { trendText, isUp } = useMemo(() => {
    if (propTrendPercentage) {
      return { trendText: propTrendPercentage, isUp: !propTrendPercentage.includes('-') };
    }
    if (data6.length >= 2) {
      const curr = data6[data6.length - 1];
      const prev = data6[data6.length - 2];
      const pct = prev.amount > 0 ? ((curr.amount - prev.amount) / prev.amount) * 100 : 0;
      const sign = pct >= 0 ? '+' : '';
      const prevMonthName = getMonthLabel(prev.month, isUrdu);
      const text = isUrdu
        ? `${sign}${pct.toFixed(1)}% بمقابلہ ${prevMonthName}`
        : `${sign}${pct.toFixed(1)}% vs ${prevMonthName}`;
      return { trendText: text, isUp: pct >= 0 };
    }
    return {
      trendText: isUrdu ? 'مستحکم' : 'Stable',
      isUp: true,
    };
  }, [propTrendPercentage, data6, isUrdu]);

  const displayLabel = trendLabel || (isUrdu ? '6 ماہ کا رجحان (روپے)' : '6-Month Trend (Rs.)');

  // Interpolated animated width for the mask reveal (0% -> 100%)
  const animatedWidth = drawAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, containerWidth || 310],
  });

  // End point pop-in animations
  const dotScale = drawAnim.interpolate({
    inputRange: [0, 0.75, 1],
    outputRange: [0, 0.3, 1],
  });

  const dotOpacity = drawAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0, 0.5, 1],
  });

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={[styles.headerRow, isUrdu && styles.rtlRow]}>
        <Text style={[styles.trendLabel, isUrdu && styles.rtlText]}>{displayLabel}</Text>
        <View style={styles.trendValueBadge}>
          <AppIcon name={isUp ? 'trending_up' : 'trending_down'} size={14} color="#3FFF8B" />
          <Text style={styles.trendValueText}>{trendText}</Text>
        </View>
      </View>

      {/* SVG Mini Glowing Trend Line with Smooth Drawing Animation */}
      <View
        style={styles.graphContainer}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0 && Math.abs(w - containerWidth) > 2) {
            setContainerWidth(w);
          }
        }}
      >
        {/* Animated Mask revealing graph from left to right */}
        <Animated.View style={[styles.animatedMask, { width: animatedWidth }]}>
          <View style={[styles.fixedSvgWrapper, { width: containerWidth || 310 }]}>
            <Svg
              width="100%"
              height={60}
              viewBox="0 0 310 50"
              preserveAspectRatio="none"
              style={styles.svg}
            >
              <Defs>
                <LinearGradient id="dashboardGlowGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#3FFF8B" stopOpacity="0.38" />
                  <Stop offset="60%" stopColor="#3FFF8B" stopOpacity="0.10" />
                  <Stop offset="100%" stopColor="#3FFF8B" stopOpacity="0.0" />
                </LinearGradient>
              </Defs>

              {/* Area fill under curve */}
              {areaPath ? <Path d={areaPath} fill="url(#dashboardGlowGrad)" /> : null}

              {/* Outer glow stroke */}
              {linePath ? (
                <Path
                  d={linePath}
                  fill="none"
                  stroke="rgba(63, 255, 139, 0.35)"
                  strokeWidth={5}
                />
              ) : null}

              {/* Core crisp line stroke */}
              {linePath ? (
                <Path
                  d={linePath}
                  fill="none"
                  stroke="#3FFF8B"
                  strokeWidth={2.5}
                />
              ) : null}

              {/* Halo circle & Solid Point Circle on latest point */}
              {lastPoint && (
                <>
                  <Circle
                    cx={lastPoint.x}
                    cy={lastPoint.y}
                    r={6}
                    fill="rgba(63, 255, 139, 0.3)"
                  />
                  <Circle
                    cx={lastPoint.x}
                    cy={lastPoint.y}
                    r={3.5}
                    fill="#3FFF8B"
                  />
                </>
              )}
            </Svg>
          </View>
        </Animated.View>

        {/* Pulsing indicator over latest point (pops in as line completes) */}
        {lastPoint && (
          <Animated.View
            style={[
              styles.pulseCircle,
              {
                left: Math.max(0, ((lastPoint.x / 310) * (containerWidth || 310)) - 5),
                top: Math.max(0, lastPoint.y - 5),
                opacity: dotOpacity,
                transform: [
                  { scale: Animated.multiply(pulseAnim, dotScale) },
                ],
              },
            ]}
          />
        )}
      </View>

      {/* Month indicators */}
      <View style={[styles.monthsRow, isUrdu && styles.rtlRow]}>
        {data6.map((m, i) => {
          const isLatest = i === data6.length - 1;
          const label = getMonthLabel(m.month, isUrdu);
          return (
            <Text
              key={i}
              style={[
                styles.monthText,
                isLatest && styles.monthTextActive,
              ]}
            >
              {label}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(116, 119, 125, 0.22)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  trendLabel: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#A7C8FF',
    letterSpacing: 0.2,
  },
  trendValueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(63, 255, 139, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  trendValueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#62FF96',
  },
  graphContainer: {
    width: '100%',
    height: 60,
    position: 'relative',
    marginVertical: 4,
    overflow: 'hidden',
  },
  animatedMask: {
    height: 60,
    overflow: 'hidden',
  },
  fixedSvgWrapper: {
    height: 60,
  },
  svg: {
    overflow: 'visible',
  },
  pulseCircle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(63, 255, 139, 0.5)',
  },
  monthsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 6,
  },
  monthText: {
    fontSize: 10.5,
    fontWeight: '500',
    color: '#778598',
  },
  monthTextActive: {
    color: '#62FF96',
    fontWeight: '800',
  },
  rtlText: {
    textAlign: 'right',
  },
});

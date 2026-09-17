import React, { useEffect, useRef, useMemo, useState } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';
import { AppIcon } from '../AppIcon';
import { BillMonthHistory } from '../../types/bill';
import { styles } from '../../styles/DashboardTrendGraph.styles';

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

  // Extract or build 6 latest months of data (ending at latest issued bill, August 2026)
  const data6 = useMemo(() => {
    const now = new Date();
    const curM = (now.getMonth() - 1 + 12) % 12; // August (index 7)
    const curY = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const maxTimestamp = curY * 12 + curM;

    const MON_MAP: Record<string, number> = {
      JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
      JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
    };

    if (history && history.length > 0) {
      // Deduplicate any repeated months and exclude future unissued months
      const seen = new Set<string>();
      const deduped: BillMonthHistory[] = [];
      for (let i = history.length - 1; i >= 0; i--) {
        const item = history[i];
        const key = (item.month || '').trim().toUpperCase();
        if (key && !seen.has(key)) {
          let year = item.year || curY;
          let monIndex = 0;
          const parts = key.split(/[\s\-_]+/);
          const mStr = parts[0] || '';
          const yStr = parts[1] || '';
          for (const [abbr, idx] of Object.entries(MON_MAP)) {
            if (mStr.startsWith(abbr)) {
              monIndex = idx;
              break;
            }
          }
          if (yStr) {
            const yNum = parseInt(yStr.length === 2 ? `20${yStr}` : yStr, 10);
            if (!isNaN(yNum) && yNum > 2000) year = yNum;
          }
          const timestamp = year * 12 + monIndex;
          if (timestamp <= maxTimestamp) {
            seen.add(key);
            deduped.unshift(item);
          }
        }
      }
      if (deduped.length >= 6) {
        return deduped.slice(-6);
      }
      if (deduped.length > 0) {
        return deduped;
      }
    }
    // Default 6 months ending at latest issued bill (August 2026) with zero amounts
    const MON_ABBR = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    const slots: BillMonthHistory[] = [];
    for (let offset = 5; offset >= 0; offset--) {
      const d = new Date(curY, curM - offset, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      slots.push({
        month: `${MON_ABBR[m]} ${String(y).slice(-2)}`,
        year: y,
        units: 0,
        amount: 0,
        status: 'paid',
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
  const { linePath, areaPath, lastPoint, isAllZero } = useMemo(() => {
    if (!data6 || data6.length === 0) {
      return { linePath: '', areaPath: '', lastPoint: null, isAllZero: true };
    }

    const svgW = 310;
    const paddingX = 14;
    const usableW = svgW - paddingX * 2;
    const stepX = usableW / Math.max(1, data6.length - 1);

    const amounts = data6.map((d) => d.amount);
    const minAmount = Math.min(...amounts);
    const maxAmount = Math.max(...amounts);
    const allZero = maxAmount === 0;

    if (allZero) {
      const pStart = { x: paddingX, y: 40 };
      const pEnd = { x: svgW - paddingX, y: 40 };
      return {
        linePath: `M ${pStart.x} ${pStart.y} L ${pEnd.x} ${pEnd.y}`,
        areaPath: '',
        lastPoint: null,
        isAllZero: true,
      };
    }

    const range = maxAmount - minAmount || 1;
    const topY = 10;
    const bottomY = 40;
    const usableH = bottomY - topY;

    const pts = data6.map((item, idx) => {
      // In Urdu (RTL), index 0 (oldest month) is on the right, index 5 (latest month) is on the left
      const x = isUrdu
        ? svgW - paddingX - idx * stepX
        : paddingX + idx * stepX;
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
        isAllZero: false,
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

    return { linePath: dLine, areaPath: dArea, lastPoint: last, isAllZero: false };
  }, [data6, isUrdu]);

  // Calculate dynamic trend percentage vs previous month
  const { trendText, isUp } = useMemo(() => {
    if (propTrendPercentage) {
      return { trendText: propTrendPercentage, isUp: !propTrendPercentage.includes('-') };
    }
    if (isAllZero || data6.every((d) => d.amount === 0)) {
      return {
        trendText: isUrdu ? '0 روپے • کوئی میٹر نہیں' : 'Rs. 0 • No Data',
        isUp: true,
      };
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
  }, [propTrendPercentage, data6, isUrdu, isAllZero]);

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
        {/* Animated Mask revealing graph (from left in LTR, from right in RTL) */}
        <Animated.View
          style={[
            styles.animatedMask,
            isUrdu ? styles.animatedMaskRTL : styles.animatedMaskLTR,
            { width: animatedWidth },
          ]}
        >
          <View
            style={[
              styles.fixedSvgWrapper,
              isUrdu && styles.fixedSvgWrapperRTL,
              { width: containerWidth || 310 },
            ]}
          >
            <Svg
              width="100%"
              height={60}
              viewBox="0 0 310 50"
              preserveAspectRatio="none"
              style={styles.svg}
            >
              <Defs>
                <LinearGradient id="dashboardGlowGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#62FF96" stopOpacity="0.70" />
                  <Stop offset="40%" stopColor="#3FFF8B" stopOpacity="0.40" />
                  <Stop offset="80%" stopColor="#059669" stopOpacity="0.18" />
                  <Stop offset="100%" stopColor="#0C2B4E" stopOpacity="0.0" />
                </LinearGradient>
              </Defs>

              {/* Area fill under curve with rich radiant green glow */}
              {!isAllZero && areaPath ? <Path d={areaPath} fill="url(#dashboardGlowGrad)" /> : null}

              {/* Outer glow stroke */}
              {!isAllZero && linePath ? (
                <Path
                  d={linePath}
                  fill="none"
                  stroke="rgba(98, 255, 150, 0.50)"
                  strokeWidth={6}
                />
              ) : null}

              {/* Core crisp line stroke */}
              {linePath ? (
                <Path
                  d={linePath}
                  fill="none"
                  stroke={isAllZero ? 'rgba(98, 255, 150, 0.35)' : '#62FF96'}
                  strokeWidth={isAllZero ? 1.5 : 3}
                  strokeDasharray={isAllZero ? '5 5' : undefined}
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


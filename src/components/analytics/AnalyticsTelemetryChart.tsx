import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
  Line,
  Circle,
} from 'react-native-svg';
import { BillMonthHistory } from '../../types/bill';
import { AppIcon } from '../AppIcon';

interface AnalyticsTelemetryChartProps {
  history: BillMonthHistory[];
  meterLabel?: string;
  utilityType?: 'electricity' | 'gas';
  darkMode?: boolean;
  language?: 'en' | 'ur';
}

export const AnalyticsTelemetryChart: React.FC<AnalyticsTelemetryChartProps> = ({
  history,
  meterLabel = 'LESCO # 08 11254 0938400 U',
  utilityType = 'electricity',
  darkMode = true,
  language = 'en',
}) => {
  const isUrdu = language === 'ur';
  const isGas = utilityType === 'gas';
  const unitLabel = isGas ? 'MMBTU' : 'kWh';

  // Default to selecting the latest month
  const [selectedIndex, setSelectedIndex] = useState<number>(
    history.length > 0 ? history.length - 1 : 0
  );

  // Sync selected index to last entry whenever history prop changes (e.g. meter switch)
  useEffect(() => {
    if (history.length > 0) {
      setSelectedIndex(history.length - 1);
    }
  }, [history]);

  const chartData = useMemo(() => {
    if (!history || history.length === 0) return [];
    return history.slice(-13); // Show up to 13 months (Aug 25 → Aug 26)
  }, [history]);

  const maxUnits = useMemo(() => {
    if (chartData.length === 0) return 100;
    const max = Math.max(...chartData.map((d) => d.units));
    return max > 0 ? max : 100;
  }, [chartData]);

  const selectedItem = chartData[selectedIndex] || chartData[chartData.length - 1] || {
    month: 'Nov 2024',
    units: 342,
    amount: 14320,
    status: 'paid',
  };

  // SVG dimensions
  const screenWidth = Dimensions.get('window').width;
  const svgWidth = Math.max(320, Math.min(360, screenWidth - 64));
  const svgHeight = 150;
  const paddingLeft = 14;
  const paddingRight = 14;
  const chartBottomY = 130;
  const chartTopY = 24;
  const usableHeight = chartBottomY - chartTopY;
  const usableWidth = svgWidth - paddingLeft - paddingRight;

  const barWidth = Math.max(8, Math.min(13, (usableWidth / Math.max(chartData.length, 12)) * 0.52));
  const stepX = usableWidth / Math.max(1, chartData.length - 1 || 1);

  // Compute points for bars and smooth trend curve
  const points = useMemo(() => {
    return chartData.map((item, index) => {
      const x = paddingLeft + (chartData.length > 1 ? index * stepX : usableWidth / 2);
      const ratio = item.units / maxUnits;
      const barH = Math.max(16, ratio * usableHeight);
      const y = chartBottomY - barH;
      return { x, y, barH, item, index };
    });
  }, [chartData, maxUnits, stepX, usableHeight, usableWidth, paddingLeft]);

  // Generate smooth cubic bezier SVG curve path
  const { linePath, areaPath } = useMemo(() => {
    if (points.length === 0) return { linePath: '', areaPath: '' };
    if (points.length === 1) {
      const p = points[0];
      return {
        linePath: `M ${p.x - 20} ${p.y} L ${p.x + 20} ${p.y}`,
        areaPath: `M ${p.x - 20} ${p.y} L ${p.x + 20} ${p.y} L ${p.x + 20} ${chartBottomY} L ${p.x - 20} ${chartBottomY} Z`,
      };
    }

    let dLine = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      dLine += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const first = points[0];
    const last = points[points.length - 1];
    const dArea = `${dLine} L ${last.x} ${chartBottomY} L ${first.x} ${chartBottomY} Z`;

    return { linePath: dLine, areaPath: dArea };
  }, [points, chartBottomY]);

  const activePoint = points[selectedIndex] || points[points.length - 1];

  // Split month string "AUG 25" into { mon: 'Aug', yr: "'25" }
  const getMonthParts = (mStr: string) => {
    if (!mStr) return { mon: '', yr: '' };
    const parts = mStr.trim().toUpperCase().split(' ');
    const raw = parts[0] || '';
    const mon = raw.charAt(0) + raw.slice(1).toLowerCase();
    const yr = parts[1] ? `'${parts[1].slice(-2)}` : '';
    return { mon, yr };
  };

  return (
    <View style={[styles.card, darkMode ? styles.cardDark : styles.cardLight]}>
      {/* Top Header Row */}
      <View style={styles.cardHeader}>
        <View style={styles.meterHeaderLeft}>
          <View style={styles.meterActiveDot} />
          <Text
            style={[styles.meterRefText, darkMode ? styles.darkText : styles.lightText]}
            numberOfLines={1}
          >
            {meterLabel}
          </Text>
        </View>

        <View style={styles.unitLegendRight}>
          <View style={styles.legendDash} />
          <Text style={[styles.unitLegendText, !darkMode && styles.unitLegendTextLight]}>
            Units ({unitLabel})
          </Text>
        </View>
      </View>

      {/* Selected Billing Cycle Glass Pill */}
      <View style={[styles.cycleGlassPill, darkMode ? styles.cycleGlassDark : styles.cycleGlassLight]}>
        <View style={styles.cycleLeft}>
          <View style={styles.cycleIconWrap}>
            <AppIcon name="insights" size={16} color="#62FF96" />
          </View>
          <View>
            <Text style={styles.cycleSubLabel}>
              {isUrdu ? 'منتخب شدہ بلنگ سائیکل' : 'Selected Billing Cycle'}
            </Text>
            <Text style={[styles.cycleMainLabel, darkMode ? styles.darkText : styles.lightText]}>
              {selectedItem.month}: {selectedItem.units} {unitLabel}
            </Text>
          </View>
        </View>

        <View style={styles.cycleRight}>
          <Text style={[styles.payableLabel, !darkMode && styles.payableLabelLight]}>
            {isUrdu ? 'قابل ادا' : 'Payable'}
          </Text>
          <Text style={[styles.payableValue, !darkMode && styles.payableValueLight]}>
            Rs. {selectedItem.amount.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* SVG Canvas Chart */}
      <View style={styles.chartSvgContainer}>
        <Svg width={svgWidth} height={svgHeight}>
          <Defs>
            {/* Area gradient under trend line */}
            <LinearGradient id="glowGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#3FFF8B" stopOpacity="0.35" />
              <Stop offset="100%" stopColor="#3FFF8B" stopOpacity="0.0" />
            </LinearGradient>

            {/* Standard Bar Gradient */}
            <LinearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#62FF96" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#006D35" stopOpacity="0.3" />
            </LinearGradient>

            {/* Active Selected Bar Gradient */}
            <LinearGradient id="activeBarGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#3FFF8B" stopOpacity="1" />
              <Stop offset="100%" stopColor="#00E475" stopOpacity="0.5" />
            </LinearGradient>
          </Defs>

          {/* Grid Guideline lines */}
          <Line x1="0" y1="30" x2={svgWidth} y2="30" stroke="#74777D" strokeDasharray="3,3" strokeOpacity="0.2" />
          <Line x1="0" y1="70" x2={svgWidth} y2="70" stroke="#74777D" strokeDasharray="3,3" strokeOpacity="0.2" />
          <Line x1="0" y1="110" x2={svgWidth} y2="110" stroke="#74777D" strokeDasharray="3,3" strokeOpacity="0.2" />

          {/* Render Bars */}
          {points.map((p) => {
            const isSelected = p.index === selectedIndex;
            return (
              <Rect
                key={`bar-${p.index}`}
                x={p.x - barWidth / 2}
                y={p.y}
                width={barWidth}
                height={p.barH}
                rx={3}
                fill={isSelected ? 'url(#activeBarGrad)' : 'url(#barGrad)'}
                opacity={isSelected ? 1 : 0.75}
              />
            );
          })}

          {/* Shaded Area Under Trend Line */}
          {areaPath ? <Path d={areaPath} fill="url(#glowGradient)" /> : null}

          {/* Curved Trend Line */}
          {linePath ? (
            <Path
              d={linePath}
              fill="none"
              stroke="#62FF96"
              strokeWidth={2.4}
            />
          ) : null}

          {/* Active Highlight Marker Pin */}
          {activePoint && (
            <>
              <Line
                x1={activePoint.x}
                y1={chartTopY - 8}
                x2={activePoint.x}
                y2={chartBottomY}
                stroke="#3FFF8B"
                strokeWidth={1.2}
                strokeDasharray="2,2"
                opacity={0.85}
              />
              <Circle
                cx={activePoint.x}
                cy={activePoint.y}
                r={5.5}
                fill="#FFFFFF"
                stroke="#00E475"
                strokeWidth={2.5}
              />
            </>
          )}
        </Svg>

        {/* Interactive Tap Zones over the bars */}
        <View style={styles.touchOverlay} pointerEvents="box-none">
          {points.map((p) => (
            <TouchableOpacity
              key={`touch-${p.index}`}
              style={[
                styles.touchZone,
                {
                  left: p.x - stepX / 2,
                  width: stepX,
                },
              ]}
              onPress={() => setSelectedIndex(p.index)}
              activeOpacity={0.7}
            />
          ))}
        </View>
      </View>

      {/* Month Labels Strip */}
      <View style={styles.monthLabelRow}>
        {chartData.map((item, idx) => {
          const isSelected = idx === selectedIndex;

          return (
            <TouchableOpacity
              key={`month-lbl-${idx}`}
              onPress={() => setSelectedIndex(idx)}
              activeOpacity={0.7}
              style={styles.monthCol}
            >
              {(() => {
                const { mon, yr } = getMonthParts(item.month);
                const isCurrentBill = item.status === 'unpaid';
                return (
                  <>
                    <Text
                      style={[
                        styles.monthText,
                        isSelected && (darkMode ? styles.monthTextSelected : styles.monthTextSelectedLight),
                        !isSelected && isCurrentBill && styles.monthTextCurrent,
                        !isSelected && !isCurrentBill && (darkMode ? styles.darkSub : styles.lightSub),
                      ]}
                    >
                      {mon}
                    </Text>
                    {yr ? (
                      <Text
                        style={[
                          styles.monthYearText,
                          isSelected && (darkMode ? styles.monthTextSelected : styles.monthTextSelectedLight),
                        ]}
                      >
                        {yr}
                      </Text>
                    ) : null}
                  </>
                );
              })()}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: '#001B3C',
    borderColor: 'rgba(0, 109, 53, 0.4)',
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D3E4FE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(116, 119, 125, 0.15)',
  },
  meterHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  meterActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3FFF8B',
    shadowColor: '#3FFF8B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  meterRefText: {
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  unitLegendRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDash: {
    width: 10,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#62FF96',
  },
  unitLegendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#62FF96',
  },
  cycleGlassPill: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  cycleGlassDark: {
    backgroundColor: 'rgba(15, 28, 44, 0.92)',
    borderColor: 'rgba(98, 255, 150, 0.45)',
  },
  cycleGlassLight: {
    backgroundColor: '#F8F9FF',
    borderColor: '#C4C6CC',
  },
  cycleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  cycleIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(63, 255, 139, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cycleSubLabel: {
    fontSize: 10,
    color: '#778598',
    fontWeight: '500',
  },
  cycleMainLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  cycleRight: {
    alignItems: 'flex-end',
  },
  payableLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#62FF96',
  },
  payableValue: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#62FF96',
  },
  chartSvgContainer: {
    height: 150,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  touchOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  touchZone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  monthLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  monthCol: {
    paddingVertical: 4,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 9.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  monthYearText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#778598',
    textAlign: 'center',
    marginTop: 1,
  },
  monthTextCurrent: {
    color: '#F59E0B',
    fontWeight: '700',
  },
  monthTextSelected: {
    color: '#3FFF8B',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  monthTextSelectedLight: {
    color: '#006D35',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  monthTextPeak: {
    color: '#62FF96',
    fontWeight: '700',
  },
  monthTextPeakLight: {
    color: '#006D35',
    fontWeight: '700',
  },
  darkText: {
    color: '#F8F9FF',
  },
  lightText: {
    color: '#0B1C30',
  },
  darkSub: {
    color: '#778598',
  },
  lightSub: {
    color: '#44474C',
  },
  payableLabelLight: {
    color: '#006D35',
  },
  payableValueLight: {
    color: '#006D35',
  },
  unitLegendTextLight: {
    color: '#006D35',
  },
});

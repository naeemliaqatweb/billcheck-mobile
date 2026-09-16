import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { BillMonthHistory } from '../types/bill';
import { AppIcon } from './AppIcon';

interface ConsumptionChartProps {
  history: BillMonthHistory[];
  darkMode?: boolean;
  language?: 'en' | 'ur';
}

export const ConsumptionChart: React.FC<ConsumptionChartProps> = ({
  history,
  darkMode = true,
  language = 'en',
}) => {
  const isUrdu = language === 'ur';
  const scrollRef = useRef<any>(null);
  const scrollOffsetX = useRef<number>(0);

  if (!history || history.length === 0) {
    return null;
  }

  // Reverse so the latest / newest month appears FIRST (leftmost)
  const displayData = [...history].reverse();
  const maxUnits = Math.max(...displayData.map((h) => h.units), 100);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffsetX.current = event.nativeEvent.contentOffset.x;
  };

  return (
    <View style={styles.container}>
      {/* Subtitle / Navigation Hint */}
      <View style={styles.hintRow}>
        <View style={styles.hintBadge}>
          <Text style={[styles.hintBadgeText, darkMode ? styles.hintBadgeTextDark : styles.hintBadgeTextLight]}>
            {isUrdu ? '★ تازہ ترین مہینہ پہلے' : '★ Latest Month First'}
          </Text>
        </View>
        <Text style={[styles.hintText, darkMode ? styles.darkSub : styles.lightSub]}>
          {isUrdu ? 'مزید مہینے دیکھنے کے لیے اسکرول کریں' : 'Scroll horizontally for older months'}
        </Text>
      </View>

      {/* Horizontally Scrollable Bar Chart */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chartScroll}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.chartContainer}>
          {displayData.map((item, index) => {
            const heightPercent = Math.max(16, Math.round((item.units / maxUnits) * 100));
            const isLatest = index === 0;
            const isPeakSummer = item.units > 300;

            const parts = item.month.split(' ');
            const rawMon = parts[0] || '';
            const rawYr = parts[1] || '26';
            const urduMonths: Record<string, string> = {
              JAN: 'جنوری', FEB: 'فروری', MAR: 'مارچ', APR: 'اپریل',
              MAY: 'مئی', JUN: 'جون', JUL: 'جولائی', AUG: 'اگست',
              SEP: 'ستمبر', OCT: 'اکتوبر', NOV: 'نومبر', DEC: 'دسمبر',
            };
            const monLabel = isUrdu ? (urduMonths[rawMon.toUpperCase()] || rawMon) : rawMon;

            return (
              <View key={`${item.month}-${index}`} style={styles.barColumn}>
                {/* Latest Tag Badge */}
                {isLatest ? (
                  <View style={[styles.latestTag, darkMode ? styles.latestTagDark : styles.latestTagLight]}>
                    <Text style={styles.latestTagText}>
                      {isUrdu ? 'تازہ' : 'Latest'}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.tagPlaceholder} />
                )}

                {/* Unit Value Label on top of bar */}
                <Text
                  style={[
                    styles.unitLabel,
                    isLatest
                      ? styles.latestUnitLabel
                      : darkMode
                      ? styles.darkSub
                      : styles.lightSub,
                  ]}
                >
                  {item.units}
                </Text>

                {/* Bar Track & Fill */}
                <View style={[styles.barTrack, darkMode ? styles.barTrackDark : styles.barTrackLight]}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${heightPercent}%` },
                      isLatest
                        ? styles.latestBar
                        : isPeakSummer
                        ? styles.peakSummerBar
                        : styles.regularBar,
                    ]}
                  />
                </View>

                {/* Month & Year Label */}
                <Text
                  style={[
                    styles.monthLabel,
                    isLatest
                      ? styles.latestMonthLabel
                      : darkMode
                      ? styles.darkMonth
                      : styles.lightMonth,
                  ]}
                  numberOfLines={1}
                >
                  {monLabel}
                </Text>
                <Text style={[styles.yearLabel, darkMode ? styles.darkSub : styles.lightSub]}>
                  &apos;{rawYr}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={[styles.legendText, darkMode ? styles.darkSub : styles.lightSub]}>
            {isUrdu ? 'موجودہ / تازہ ترین' : 'Current / Latest'}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
          <Text style={[styles.legendText, darkMode ? styles.darkSub : styles.lightSub]}>
            {isUrdu ? 'پیک (300+)' : 'Peak (>300)'}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#38BDF8' }]} />
          <Text style={[styles.legendText, darkMode ? styles.darkSub : styles.lightSub]}>
            {isUrdu ? 'معمول' : 'Normal'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(119, 133, 152, 0.15)',
  },
  hintBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hintBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  hintBadgeTextDark: {
    color: '#62FF96',
  },
  hintBadgeTextLight: {
    color: '#047857',
  },
  hintText: {
    fontSize: 10,
    fontWeight: '500',
  },
  chartScroll: {
    paddingRight: 14,
    paddingLeft: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 145,
    paddingTop: 8,
    paddingBottom: 2,
    gap: 8,
  },
  barColumn: {
    width: 42,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  latestTag: {
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 3,
    marginBottom: 3,
  },
  latestTagDark: {
    backgroundColor: '#006D35',
  },
  latestTagLight: {
    backgroundColor: '#059669',
  },
  latestTagText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  tagPlaceholder: {
    height: 15,
  },
  unitLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  latestUnitLabel: {
    color: '#10B981',
    fontWeight: '900',
  },
  barTrack: {
    width: 16,
    height: 82,
    justifyContent: 'flex-end',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barTrackLight: {
    backgroundColor: '#E2E8F0',
  },
  barTrackDark: {
    backgroundColor: '#070E17',
  },
  barFill: {
    width: '100%',
    borderRadius: 5,
  },
  regularBar: {
    backgroundColor: '#38BDF8',
  },
  peakSummerBar: {
    backgroundColor: '#EF4444',
  },
  latestBar: {
    backgroundColor: '#10B981',
  },
  monthLabel: {
    fontSize: 10,
    marginTop: 5,
    fontWeight: '700',
  },
  latestMonthLabel: {
    color: '#10B981',
    fontWeight: '900',
  },
  yearLabel: {
    fontSize: 8.5,
    fontWeight: '600',
  },
  darkMonth: {
    color: '#CBD5E1',
  },
  lightMonth: {
    color: '#1E293B',
  },
  darkSub: {
    color: '#94A3B8',
  },
  lightSub: {
    color: '#334155',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(119, 133, 152, 0.15)',
    paddingTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '600',
  },
});


import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { BillMonthHistory } from '../types/bill';
import { styles } from '../styles/ConsumptionChart.styles';

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



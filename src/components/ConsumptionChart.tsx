import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

  if (!history || history.length === 0) {
    return null;
  }

  const maxUnits = Math.max(...history.map((h) => h.units), 100);

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <AppIcon name="stats" size={16} color="#006D35" />
          <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText]}>
            {isUrdu ? 'ماہانہ بجلی کا استعمال (kWh)' : '12-Month Consumption Trend'}
          </Text>
        </View>
        <View style={styles.unitBadge}>
          <Text style={styles.unitBadgeText}>kWh</Text>
        </View>
      </View>

      {/* Horizontally Scrollable Bar Chart */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chartScroll}>
        <View style={styles.chartContainer}>
          {history.map((item, index) => {
            const heightPercent = Math.max(16, Math.round((item.units / maxUnits) * 100));
            const isLatest = index === history.length - 1;
            const isPeakSummer = item.units > 300;

            return (
              <View key={item.month} style={styles.barColumn}>
                {/* Unit Value Label on top of bar */}
                <Text style={[styles.unitLabel, isLatest ? styles.latestUnitLabel : (darkMode ? styles.darkSub : styles.lightSub)]}>
                  {item.units}
                </Text>

                {/* Bar */}
                <View style={[styles.barTrack, darkMode ? styles.barTrackDark : styles.barTrackLight]}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${heightPercent}%` },
                      isLatest ? styles.latestBar : (isPeakSummer ? styles.peakSummerBar : styles.regularBar),
                    ]}
                  />
                </View>

                {/* Month Label */}
                <Text style={[styles.monthLabel, isLatest ? styles.latestMonthLabel : (darkMode ? styles.darkMonth : styles.lightMonth)]}>
                  {item.month.split(' ')[0]}
                </Text>
                <Text style={[styles.yearLabel, darkMode ? styles.darkSub : styles.lightSub]}>
                  &apos;{item.month.split(' ')[1] || '24'}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#62FF96' }]} />
          <Text style={[styles.legendText, darkMode ? styles.darkSub : styles.lightSub]}>
            {isUrdu ? 'موجودہ بل' : 'Current'}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
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
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  darkContainer: {
    backgroundColor: '#132033',
    borderColor: '#24354D',
  },
  lightContainer: {
    backgroundColor: '#F8F9FF',
    borderColor: '#D3E4FE',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
  },
  darkText: {
    color: '#F8F9FF',
  },
  lightText: {
    color: '#0B1C30',
  },
  unitBadge: {
    backgroundColor: '#0F1C2C',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unitBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#62FF96',
  },
  chartScroll: {
    paddingRight: 10,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 135,
    paddingTop: 12,
    paddingBottom: 2,
    gap: 7,
  },
  barColumn: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  unitLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 4,
  },
  latestUnitLabel: {
    color: '#62FF96',
    fontWeight: '900',
  },
  barTrack: {
    width: 14,
    height: 80,
    justifyContent: 'flex-end',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barTrackLight: {
    backgroundColor: '#DCE9FF',
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
    backgroundColor: '#FF6B6B',
  },
  latestBar: {
    backgroundColor: '#62FF96',
  },
  monthLabel: {
    fontSize: 9.5,
    marginTop: 5,
    fontWeight: '700',
  },
  latestMonthLabel: {
    color: '#62FF96',
    fontWeight: '900',
  },
  yearLabel: {
    fontSize: 8,
    fontWeight: '500',
  },
  darkMonth: {
    color: '#94A3B8',
  },
  lightMonth: {
    color: '#64748B',
  },
  darkSub: {
    color: '#778598',
  },
  lightSub: {
    color: '#778598',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(119, 133, 152, 0.2)',
    paddingTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

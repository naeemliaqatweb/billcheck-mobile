import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BillMonthHistory } from '../types/bill';

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
        <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText, isUrdu && styles.rtlText]}>
          📊 {isUrdu ? '12 ماہ کا کنزمپشن گراف' : '12-Month Consumption Graph'}
        </Text>
        <Text style={styles.unitBadge}>Units (kWh)</Text>
      </View>

      {/* Horizontally Scrollable Bar Chart to fit all 12 months cleanly */}
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
                <View style={styles.barTrack}>
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
                  &apos;{item.month.split(' ')[1]}
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
            {isUrdu ? 'موجودہ مہینہ' : 'Current'}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
          <Text style={[styles.legendText, darkMode ? styles.darkSub : styles.lightSub]}>
            {isUrdu ? 'پیک سمر (300+)' : 'Peak Summer'}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={[styles.legendText, darkMode ? styles.darkSub : styles.lightSub]}>
            {isUrdu ? 'نارمل' : 'Standard'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
  },
  darkContainer: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
  },
  darkText: {
    color: '#F8FAFC',
  },
  lightText: {
    color: '#0F172A',
  },
  unitBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  chartScroll: {
    paddingRight: 10,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: 16,
    paddingBottom: 4,
    gap: 8,
  },
  barColumn: {
    width: 38,
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
    color: '#10B981',
    fontWeight: '900',
  },
  barTrack: {
    width: 18,
    height: 90,
    justifyContent: 'flex-end',
    borderRadius: 6,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  regularBar: {
    backgroundColor: '#3B82F6',
  },
  peakSummerBar: {
    backgroundColor: '#EF4444',
  },
  latestBar: {
    backgroundColor: '#10B981',
  },
  monthLabel: {
    fontSize: 10,
    marginTop: 6,
    fontWeight: '600',
  },
  latestMonthLabel: {
    color: '#10B981',
    fontWeight: '800',
  },
  yearLabel: {
    fontSize: 8,
  },
  darkMonth: {
    color: '#94A3B8',
  },
  lightMonth: {
    color: '#64748B',
  },
  darkSub: {
    color: '#94A3B8',
  },
  lightSub: {
    color: '#64748B',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
    paddingTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
  },
  rtlText: {
    textAlign: 'right',
  },
});

import React from 'react';
import { View, Text } from 'react-native';
import { BillMonthHistory } from '../../types/bill';
import { Language } from '../../i18n/translations';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/HistoryScreen.styles';

interface ConsumptionMetricsGridProps {
  historyData: BillMonthHistory[];
  darkMode: boolean;
  language: Language;
}

export const ConsumptionMetricsGrid: React.FC<ConsumptionMetricsGridProps> = ({
  historyData,
  darkMode,
  language,
}) => {
  const isUrdu = language === 'ur';

  const hasHistory = historyData.length > 0;
  const lastMonth = hasHistory && historyData.length >= 2 ? historyData[historyData.length - 2] : null;
  const thisMonth = hasHistory ? historyData[historyData.length - 1] : null;

  const percentDiff =
    lastMonth && thisMonth && lastMonth.units > 0
      ? Math.round(((thisMonth.units - lastMonth.units) / lastMonth.units) * 100)
      : null;
  const isHigher = percentDiff !== null && percentDiff > 0;

  const totalUnits = historyData.reduce((acc, curr) => acc + curr.units, 0);
  const totalAmount = historyData.reduce((acc, curr) => acc + curr.amount, 0);
  const avgUnits = hasHistory ? Math.round(totalUnits / historyData.length) : 0;
  const maxMonth = hasHistory ? [...historyData].sort((a, b) => b.units - a.units)[0] : null;
  const minMonth = hasHistory ? [...historyData].sort((a, b) => a.units - b.units)[0] : null;

  return (
    <View>
      {/* 1. Monthly Diff & Average Usage */}
      <View style={styles.metricsGrid}>
        <View style={[styles.gridCard, darkMode ? styles.darkCard : styles.lightCard]}>
          <View style={styles.metricHeaderRow}>
            <Text
              style={[styles.gridCardLabel, darkMode ? styles.darkSub : styles.lightSub]}
              numberOfLines={1}
            >
              {isUrdu ? 'اس ماہ کا استعمال' : 'THIS MONTH'}
            </Text>
            {percentDiff !== null && (
              <View style={[styles.diffBadge, isHigher ? styles.higherBadge : styles.lowerBadge]}>
                <Text style={[styles.diffBadgeText, isHigher ? styles.higherText : styles.lowerText]}>
                  {isHigher ? `▲ +${percentDiff}%` : `▼ ${percentDiff}%`}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.gridCardVal, darkMode ? styles.darkText : styles.lightText]}>
            {thisMonth ? `${thisMonth.units} Units` : 'N/A'}
          </Text>
          <Text style={[styles.gridCardSub, darkMode ? styles.darkSub : styles.lightSub]}>
            {thisMonth ? `Rs. ${thisMonth.amount.toLocaleString()}` : ''} ({thisMonth?.month || ''})
          </Text>
        </View>

        <View style={[styles.gridCard, darkMode ? styles.darkCard : styles.lightCard]}>
          <Text
            style={[styles.gridCardLabel, darkMode ? styles.darkSub : styles.lightSub]}
            numberOfLines={1}
          >
            {isUrdu ? 'اوسط ماہانہ استعمال' : 'AVG MONTHLY USAGE'}
          </Text>
          <Text style={[styles.gridCardVal, { color: '#0284C7' }]}>
            {avgUnits} Units/mo
          </Text>
          <Text style={[styles.gridCardSub, darkMode ? styles.darkSub : styles.lightSub]}>
            {isUrdu
              ? `ماہانہ اوسط: Rs. ${Math.round(totalAmount / (historyData.length || 1)).toLocaleString()}`
              : `Avg: Rs. ${Math.round(totalAmount / (historyData.length || 1)).toLocaleString()}/mo`}
          </Text>
        </View>
      </View>

      {/* 2. Peak vs Lowest Month */}
      <View style={styles.metricsGrid}>
        <View style={[styles.gridCard, styles.peakCard]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <AppIcon name="flame" size={14} color="#EF4444" />
            <Text style={styles.peakLabel}>
              {isUrdu ? 'زیادہ ترین استعمال' : 'Peak Month'}
            </Text>
          </View>
          <Text style={styles.peakVal}>
            {maxMonth ? `${maxMonth.units} Units` : 'N/A'}
          </Text>
          <Text style={styles.peakSub}>
            {maxMonth ? `${maxMonth.month} • Rs. ${maxMonth.amount.toLocaleString()}` : ''}
          </Text>
        </View>

        <View style={[styles.gridCard, styles.lowestCard]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <AppIcon name="bolt" size={14} color="#059669" />
            <Text style={styles.lowestLabel}>
              {isUrdu ? 'کم ترین استعمال' : 'Lowest Month'}
            </Text>
          </View>
          <Text style={styles.lowestVal}>
            {minMonth ? `${minMonth.units} Units` : 'N/A'}
          </Text>
          <Text style={styles.lowestSub}>
            {minMonth ? `${minMonth.month} • Rs. ${minMonth.amount.toLocaleString()}` : ''}
          </Text>
        </View>
      </View>
    </View>
  );
};

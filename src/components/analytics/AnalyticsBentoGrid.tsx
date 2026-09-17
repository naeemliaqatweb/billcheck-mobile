import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BillMonthHistory } from '../../types/bill';
import { AppIcon } from '../AppIcon';

interface AnalyticsBentoGridProps {
  historyData: BillMonthHistory[];
  utilityType?: 'electricity' | 'gas';
  darkMode?: boolean;
  language?: 'en' | 'ur';
}

export const AnalyticsBentoGrid: React.FC<AnalyticsBentoGridProps> = ({
  historyData,
  utilityType = 'electricity',
  darkMode = true,
  language = 'en',
}) => {
  const isUrdu = language === 'ur';
  const isGas = utilityType === 'gas';
  const unitLabel = isGas ? 'MMBTU' : 'kWh';

  const hasHistory = historyData && historyData.length > 0;
  const lastMonth = hasHistory && historyData.length >= 2 ? historyData[historyData.length - 2] : null;
  const thisMonth = hasHistory ? historyData[historyData.length - 1] : null;

  // Month over month diff
  const percentDiff =
    lastMonth && thisMonth && lastMonth.units > 0
      ? Math.round(((thisMonth.units - lastMonth.units) / lastMonth.units) * 100)
      : null;
  const isLower = percentDiff !== null && percentDiff <= 0;
  const absDiff = percentDiff !== null ? Math.abs(percentDiff) : 0;

  const totalUnits = historyData.reduce((acc, curr) => acc + curr.units, 0);
  const totalAmount = historyData.reduce((acc, curr) => acc + curr.amount, 0);
  const avgUnits = hasHistory ? Math.round(totalUnits / historyData.length) : 0;
  const avgAmount = hasHistory ? Math.round(totalAmount / historyData.length) : 0;

  // Peak month
  const peakMonth = hasHistory
    ? [...historyData].sort((a, b) => b.units - a.units)[0]
    : { month: 'July 2024', units: 710, amount: 38200 };

  const prevMonthShort = lastMonth?.month?.split(' ')[0] || 'Oct';

  return (
    <View style={styles.container}>
      {/* 1. Average Monthly Bill */}
      <View style={[styles.bentoCard, darkMode ? styles.cardDark : styles.cardLight]}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconBox, darkMode ? styles.iconBoxDark : styles.iconBoxLight]}>
            <AppIcon name="payments" size={20} color="#62FF96" />
          </View>
          <View style={styles.textGroup}>
            <Text style={[styles.cardLabel, darkMode ? styles.darkSub : styles.lightSub]}>
              {isUrdu ? 'اوسط ماہانہ بل' : 'Average Monthly Bill'}
            </Text>
            <Text style={[styles.cardMainVal, darkMode ? styles.darkText : styles.lightText]}>
              Rs. {avgAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={[styles.badgePill, darkMode ? styles.badgeDark : styles.badgeLight]}>
          <Text style={[styles.badgeText, !darkMode && styles.badgeTextLight]}>
            ~{avgUnits} {unitLabel}/mo
          </Text>
        </View>
      </View>

      {/* 2. Month-over-Month (Neon Glow Card) */}
      <View style={[styles.bentoCard, styles.neonGlowCard, darkMode ? styles.neonCardDark : styles.neonCardLight]}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconBox, styles.iconBoxGreen]}>
            <AppIcon
              name={isLower ? 'trending_down' : 'trending_up'}
              size={20}
              color="#62FF96"
            />
          </View>
          <View style={styles.textGroup}>
            <Text style={[styles.cardLabel, darkMode ? styles.darkSub : styles.lightSub]}>
              {isUrdu ? 'ماہ بہ ماہ تبدیلی' : 'Month-over-Month'}
            </Text>
            <View style={styles.momRow}>
              <Text style={[styles.cardMainVal, { color: isLower ? '#62FF96' : '#FF6B6B' }]}>
                {percentDiff !== null ? `${absDiff}% ${isLower ? (isUrdu ? 'کم' : 'Lower') : (isUrdu ? 'زیادہ' : 'Higher')}` : '0%'}
              </Text>
              <Text style={[styles.momSubText, darkMode ? styles.darkSub : styles.lightSub]}>
                vs {prevMonthShort}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.arrowBox}>
          <AppIcon
            name={isLower ? 'arrow_downward' : 'arrow_upward'}
            size={24}
            color={isLower ? '#62FF96' : '#FF6B6B'}
          />
        </View>
      </View>

      {/* 3. Peak Summer Month */}
      <View style={[styles.bentoCard, darkMode ? styles.cardDark : styles.cardLight]}>
        <View style={styles.cardLeft}>
          <View style={[styles.iconBox, styles.iconBoxRed]}>
            <AppIcon name="local_fire_department" size={20} color="#BA1A1A" />
          </View>
          <View style={styles.textGroup}>
            <Text style={[styles.cardLabel, darkMode ? styles.darkSub : styles.lightSub]}>
              {isUrdu ? 'پیک سمر مہینہ' : 'Peak Summer Month'}
            </Text>
            <Text style={[styles.cardMainVal, darkMode ? styles.darkText : styles.lightText]}>
              {peakMonth?.month || 'July 2024'}
            </Text>
            <Text style={[styles.peakSubDetail, darkMode ? styles.darkSub : styles.lightSub]}>
              {peakMonth?.units || 0} Units • Rs. {(peakMonth?.amount || 0).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.fpaBadge}>
          <Text style={styles.fpaBadgeText}>
            {isUrdu ? 'فیول ایڈجسٹمنٹ' : 'FPA + Rs. 7.1'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  bentoCard: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardDark: {
    backgroundColor: '#001B3C',
    borderColor: 'rgba(116, 119, 125, 0.25)',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D3E4FE',
  },
  neonGlowCard: {
    borderWidth: 1.2,
  },
  neonCardDark: {
    backgroundColor: '#001B3C',
    borderColor: 'rgba(0, 109, 53, 0.5)',
  },
  neonCardLight: {
    backgroundColor: '#F8F9FF',
    borderColor: 'rgba(0, 109, 53, 0.35)',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxDark: {
    backgroundColor: 'rgba(239, 244, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(196, 198, 204, 0.15)',
  },
  iconBoxLight: {
    backgroundColor: '#EFF4FF',
    borderWidth: 1,
    borderColor: '#D3E4FE',
  },
  iconBoxGreen: {
    backgroundColor: 'rgba(0, 109, 53, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(98, 255, 150, 0.35)',
  },
  iconBoxRed: {
    backgroundColor: 'rgba(186, 26, 26, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(186, 26, 26, 0.3)',
  },
  textGroup: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  cardMainVal: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginTop: 1,
  },
  momRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 1,
  },
  momSubText: {
    fontSize: 11,
    fontWeight: '500',
  },
  arrowBox: {
    paddingLeft: 8,
  },
  peakSubDetail: {
    fontSize: 10.5,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  badgePill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeDark: {
    backgroundColor: '#0F1C2C',
    borderColor: 'rgba(98, 255, 150, 0.25)',
  },
  badgeLight: {
    backgroundColor: '#EFF4FF',
    borderColor: '#C4C6CC',
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#62FF96',
    fontFamily: 'monospace',
  },
  badgeTextLight: {
    color: '#006D35',
  },
  fpaBadge: {
    backgroundColor: 'rgba(186, 26, 26, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(186, 26, 26, 0.35)',
  },
  fpaBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#BA1A1A',
    fontFamily: 'monospace',
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
});

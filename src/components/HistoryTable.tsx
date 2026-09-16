import React from 'react';
import { View, Text } from 'react-native';
import { BillMonthHistory } from '../types/bill';
import { AppIcon } from './AppIcon';
import { styles } from '../styles/HistoryTable.styles';

interface HistoryTableProps {
  history: BillMonthHistory[];
  darkMode?: boolean;
  language?: 'en' | 'ur';
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  history,
  darkMode = true,
  language = 'en',
}) => {
  const isUrdu = language === 'ur';

  if (!history || history.length === 0) {
    return null;
  }

  const total12Units = history.reduce((acc, h) => acc + h.units, 0);
  const total12Amount = history.reduce((acc, h) => acc + h.amount, 0);
  const avgAmount = Math.round(total12Amount / history.length);

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* Title */}
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <AppIcon name="calendar" size={16} color="#006D35" />
          <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText]}>
            {isUrdu ? '12 ماہ کا مکمل بل ریکارڈ' : '12-Month Billing Archive'}
          </Text>
        </View>
        <Text style={styles.badge12}>12 Months</Text>
      </View>

      {/* 12-Month Statistics Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, darkMode ? styles.darkStatBox : styles.lightStatBox]}>
          <Text style={[styles.statLabel, darkMode ? styles.darkSub : styles.lightSub]}>
            {isUrdu ? '12 ماہ کے کل یونٹس' : '12M Total Units'}
          </Text>
          <Text style={styles.statVal1}>{total12Units.toLocaleString()} kWh</Text>
        </View>

        <View style={[styles.statBox, darkMode ? styles.darkStatBox : styles.lightStatBox]}>
          <Text style={[styles.statLabel, darkMode ? styles.darkSub : styles.lightSub]}>
            {isUrdu ? 'ماہانہ اوسط خرچ' : 'Monthly Avg Bill'}
          </Text>
          <Text style={styles.statVal2}>Rs. {avgAmount.toLocaleString()}</Text>
        </View>
      </View>

      {/* Table Header */}
      <View style={[styles.tableHeader, darkMode ? styles.darkHeader : styles.lightHeader]}>
        <Text style={[styles.thText, { flex: 1.2 }, darkMode ? styles.darkTh : styles.lightTh]}>
          {isUrdu ? 'مہینہ' : 'MONTH'}
        </Text>
        <Text style={[styles.thText, { flex: 1.1, textAlign: 'center' }, darkMode ? styles.darkTh : styles.lightTh]}>
          {isUrdu ? 'یونٹس' : 'UNITS'}
        </Text>
        <Text style={[styles.thText, { flex: 1.4, textAlign: 'right' }, darkMode ? styles.darkTh : styles.lightTh]}>
          {isUrdu ? 'رقم (روپے)' : 'BILL (PKR)'}
        </Text>
        <Text style={[styles.thText, { flex: 1.1, textAlign: 'right' }, darkMode ? styles.darkTh : styles.lightTh]}>
          {isUrdu ? 'حالت' : 'STATUS'}
        </Text>
      </View>

      {/* Table Rows (Render in reverse so latest month is on top) */}
      {[...history].reverse().map((item, index) => {
        const isLatest = index === 0;
        const diff = item.unitsDiffPercentage || 0;
        const isUp = diff > 0;

        const parts = (item.month || '').trim().split(' ');
        const rawMon = parts[0] || '';
        const rawYr = parts[1] ? `'${parts[1]}` : "'26";
        const urduMonths: Record<string, string> = {
          JAN: 'جنوری', FEB: 'فروری', MAR: 'مارچ', APR: 'اپریل',
          MAY: 'مئی', JUN: 'جون', JUL: 'جولائی', AUG: 'اگست',
          SEP: 'ستمبر', OCT: 'اکتوبر', NOV: 'نومبر', DEC: 'دسمبر',
        };
        const displayMonth = isUrdu ? `${urduMonths[rawMon.toUpperCase()] || rawMon} ${rawYr}` : item.month;

        return (
          <View
            key={item.month}
            style={[
              styles.tableRow,
              index % 2 === 0
                ? (darkMode ? styles.evenDarkRow : styles.evenLightRow)
                : (darkMode ? styles.oddDarkRow : styles.oddLightRow),
              isLatest && (darkMode ? styles.latestDarkHighlight : styles.latestLightHighlight),
            ]}
          >
            {/* Month Column */}
            <View style={{ flex: 1.2 }}>
              <Text style={[styles.monthText, darkMode ? styles.darkText : styles.lightText, isLatest && styles.boldText]}>
                {displayMonth}
              </Text>
              {isLatest && (
                <Text style={styles.currentBadgeText}>
                  {isUrdu ? 'موجودہ' : 'Current'}
                </Text>
              )}
            </View>

            {/* Units Column with diff indicator */}
            <View style={{ flex: 1.1, alignItems: 'center' }}>
              <Text style={[styles.unitsText, darkMode ? styles.darkText : styles.lightText]}>
                {item.units}
              </Text>
              {diff !== 0 && (
                <Text style={[styles.diffText, isUp ? styles.diffUp : styles.diffDown]}>
                  {isUp ? `+${diff}%` : `${diff}%`}
                </Text>
              )}
            </View>

            {/* Amount Column */}
            <View style={{ flex: 1.4, alignItems: 'flex-end' }}>
              <Text style={[styles.amountText, darkMode ? styles.darkText : styles.lightText, isLatest && styles.boldAmount]}>
                Rs. {item.amount.toLocaleString()}
              </Text>
              {item.paymentDate && (
                <Text style={[styles.dateText, darkMode ? styles.darkSub : styles.lightSub]}>
                  {item.paymentDate.split(' ')[0]} {item.paymentDate.split(' ')[1]}
                </Text>
              )}
            </View>

            {/* Status Column */}
            <View style={{ flex: 1.1, alignItems: 'flex-end' }}>
              <View style={[styles.statusBadge, item.status === 'paid' ? styles.paidBadge : styles.unpaidBadge]}>
                <Text style={[styles.statusBadgeText, item.status === 'paid' ? styles.paidText : styles.unpaidText]}>
                  {item.status === 'paid' ? (isUrdu ? '✓ ادا' : '✓ PAID') : (isUrdu ? 'غیر ادا' : 'UNPAID')}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

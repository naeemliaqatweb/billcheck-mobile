import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BillData } from '../../types/bill';
import { AppIcon } from '../AppIcon';

interface NoticesCardProps {
  bill: BillData;
  darkMode: boolean;
  isUrdu: boolean;
}

export const NoticesCard: React.FC<NoticesCardProps> = ({ bill, darkMode, isUrdu }) => {
  if (!bill.fpaMessage && !bill.subsidyMessage) return null;

  return (
    <View style={styles.container}>
      {bill.fpaMessage && (
        <View style={[styles.noticeBox, darkMode ? styles.noticeBoxDark : styles.noticeBoxLight]}>
          <View style={styles.noticeHeaderRow}>
            <AppIcon name="bolt" size={15} color="#D97706" />
            <Text style={styles.noticeHeader}>{isUrdu ? 'فیول پرائس ایڈجسٹمنٹ (FPA)' : 'Fuel Price Adjustment'}</Text>
          </View>
          <Text style={[styles.noticeBody, darkMode ? styles.darkText : styles.lightText, isUrdu && styles.rtlText]}>
            {bill.fpaMessage}
          </Text>
        </View>
      )}

      {bill.subsidyMessage && (
        <View style={[styles.noticeBox, styles.subsidyNoticeBox, darkMode ? styles.subsidyDark : styles.subsidyLight]}>
          <View style={styles.noticeHeaderRow}>
            <AppIcon name="business" size={15} color="#059669" />
            <Text style={[styles.noticeHeader, { color: '#059669' }]}>
              {isUrdu ? 'حکومت پاکستان ریلیف سبسڈی' : 'Govt of Pakistan Subsidy'}
            </Text>
          </View>
          <Text style={[styles.noticeBody, darkMode ? styles.darkText : styles.lightText, isUrdu && styles.rtlText]}>
            {bill.subsidyMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  noticeBox: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
  },
  noticeBoxLight: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  noticeBoxDark: {
    backgroundColor: '#1E1B16',
    borderColor: '#78350F',
  },
  subsidyNoticeBox: {
    marginTop: 4,
  },
  subsidyLight: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  subsidyDark: {
    backgroundColor: '#06281E',
    borderColor: '#065F46',
  },
  noticeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  noticeHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  noticeBody: {
    fontSize: 11,
    lineHeight: 16,
  },
  darkText: {
    color: '#F8F9FF',
  },
  lightText: {
    color: '#0B1C30',
  },
  rtlText: {
    textAlign: 'right',
  },
});


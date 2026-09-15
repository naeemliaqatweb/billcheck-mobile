import React from 'react';
import { View, Text } from 'react-native';
import { BillData } from '../../types/bill';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/ChargesBreakdown.styles';

interface NoticesCardProps {
  bill: BillData;
  darkMode: boolean;
  isUrdu: boolean;
}

export const NoticesCard: React.FC<NoticesCardProps> = ({ bill, darkMode, isUrdu }) => {
  if (!bill.fpaMessage && !bill.subsidyMessage) return null;

  return (
    <View>
      {bill.fpaMessage && (
        <View style={styles.noticeBox}>
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
        <View style={[styles.noticeBox, styles.subsidyNoticeBox]}>
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

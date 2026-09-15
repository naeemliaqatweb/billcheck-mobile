import React from 'react';
import { View, Text } from 'react-native';
import { BillData } from '../../types/bill';
import { TRANSLATIONS, Language } from '../../i18n/translations';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/BillCards.styles';

interface MeterReadingsCardProps {
  bill: BillData;
  language: Language;
  darkMode: boolean;
  isUrdu: boolean;
}

export const MeterReadingsCard: React.FC<MeterReadingsCardProps> = ({
  bill,
  language,
  darkMode,
  isUrdu,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <View>
      <View style={styles.readingsRow}>
        <View style={[styles.readingBox, darkMode ? styles.readingDarkBox : styles.readingLightBox]}>
          <Text style={[styles.readingLabel, darkMode ? styles.darkSub : styles.lightSub]}>
            {isUrdu ? 'پچھلی ریڈنگ' : 'Prev Reading'}
          </Text>
          <Text style={[styles.readingValue, darkMode ? styles.darkText : styles.lightText]}>
            {(bill.previousReading ?? 0).toLocaleString()}
          </Text>
        </View>

        <View style={styles.readingArrowBox}>
          <AppIcon name="chevron-right" size={16} color={darkMode ? '#94A3B8' : '#64748B'} />
        </View>

        <View style={[styles.readingBox, darkMode ? styles.readingDarkBox : styles.readingLightBox]}>
          <Text style={[styles.readingLabel, darkMode ? styles.darkSub : styles.lightSub]}>
            {isUrdu ? 'موجودہ ریڈنگ' : 'Present Reading'}
          </Text>
          <Text style={[styles.readingValue, darkMode ? styles.darkText : styles.lightText]}>
            {(bill.presentReading ?? 0).toLocaleString()}
          </Text>
        </View>

        <View style={[styles.readingBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981', borderWidth: 1 }]}>
          <Text style={[styles.readingLabel, { color: '#10B981' }]}>
            {isUrdu ? 'کل یونٹس' : 'Total Units'}
          </Text>
          <Text style={[styles.readingValue, { color: '#10B981', fontWeight: '900' }]}>
            {bill.unitsConsumed}
          </Text>
        </View>
      </View>

      <View style={[styles.infoRow, { marginTop: 12 }]}>
        <Text style={[styles.infoLabel, darkMode ? styles.darkSub : styles.lightSub]}>{t.meterNo}</Text>
        <Text style={[styles.infoValue, styles.fontMono, darkMode ? styles.darkText : styles.lightText]}>
          {bill.meterNo}
        </Text>
      </View>

      {bill.meterDetails?.mf !== undefined && (
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, darkMode ? styles.darkSub : styles.lightSub]}>Multiplying Factor (MF)</Text>
          <Text style={[styles.infoValue, darkMode ? styles.darkText : styles.lightText]}>
            {bill.meterDetails.mf}
          </Text>
        </View>
      )}

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, darkMode ? styles.darkSub : styles.lightSub]}>{t.billMonth}</Text>
        <Text style={[styles.infoValue, darkMode ? styles.darkText : styles.lightText]}>{bill.billMonth}</Text>
      </View>

      {bill.issueDate && (
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, darkMode ? styles.darkSub : styles.lightSub]}>Issue Date</Text>
          <Text style={[styles.infoValue, darkMode ? styles.darkText : styles.lightText]}>{bill.issueDate}</Text>
        </View>
      )}
    </View>
  );
};

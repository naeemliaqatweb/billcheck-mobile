import React from 'react';
import { View, Text } from 'react-native';
import { BillData } from '../../types/bill';
import { TRANSLATIONS, Language } from '../../i18n/translations';
import { styles } from '../../styles/BillCards.styles';

interface ConsumerDetailsCardProps {
  bill: BillData;
  language: Language;
  darkMode: boolean;
}

export const ConsumerDetailsCard: React.FC<ConsumerDetailsCardProps> = ({ bill, language, darkMode }) => {
  const t = TRANSLATIONS[language];

  return (
    <View>
      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, darkMode ? styles.darkSub : styles.lightSub]}>{t.consumerName}</Text>
        <Text style={[styles.infoValue, darkMode ? styles.darkText : styles.lightText]}>{bill.consumerName}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, darkMode ? styles.darkSub : styles.lightSub]}>{t.referenceNumber}</Text>
        <Text style={[styles.infoValue, styles.fontMono, { color: '#38BDF8', fontWeight: '800' }]}>
          {bill.formattedRefNo || bill.referenceNo}
        </Text>
      </View>

      {bill.consumerId && (
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, darkMode ? styles.darkSub : styles.lightSub]}>{t.consumerId}</Text>
          <Text style={[styles.infoValue, styles.fontMono, darkMode ? styles.darkText : styles.lightText]}>
            {bill.consumerId}
          </Text>
        </View>
      )}

      {bill.subDivision && (
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, darkMode ? styles.darkSub : styles.lightSub]}>Sub Division</Text>
          <Text style={[styles.infoValue, darkMode ? styles.darkText : styles.lightText]}>{bill.subDivision}</Text>
        </View>
      )}

      {bill.feederName && (
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, darkMode ? styles.darkSub : styles.lightSub]}>Feeder</Text>
          <Text style={[styles.infoValue, darkMode ? styles.darkText : styles.lightText]}>{bill.feederName}</Text>
        </View>
      )}

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, darkMode ? styles.darkSub : styles.lightSub]}>Tariff</Text>
        <Text style={[styles.infoValue, darkMode ? styles.darkText : styles.lightText]}>{bill.tariff}</Text>
      </View>

      {bill.consumerDetails?.category && (
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, darkMode ? styles.darkSub : styles.lightSub]}>Category</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{bill.consumerDetails.category}</Text>
          </View>
        </View>
      )}

      {bill.connectedLoad && (
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, darkMode ? styles.darkSub : styles.lightSub]}>Sanctioned Load</Text>
          <Text style={[styles.infoValue, darkMode ? styles.darkText : styles.lightText]}>{bill.connectedLoad}</Text>
        </View>
      )}
    </View>
  );
};

import React from 'react';
import { View, Text } from 'react-native';
import { BillData } from '../../types/bill';
import { TRANSLATIONS, Language } from '../../i18n/translations';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/ChargesBreakdown.styles';

interface ChargesBreakdownCardProps {
  bill: BillData;
  language: Language;
  darkMode: boolean;
  isUrdu: boolean;
}

export const ChargesBreakdownCard: React.FC<ChargesBreakdownCardProps> = ({
  bill,
  language,
  darkMode,
  isUrdu,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <View>
      {bill.chargesBreakdown && bill.chargesBreakdown.length > 0 ? (
        bill.chargesBreakdown.map((item, idx) => {
          const isGrand = item.labelEn.includes('Grand Total');
          const isSubsidy = item.labelEn.includes('Subsidies');
          const isCurrent = item.labelEn.includes('Current Bill');

          return (
            <View
              key={idx}
              style={[
                styles.infoRow,
                isGrand && styles.grandTotalRow,
                isSubsidy && styles.subsidyRow,
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.infoLabel,
                    isGrand ? styles.grandLabel : (darkMode ? styles.darkText : styles.lightText),
                    isSubsidy && styles.subsidyLabelText,
                  ]}
                >
                  {item.labelEn}
                  {item.percentage ? ` (${item.percentage})` : ''}
                </Text>
                {item.labelUr && (
                  <Text style={[styles.infoLabelUr, isSubsidy ? styles.subsidyLabelText : (darkMode ? styles.darkSub : styles.lightSub)]}>
                    {item.labelUr}
                  </Text>
                )}
              </View>

              <Text
                style={[
                  styles.infoValue,
                  isGrand ? styles.grandValue : (darkMode ? styles.darkText : styles.lightText),
                  isSubsidy && styles.subsidyValueText,
                  isCurrent && { fontWeight: '800' },
                ]}
              >
                {isSubsidy ? `- Rs. ${item.value.toLocaleString()}` : `Rs. ${item.value.toLocaleString()}`}
              </Text>
            </View>
          );
        })
      ) : (
        <>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, darkMode ? styles.darkSub : styles.lightSub]}>{t.gst}</Text>
            <Text style={[styles.infoValue, darkMode ? styles.darkText : styles.lightText]}>
              Rs. {bill.gstAmount.toLocaleString()}
            </Text>
          </View>

          {bill.fpaAmount > 0 && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, darkMode ? styles.darkSub : styles.lightSub]}>{t.fpa}</Text>
              <Text style={[styles.infoValue, darkMode ? styles.darkText : styles.lightText]}>
                Rs. {bill.fpaAmount.toLocaleString()}
              </Text>
            </View>
          )}

          {bill.tvFee > 0 && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, darkMode ? styles.darkSub : styles.lightSub]}>{t.tvFee}</Text>
              <Text style={[styles.infoValue, darkMode ? styles.darkText : styles.lightText]}>
                Rs. {bill.tvFee.toLocaleString()}
              </Text>
            </View>
          )}
        </>
      )}

      {/* Surcharge Tiers */}
      {bill.surchargeTiers && bill.surchargeTiers.length > 0 && (
        <View style={styles.surchargeTiersCard}>
          <View style={styles.tierTitleRow}>
            <AppIcon name="alert" size={15} color="#F59E0B" />
            <Text style={[styles.surchargeTiersTitle, darkMode ? styles.darkSub : styles.lightSub]}>
              {isUrdu ? 'تاخیر ادائیگی کے بعد واجب الادا رقم' : 'Payable After Due Date Tiers'}
            </Text>
          </View>
          {bill.surchargeTiers.map((tier, idx) => (
            <View key={idx} style={styles.tierRow}>
              <Text style={[styles.tierPeriod, darkMode ? styles.darkText : styles.lightText]}>
                {tier.period}
              </Text>
              <Text style={styles.tierSurcharge}>
                +Rs. {tier.surcharge.toLocaleString()} surcharge
              </Text>
              <Text style={styles.tierPayable}>
                Rs. {tier.payable.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

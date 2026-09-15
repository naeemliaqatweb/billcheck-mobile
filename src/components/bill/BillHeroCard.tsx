import React from 'react';
import { View, Text } from 'react-native';
import { BillData } from '../../types/bill';
import { TRANSLATIONS, Language } from '../../i18n/translations';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/BillCards.styles';

interface BillHeroCardProps {
  bill: BillData;
  language: Language;
  darkMode: boolean;
}

export const BillHeroCard: React.FC<BillHeroCardProps> = ({ bill, language, darkMode }) => {
  const t = TRANSLATIONS[language];
  const isUrdu = language === 'ur';

  const hasSubsidy =
    (bill.subsidyAmount && bill.subsidyAmount > 0) ||
    (bill.chargesBreakdown && bill.chargesBreakdown.some((c) => c.labelEn.includes('Subsidies') && c.value > 0));
  const subsidyVal =
    bill.subsidyAmount || (bill.chargesBreakdown?.find((c) => c.labelEn.includes('Subsidies'))?.value || 0);

  return (
    <View style={[styles.heroCard, darkMode ? styles.darkCard : styles.lightCard]}>
      <View style={styles.heroTopRow}>
        <View style={styles.companyBadge}>
          <Text style={styles.companyBadgeText}>{bill.company}</Text>
        </View>
        <View style={[styles.statusBadge, bill.billStatus === 'paid' ? styles.statusPaid : styles.statusUnpaid]}>
          <Text style={styles.statusText}>
            {bill.billStatus === 'paid' ? t.statusPaid : (bill.billStatus === 'overdue' ? t.statusOverdue : t.statusUnpaid)}
          </Text>
        </View>
      </View>

      <Text style={[styles.amountLabel, darkMode ? styles.darkSub : styles.lightSub]}>
        {t.payableWithinDue}
      </Text>
      <Text style={[styles.heroAmount, darkMode ? styles.darkText : styles.lightText]}>
        Rs. {bill.payableWithinDueDate.toLocaleString()}
      </Text>

      <View style={styles.dueDateBadge}>
        <AppIcon name="calendar" size={14} color="#F59E0B" />
        <Text style={styles.dueDateLabel}>{t.dueDate}:</Text>
        <Text style={styles.dueDateVal}>{bill.dueDate}</Text>
      </View>

      {hasSubsidy && subsidyVal > 0 && (
        <View style={styles.subsidyHeroBanner}>
          <AppIcon name="sparkles" size={14} color="#059669" />
          <Text style={styles.subsidyHeroText}>
            {isUrdu ? `حکومتی سبسڈی: Rs. ${subsidyVal.toLocaleString()}` : `Govt Subsidy Applied: Rs. ${subsidyVal.toLocaleString()}`}
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.twoColumnRow}>
        <View>
          <Text style={[styles.colLabel, darkMode ? styles.darkSub : styles.lightSub]}>
            {t.payableAfterDue}
          </Text>
          <Text style={styles.lateAmountVal}>Rs. {bill.payableAfterDueDate.toLocaleString()}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.colLabel, darkMode ? styles.darkSub : styles.lightSub]}>
            {t.lateFee}
          </Text>
          <Text style={[styles.colVal, darkMode ? styles.darkText : styles.lightText]}>
            Rs. {bill.latePaymentSurcharge.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

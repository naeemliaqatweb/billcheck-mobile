import React from 'react';
import { View, Text } from 'react-native';
import { Language, TRANSLATIONS } from '../../i18n/translations';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/HistoryScreen.styles';

interface EnergySavingTipsProps {
  darkMode: boolean;
  language: Language;
}

export const EnergySavingTips: React.FC<EnergySavingTipsProps> = ({ darkMode, language }) => {
  const isUrdu = language === 'ur';

  const tips = isUrdu
    ? [
        'پیک اوقات (شام 5 تا 11 بجے) کے دوران بھاری آلات (استری، موٹر، اے سی) چلانے سے گریز کریں۔',
        'انورٹر ایئر کنڈیشنر کو 26 ڈگری سینٹی گریڈ پر چلانے سے 30 فیصد تک بجلی بچتی ہے۔',
        'غیر استعمال شدہ چارجرز اور برقی آلات کے سوئچ بند رکھیں (Phantom Load سے بچیں)۔',
      ]
    : [
        'Avoid running heavy loads (iron, water pump, AC) during peak hours (5 PM – 11 PM).',
        'Set Inverter AC temperature at 26°C to reduce electricity consumption by up to 30%.',
        'Switch off appliances and chargers when not in use to eliminate phantom load.',
      ];

  return (
    <View style={[styles.tipsCard, darkMode ? styles.darkCard : styles.lightCard]}>
      <View style={styles.tipHeaderRow}>
        <AppIcon name="sparkles" size={16} color="#F59E0B" />
        <Text style={[styles.tipsTitle, darkMode ? styles.darkText : styles.lightText, isUrdu && styles.rtlText]}>
          {isUrdu ? 'بجلی اور گیس بچانے کی اہم تجاویز' : 'Energy & Cost Saving Insights'}
        </Text>
      </View>
      {tips.map((tip, idx) => (
        <View key={idx} style={styles.tipRow}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={[styles.tipText, darkMode ? styles.darkSub : styles.lightSub, isUrdu && styles.rtlText]}>
            {tip}
          </Text>
        </View>
      ))}
    </View>
  );
};

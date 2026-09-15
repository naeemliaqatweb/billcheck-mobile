import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SavedMeter } from '../types/bill';
import { AppIcon } from './AppIcon';
import { styles } from '../styles/QuickSavedBills.styles';

interface QuickSavedBillsProps {
  savedMeters: SavedMeter[];
  darkMode: boolean;
  isUrdu: boolean;
  title: string;
  onQuickCheck: (meter: SavedMeter) => void;
}

export const QuickSavedBills: React.FC<QuickSavedBillsProps> = ({
  savedMeters,
  darkMode,
  isUrdu,
  title,
  onQuickCheck,
}) => {
  if (!savedMeters || savedMeters.length === 0) return null;

  return (
    <View style={styles.savedSection}>
      <View style={styles.sectionHeaderRow}>
        <AppIcon name="star" size={16} color="#F59E0B" />
        <Text style={[styles.sectionTitle, darkMode ? styles.darkText : styles.lightText, isUrdu && styles.rtlText]}>
          {title}
        </Text>
      </View>
      {savedMeters.slice(0, 3).map((meter) => (
        <TouchableOpacity
          key={meter.id}
          style={[styles.savedItemCard, darkMode ? styles.darkCard : styles.lightCard]}
          onPress={() => onQuickCheck(meter)}
          activeOpacity={0.8}
        >
          <View style={styles.savedItemLeft}>
            <View style={[styles.savedIconCircle, { backgroundColor: meter.utilityType === 'gas' ? '#0284C7' : '#059669' }]}>
              <AppIcon name={meter.utilityType === 'gas' ? 'flame' : 'bolt'} size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[styles.savedNickname, darkMode ? styles.darkText : styles.lightText]}>
                {meter.nickname}
              </Text>
              <Text style={[styles.savedRefText, darkMode ? styles.darkSub : styles.lightSub]}>
                {meter.company} • {meter.referenceNumber}
              </Text>
            </View>
          </View>
          <AppIcon name="chevron-right" size={18} color={darkMode ? '#64748B' : '#94A3B8'} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

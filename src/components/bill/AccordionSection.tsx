import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/BillCards.styles';

export interface AccordionSectionProps {
  id: string;
  title: string;
  urduTitle: string;
  iconName: string;
  badge?: string;
  isOpen: boolean;
  onToggle: () => void;
  darkMode: boolean;
  isUrdu: boolean;
  children: React.ReactNode;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  urduTitle,
  iconName,
  badge,
  isOpen,
  onToggle,
  darkMode,
  isUrdu,
  children,
}) => {
  return (
    <View style={[styles.accordionCard, darkMode ? styles.darkCard : styles.lightCard]}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.accordionTitleRow}>
          <View style={[styles.accordionIconBox, { backgroundColor: darkMode ? '#1F2937' : '#F1F5F9' }]}>
            <AppIcon name={iconName} size={18} color="#10B981" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.accordionTitle, darkMode ? styles.darkText : styles.lightText]}>
              {isUrdu ? urduTitle : title}
            </Text>
            {isUrdu && (
              <Text style={[styles.accordionSubTitle, darkMode ? styles.darkSub : styles.lightSub]}>
                {title}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.accordionRightRow}>
          {badge && (
            <View style={[styles.badgePill, darkMode ? styles.darkBadgePill : styles.lightBadgePill]}>
              <Text style={styles.badgePillText}>{badge}</Text>
            </View>
          )}
          <View style={[styles.chevronBox, isOpen && styles.chevronBoxActive]}>
            <AppIcon
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              size={15}
              color={darkMode ? '#94A3B8' : '#64748B'}
            />
          </View>
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.accordionBody}>
          <View style={styles.accordionDivider} />
          {children}
        </View>
      )}
    </View>
  );
};

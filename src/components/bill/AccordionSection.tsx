import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppIcon } from '../AppIcon';

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
          <View style={[styles.accordionIconBox, { backgroundColor: darkMode ? '#132033' : '#EFF4FF' }]}>
            <AppIcon name={iconName} size={18} color="#006D35" />
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

const styles = StyleSheet.create({
  accordionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C4C6CC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  darkCard: {
    backgroundColor: '#0F1C2C',
    borderColor: '#24354D',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  accordionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  accordionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  accordionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  accordionSubTitle: {
    fontSize: 10,
    marginTop: 1,
  },
  accordionRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  darkBadgePill: {
    backgroundColor: '#132033',
  },
  lightBadgePill: {
    backgroundColor: '#EFF4FF',
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#006D35',
  },
  chevronBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronBoxActive: {
    backgroundColor: 'rgba(0, 109, 53, 0.15)',
  },
  accordionBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  accordionDivider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    marginBottom: 10,
  },
  darkText: {
    color: '#F8F9FF',
  },
  lightText: {
    color: '#0B1C30',
  },
  darkSub: {
    color: '#94A3B8',
  },
  lightSub: {
    color: '#44474C',
  },
});


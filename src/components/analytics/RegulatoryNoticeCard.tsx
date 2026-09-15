import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppIcon } from '../AppIcon';

interface RegulatoryNoticeCardProps {
  darkMode?: boolean;
  language?: 'en' | 'ur';
}

export const RegulatoryNoticeCard: React.FC<RegulatoryNoticeCardProps> = ({
  darkMode = true,
  language = 'en',
}) => {
  const isUrdu = language === 'ur';

  return (
    <View style={[styles.card, darkMode ? styles.cardDark : styles.cardLight]}>
      {/* Left green accent border indicator */}
      <View style={styles.accentBar} />

      <View style={styles.iconWrap}>
        <AppIcon name="campaign" size={18} color="#62FF96" />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.noticeTag}>
            {isUrdu ? 'ریگولیٹری نوٹس' : 'REGULATORY NOTICE'}
          </Text>
          <Text style={styles.noticeDate}>Dec 2024</Text>
        </View>

        <Text style={[styles.noticeBody, darkMode ? styles.darkText : styles.lightText]}>
          <Text style={styles.highlightText}>
            {isUrdu ? 'نیپرا ٹیرف اپڈیٹ: ' : 'NEPRA Tariff Update: '}
          </Text>
          {isUrdu
            ? '300 سے کم یونٹس کے صارفین کے لیے سرمائی ریلیف پیکیج فعال ہے۔ آف پیک ریٹس خودکار طور پر لاگو ہوں گے۔'
            : 'Winter relief package active for units below 300. Off-peak rates applied automatically.'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: 'rgba(239, 244, 255, 0.05)',
    borderColor: 'rgba(63, 255, 139, 0.3)',
  },
  cardLight: {
    backgroundColor: '#EFF4FF',
    borderColor: '#D3E4FE',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#3FFF8B',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(63, 255, 139, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  noticeTag: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#62FF96',
    letterSpacing: 0.8,
  },
  noticeDate: {
    fontSize: 10,
    color: '#778598',
    fontWeight: '600',
  },
  noticeBody: {
    fontSize: 12,
    lineHeight: 17,
  },
  highlightText: {
    fontWeight: '700',
    color: '#3FFF8B',
  },
  darkText: {
    color: '#F8F9FF',
  },
  lightText: {
    color: '#0B1C30',
  },
});

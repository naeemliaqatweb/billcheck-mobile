import { StyleSheet } from 'react-native';
import { COLORS } from './common.styles';

export const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  providersScroll: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  providerCard: {
    width: 110,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  darkCard: {
    backgroundColor: COLORS.darkCard,
    borderColor: COLORS.darkBorder,
  },
  lightCard: {
    backgroundColor: COLORS.lightCard,
    borderColor: COLORS.lightBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  providerIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerIconText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  providerName: {
    fontSize: 13,
    fontWeight: '700',
  },
  providerRegion: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 2,
  },
  darkText: {
    color: COLORS.darkText,
  },
  lightText: {
    color: COLORS.lightText,
  },
  darkSub: {
    color: COLORS.darkSub,
  },
  lightSub: {
    color: COLORS.lightSub,
  },
  rtlText: {
    textAlign: 'right',
  },
});

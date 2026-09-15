import { StyleSheet } from 'react-native';
import { COLORS } from './common.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkBg: {
    backgroundColor: COLORS.darkBg,
  },
  lightBg: {
    backgroundColor: COLORS.lightBg,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  shareButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  shareText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
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
  toggleBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  toggleBarHint: {
    fontSize: 11,
    fontWeight: '500',
    flex: 1,
  },
  toggleAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  toggleAllBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  actionButtonsRow: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  saveMeterButton: {
    backgroundColor: COLORS.primaryDark,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedButtonActive: {
    backgroundColor: COLORS.darkBorder,
  },
  saveMeterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  btnRowSm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rtlText: {
    textAlign: 'right',
  },
});

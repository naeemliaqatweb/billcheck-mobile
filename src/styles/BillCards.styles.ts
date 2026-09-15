import { StyleSheet } from 'react-native';
import { COLORS } from './common.styles';

export const styles = StyleSheet.create({
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
  heroCard: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  companyBadgeText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPaid: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusUnpaid: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.danger,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  heroAmount: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  dueDateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.warning,
  },
  dueDateVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.warning,
  },
  subsidyHeroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  subsidyHeroText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    marginVertical: 14,
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  colVal: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  lateAmountVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F87171',
    marginTop: 2,
  },
  accordionCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
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
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
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
    backgroundColor: '#1E293B',
  },
  lightBadgePill: {
    backgroundColor: '#F1F5F9',
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
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
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
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
  readingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  readingBox: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  readingDarkBox: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  readingLightBox: {
    backgroundColor: COLORS.lightBg,
    borderColor: COLORS.lightBorder,
  },
  readingArrowBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  readingLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 2,
  },
  readingValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.08)',
  },
  infoLabel: {
    fontSize: 12,
  },
  infoLabelUr: {
    fontSize: 10,
    marginTop: 1,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
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
  fontMono: {
    fontFamily: 'monospace',
  },
  rtlText: {
    textAlign: 'right',
  },
});

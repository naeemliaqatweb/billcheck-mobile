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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActionBtnDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  headerActionBtnLight: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
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
  meterSelectorWrap: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  meterSelectorLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  meterScroll: {
    gap: 8,
  },
  meterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  meterChipActive: {
    backgroundColor: COLORS.purple,
    borderColor: '#4F46E5',
  },
  meterChipDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  meterChipLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
  meterChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  meterChipTextActive: {
    color: '#FFFFFF',
  },
  loadingBox: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyCard: {
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyBtnWrap: {
    width: '100%',
    gap: 10,
    marginTop: 6,
  },
  demoMeterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  demoMeterBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  checkBillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.purple,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  checkBillBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 10,
    marginBottom: 10,
  },
  gridCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  metricHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  gridCardLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  gridCardVal: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },
  gridCardSub: {
    fontSize: 10,
    marginTop: 2,
  },
  diffBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    flexShrink: 0,
    alignSelf: 'center',
  },
  higherBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  lowerBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  diffBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  higherText: {
    color: COLORS.danger,
  },
  lowerText: {
    color: COLORS.primary,
  },
  peakCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  peakLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.danger,
  },
  peakVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.danger,
    marginTop: 2,
  },
  peakSub: {
    fontSize: 10,
    color: COLORS.danger,
    marginTop: 2,
  },
  lowestCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  lowestLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  lowestVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryDark,
    marginTop: 2,
  },
  lowestSub: {
    fontSize: 10,
    color: COLORS.primaryDark,
    marginTop: 2,
  },
  tipsCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  tipHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  tipBullet: {
    color: COLORS.primary,
    fontSize: 16,
    lineHeight: 18,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  rtlText: {
    textAlign: 'right',
  },
});

import { StyleSheet } from 'react-native';
import { COLORS } from './common.styles';

export const styles = StyleSheet.create({
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
  grandTotalRow: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 4,
    borderBottomWidth: 0,
  },
  grandLabel: {
    fontWeight: '800',
    color: '#38BDF8',
  },
  grandValue: {
    fontWeight: '900',
    fontSize: 14,
    color: '#38BDF8',
  },
  subsidyRow: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 2,
  },
  subsidyLabelText: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  subsidyValueText: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  surchargeTiersCard: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  surchargeTiersTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  tierTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  tierPeriod: {
    fontSize: 11,
    fontWeight: '600',
  },
  tierSurcharge: {
    fontSize: 10,
    color: '#F87171',
    fontWeight: '600',
  },
  tierPayable: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F87171',
  },
  noticeBox: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    marginBottom: 8,
  },
  subsidyNoticeBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  noticeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  noticeHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  noticeBody: {
    fontSize: 11,
    lineHeight: 18,
    color: '#334155',
  },
  fontMono: {
    fontFamily: 'monospace',
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

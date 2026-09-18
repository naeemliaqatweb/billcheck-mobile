import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 14,
  },
  darkCard: {
    backgroundColor: '#16253B',
    borderColor: '#284163',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D5E2EE',
  },
  topZone: {
    backgroundColor: '#0C2B4E',
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  topHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  headerTextGroup: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  companyText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#62FF96',
    letterSpacing: 0.3,
    flexShrink: 0,
  },
  bulletDot: {
    color: '#FFFFFF',
    fontSize: 11,
    flexShrink: 0,
  },
  nicknameText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  refText: {
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  topHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  statusBadge: {
    paddingHorizontal: 7.5,
    paddingVertical: 3.5,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    flexShrink: 0,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusUnpaidBadge: {
    backgroundColor: '#DC2626',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusUnpaidText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  statusNeutralBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  statusNeutralText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  statusPaidBadge: {
    backgroundColor: '#059669',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusPaidText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  bottomZone: {
    padding: 16,
  },
  bottomZoneDark: {
    backgroundColor: '#16253B',
  },
  bottomZoneLight: {
    backgroundColor: '#FFFFFF',
  },
  consumerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    gap: 8,
  },
  consumerContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: '#284163',
  },
  consumerContainerLight: {
    backgroundColor: '#F0F5FA',
    borderColor: '#D5E2EE',
  },
  consumerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
  },
  consumerLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  consumerNameText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  amountDueDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  amountVal: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  dueDateCol: {
    minWidth: 80,
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  officialViewBtn: {
    flex: 1,
    height: 44,
    minHeight: 44,
    maxHeight: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    paddingVertical: 0,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  officialViewBtnDark: {
    borderColor: '#284E77',
    backgroundColor: '#0C2B4E',
  },
  officialViewBtnLight: {
    borderColor: '#006D35',
    backgroundColor: '#F0FDF4',
  },
  officialViewBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  officialViewBtnTextDark: {
    color: '#62FF96',
  },
  officialViewBtnTextLight: {
    color: '#006D35',
  },

  viewBillBtn: {
    flex: 1,
    height: 44,
    minHeight: 44,
    maxHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  viewBillBtnDark: {
    backgroundColor: '#059669',
  },
  viewBillBtnLight: {
    backgroundColor: '#059669',
  },
  gasViewBtnDark: {
    backgroundColor: '#284E77',
  },
  gasViewBtnLight: {
    backgroundColor: '#0C2B4E',
  },
  viewBillText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  viewBillTextDark: {
    color: '#FFFFFF',
  },
  viewBillTextLight: {
    color: '#FFFFFF',
  },
  darkText: {
    color: '#F8FAFC',
  },
  lightText: {
    color: '#0A1C30',
  },
  darkSub: {
    color: '#CBD5E1',
  },
  lightSub: {
    color: '#334E68',
  },
  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 2,
    borderWidth: 1,
  },
  predictionRowDark: {
    backgroundColor: '#0C2B4E',
    borderColor: 'rgba(98, 255, 150, 0.2)',
  },
  predictionRowLight: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  predictionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  predictionHighlight: {
    fontWeight: '800',
  },
  predictionTextDark: {
    color: '#FFFFFF',
  },
  predictionTextLight: {
    color: '#166534',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
  },
  deleteCircleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 138, 128, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

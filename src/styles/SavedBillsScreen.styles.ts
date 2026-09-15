import { StyleSheet } from 'react-native';
import { COLORS } from './common.styles';

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
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
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
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
  emptyCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  meterCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardMain: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  lastAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  nickname: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  refNumber: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  dueNotice: {
    fontSize: 11,
    color: COLORS.warning,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkActionBtn: {
    flex: 1,
  },
  actionBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkActionText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  deleteActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rtlText: {
    textAlign: 'right',
  },
});

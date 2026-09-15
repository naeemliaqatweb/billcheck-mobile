import { StyleSheet } from 'react-native';
import { COLORS } from './common.styles';

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    position: 'relative',
  },
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    zIndex: 999,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 12,
  },
  fabInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  brandBadge: {
    backgroundColor: COLORS.primaryDark,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    letterSpacing: 0.5,
  },
  langBadge: {
    fontSize: 12,
    fontWeight: '600',
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  appSubtitle: {
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
  tabSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 16,
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inputCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  inputHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  providerBadge: {
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
  },
  darkInput: {
    backgroundColor: COLORS.darkInput,
    borderColor: COLORS.darkInputBorder,
    color: '#FFFFFF',
  },
  lightInput: {
    backgroundColor: COLORS.lightInput,
    borderColor: COLORS.lightInputBorder,
    color: '#0F172A',
  },
  refInfoBox: {
    marginTop: 10,
    marginBottom: 14,
    padding: 10,
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
    borderRadius: 8,
  },
  refInfoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  refInfoTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.warning,
  },
  refInfoDesc: {
    fontSize: 10,
    lineHeight: 14,
  },
  checkButton: {
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  portalFallbackBtn: {
    marginTop: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  portalFallbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  portalFallbackText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  rtlText: {
    textAlign: 'right',
  },
  rtlInput: {
    textAlign: 'right',
  },
});

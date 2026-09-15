import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  darkBg: {
    backgroundColor: '#070E18',
  },
  lightBg: {
    backgroundColor: '#F0F5FA',
  },
  // Top App Bar
  topAppBar: {
    height: 56,
    backgroundColor: '#0C2B4E',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1E2D42',
    zIndex: 40,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  appBarTitleGroup: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  appBarSubtitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#62FF96',
    marginTop: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },

  // Deep Navy Hero Card
  heroCard: {
    backgroundColor: '#0C2B4E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(116, 119, 125, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 12,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroBrandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroLogoBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#050B14',
    borderWidth: 1.5,
    borderColor: 'rgba(98, 255, 150, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#62FF96',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  heroLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    color: '#778598',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  heroVersionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  heroVersionText: {
    color: '#62FF96',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  heroUserRibbon: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroUserLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroAvatarText: {
    color: '#0B1C30',
    fontSize: 13,
    fontWeight: '800',
  },
  heroUserName: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  heroUserStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  heroUserStatusText: {
    color: '#778598',
    fontSize: 11,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#62FF96',
  },

  // Bento Quick Metrics (2 Cols)
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  metricIconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10.5,
    fontWeight: '500',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12.5,
    fontWeight: '700',
  },

  // Menu List Section
  menuCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  menuHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  menuHeaderBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#006D35',
  },
  menuHeaderBadgeDark: {
    color: '#3FFF8B',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuRowTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  menuRowSubtitle: {
    fontSize: 11.5,
    marginTop: 2,
  },
  menuRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Language segmented buttons
  langToggleRow: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    overflow: 'hidden',
  },
  langChoice: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  langChoiceActive: {
    backgroundColor: '#006D35',
  },
  langChoiceText: {
    fontSize: 12,
    fontWeight: '700',
  },
  langActiveText: {
    color: '#FFFFFF',
  },

  // Disclaimer Section
  disclaimerCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(116, 119, 125, 0.3)',
    padding: 16,
    marginBottom: 14,
  },
  disclaimerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  disclaimerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  disclaimerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  disclaimerTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  disclaimerBody: {
    fontSize: 11.5,
    lineHeight: 18,
  },
  disclaimerFooter: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disclaimerFooterLeft: {
    fontSize: 10.5,
    color: '#74777D',
  },
  disclaimerFooterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  disclaimerFooterRightText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#006D35',
  },
  disclaimerFooterRightDark: {
    color: '#3FFF8B',
  },

  // Reset & Footer Section
  resetButton: {
    width: '100%',
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  footerSection: {
    alignItems: 'center',
    paddingVertical: 6,
    gap: 3,
  },
  footerTextMain: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  footerTextSub: {
    fontSize: 10.5,
    color: '#74777D',
    textAlign: 'center',
  },

  // Shared Dark/Light helpers
  darkCardBg: {
    backgroundColor: '#16253B',
    borderColor: '#284163',
  },
  lightCardBg: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D5E2EE',
  },
  darkMenuHeader: {
    backgroundColor: '#0C2B4E',
    borderBottomColor: '#284E77',
  },
  lightMenuHeader: {
    backgroundColor: '#F0F5FA',
    borderBottomColor: '#D5E2EE',
  },
  darkBox: {
    backgroundColor: '#16253B',
    borderColor: '#284163',
  },
  lightBox: {
    backgroundColor: '#EBF4FC',
    borderColor: '#CCE0F5',
  },
  darkText: {
    color: '#F8FAFC',
  },
  lightText: {
    color: '#0A1C30',
  },
  darkSub: {
    color: '#94A3B8',
  },
  lightSub: {
    color: '#334E68',
  },
  rtlText: {
    textAlign: 'right',
  },
});

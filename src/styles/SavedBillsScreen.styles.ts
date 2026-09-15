import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  darkBg: {
    backgroundColor: '#070E17',
  },
  lightBg: {
    backgroundColor: '#F8F9FF',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100, // Space for bottom navigation
  },

  // Top App Bar
  topAppBar: {
    height: 56,
    backgroundColor: '#0F1C2C',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    zIndex: 40,
  },
  topAppLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  backIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(211, 228, 254, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBarTitleGroup: {
    justifyContent: 'center',
  },
  appBarMainTitle: {
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
  topAppRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(211, 228, 254, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Subheader Utility Banner with Circuit Motif
  circuitBanner: {
    backgroundColor: '#0F1C2C',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 22,
  },
  gridSyncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  gridSyncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#62FF96',
  },
  gridSyncText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#62FF96',
    letterSpacing: 0.8,
  },
  liveTagText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#778598',
  },
  bannerHeadline: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  bannerDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: '#778598',
    marginTop: 3,
  },

  // Quick Stats Bento Strip
  bentoStrip: {
    backgroundColor: 'rgba(33, 49, 69, 0.65)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(211, 228, 254, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  bentoCol: {
    flex: 1,
  },
  bentoColRight: {
    alignItems: 'flex-end',
  },
  bentoDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(211, 228, 254, 0.15)',
    marginHorizontal: 8,
  },
  bentoLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#778598',
    textTransform: 'uppercase',
  },
  bentoVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  bentoValGreen: {
    fontSize: 14,
    fontWeight: '900',
    color: '#62FF96',
    marginTop: 2,
  },
  duePill: {
    backgroundColor: '#FFDAD6',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
    marginTop: 3,
  },
  duePillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#BA1A1A',
  },

  // Main Canvas
  mainCanvas: {
    paddingHorizontal: 16,
    marginTop: -8,
    gap: 12,
  },

  // Search & Fast Filter Bar
  searchBarContainer: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBarLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C4C6CC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchBarDark: {
    backgroundColor: '#0F1C2C',
    borderColor: '#24354D',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 8,
  },

  // Category Filter Chips
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 2,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: '#0F1C2C',
    borderColor: '#0F1C2C',
  },
  filterChipInactiveLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C4C6CC',
  },
  filterChipInactiveDark: {
    backgroundColor: '#132033',
    borderColor: '#24354D',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  filterChipTextInactiveLight: {
    color: '#44474C',
    fontSize: 11.5,
    fontWeight: '600',
  },
  filterChipTextInactiveDark: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '600',
  },
  countBadgeActive: {
    backgroundColor: '#62FF96',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadgeTextActive: {
    color: '#00210B',
    fontSize: 9.5,
    fontWeight: '900',
  },

  // Meter Cards
  meterCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  meterCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C4C6CC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  meterCardDark: {
    backgroundColor: '#0F1C2C',
    borderColor: '#24354D',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  logoBoxWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    backgroundColor: '#EFF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoBoxDark: {
    backgroundColor: '#132033',
    borderColor: '#24354D',
  },
  cardMiddleInfo: {
    flex: 1,
    minWidth: 0,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  cardNickname: {
    fontSize: 14,
    fontWeight: '800',
  },
  companyPill: {
    backgroundColor: '#EFF4FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
  },
  companyPillDark: {
    backgroundColor: '#132033',
  },
  companyPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#006D35',
    letterSpacing: 0.5,
  },
  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  refText: {
    fontSize: 11.5,
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  copyIconBtn: {
    padding: 2,
  },
  metaStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  metaCheckedText: {
    fontSize: 11,
    fontWeight: '500',
  },
  metaAmountText: {
    fontSize: 12,
    fontWeight: '800',
  },
  dueBadgeDue: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  dueBadgeTextDue: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#D97706',
  },
  dueBadgeOverdue: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dueBadgeTextOverdue: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  dueBadgePaid: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
    backgroundColor: '#E8FDF2',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  dueBadgeTextPaid: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#00A854',
  },

  // Card Bottom CTA Action Bar
  cardBottomBar: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phaseInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  phaseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  phaseText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(186, 26, 26, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewBillBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#62FF96',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  viewBillBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#00210B',
  },

  // Add Another Meter Prominent Action Card
  addAnotherCard: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 6,
  },
  addAnotherCardLight: {
    backgroundColor: 'rgba(239, 244, 255, 0.5)',
    borderColor: '#C4C6CC',
  },
  addAnotherCardDark: {
    backgroundColor: 'rgba(15, 28, 44, 0.4)',
    borderColor: '#24354D',
  },
  addIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0F1C2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAnotherText: {
    fontSize: 14,
    fontWeight: '800',
  },

  // Empty State Card
  emptyCard: {
    marginVertical: 12,
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

  // Security Trust Footnote
  securityFootnote: {
    paddingVertical: 16,
    alignItems: 'center',
    gap: 3,
  },
  securityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  securityTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#006D35',
  },
  securitySub: {
    fontSize: 10,
    color: '#778598',
    textAlign: 'center',
  },

  // Utility typography
  darkText: {
    color: '#F8F9FF',
  },
  lightText: {
    color: '#0B1C30',
  },
  darkSub: {
    color: '#778598',
  },
  lightSub: {
    color: '#44474C',
  },
  rtlText: {
    textAlign: 'right',
  },
});

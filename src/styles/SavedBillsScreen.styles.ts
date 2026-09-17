import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  darkBg: {
    backgroundColor: '#070E18',
  },
  lightBg: {
    backgroundColor: '#F0F5FA',
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
    backgroundColor: '#0C2B4E',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1E2D42',
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
    backgroundColor: '#0C2B4E',
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
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bannerHeadline: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  bannerDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
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
    fontWeight: '700',
    color: '#FFFFFF',
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
  },
  searchBarDark: {
    backgroundColor: '#0C2B4E',
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
    backgroundColor: '#059669',
    borderColor: '#059669',
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
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '600',
  },
  countBadgeActive: {
    backgroundColor: '#006D35',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadgeTextActive: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
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
    backgroundColor: 'rgba(12, 43, 78, 0.4)',
    borderColor: '#24354D',
  },
  addIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0C2B4E',
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
  emptyCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D5E2EE',
  },
  emptyCardDark: {
    backgroundColor: '#16253B',
    borderColor: '#284163',
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

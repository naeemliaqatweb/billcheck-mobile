import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  darkBg: {
    backgroundColor: '#030712',
  },
  lightBg: {
    backgroundColor: '#F8F9FF',
  },

  // Deep Navy Header Area
  header: {
    backgroundColor: '#0F1C2C',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: '#62FF96',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  gridOkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#62FF96',
  },
  gridOkText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  // Search Bar
  searchBarWrap: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
  },
  searchBarLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  searchBarDark: {
    backgroundColor: '#162032',
    borderColor: '#1F2937',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    paddingVertical: 0,
  },

  // Filter Capsules
  filterCapsulesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  filterCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterCapsuleActive: {
    backgroundColor: '#006D35',
    borderColor: '#3FFF8B',
  },
  filterCapsuleActiveDark: {
    backgroundColor: '#006D35',
    borderColor: '#3FFF8B',
  },
  filterCapsuleText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  filterCapsuleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  capsuleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  capsuleBadgeActive: {
    backgroundColor: '#3FFF8B',
  },
  capsuleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  capsuleBadgeTextActive: {
    color: '#0B1C30',
  },

  // Main Content Scroll
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIconBox: {
    width: 28,
    height: 28,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  countBadgeText: {
    fontSize: 10.5,
    fontWeight: '600',
  },

  // 2-Column Provider Grid (Strict 2-Column Responsive Layout - Flat Modern Stitch Style)
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  providerCard: {
    width: '48.2%',
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoBox: {
    width: 52,
    height: 52,
    borderRadius: 13,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  companyCode: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },
  companyName: {
    fontSize: 11,
    marginTop: 3,
    lineHeight: 15,
    minHeight: 30,
  },
  cardFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regionPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  regionPillText: {
    fontSize: 9.5,
    fontWeight: '600',
  },
  onlineText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#006D35',
  },
  onlineTextDark: {
    color: '#3FFF8B',
  },

  // Help Banner
  helpBanner: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  helpIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  helpText: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  helpLinkBtn: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  helpLinkText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#006D35',
  },
  helpLinkTextDark: {
    color: '#3FFF8B',
  },

  // Footer Brand Stamp
  brandStamp: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  brandStampText: {
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#74777D',
  },

  // Dark / Light Cards
  darkCard: {
    backgroundColor: '#111827',
    borderColor: '#1F2937',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  darkBox: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  lightBox: {
    backgroundColor: '#EFF4FF',
    borderColor: '#D3E4FE',
  },
  darkDivider: {
    borderTopColor: '#1F2937',
  },
  lightDivider: {
    borderTopColor: '#F1F5F9',
  },
  darkText: {
    color: '#F8FAFC',
  },
  lightText: {
    color: '#0B1C30',
  },
  darkSub: {
    color: '#94A3B8',
  },
  lightSub: {
    color: '#64748B',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
  },
});

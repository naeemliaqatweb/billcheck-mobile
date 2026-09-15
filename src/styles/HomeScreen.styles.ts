import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    position: 'relative',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 110,
  },
  darkBg: {
    backgroundColor: '#070E18',
  },
  lightBg: {
    backgroundColor: '#F0F5FA',
  },

  // TopAppBar
  topAppBar: {
    height: 56,
    backgroundColor: '#0C2B4E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
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
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },

  // Main Content Canvas (Overlapping Hero by -14px)
  mainCanvas: {
    paddingHorizontal: 16,
    marginTop: -14,
    zIndex: 20,
    gap: 16,
  },

  // Section Header & Quick Filter Tabs Card
  sectionFilterCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionFilterCardDark: {
    backgroundColor: '#16253B',
    borderColor: '#284163',
  },
  sectionFilterCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D5E2EE',
    shadowColor: '#0A1C30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitleCol: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionSub: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },

  // Segmented Filter Tabs
  filterTabsWrap: {
    flexDirection: 'row',
    backgroundColor: '#E4EEF8',
    padding: 3,
    borderRadius: 20,
    gap: 2,
  },
  filterTabsWrapDark: {
    backgroundColor: '#0C2B4E',
  },
  filterTabItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  filterTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0A1C30',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterTabActiveDark: {
    backgroundColor: '#213550',
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#486581',
  },
  filterTabTextActive: {
    color: '#006D35',
    fontWeight: '800',
  },
  filterTabTextActiveDark: {
    color: '#3FFF8B',
    fontWeight: '800',
  },

  // Saved Bills List
  billsListContainer: {
    gap: 12,
  },

  // Empty state
  emptyBillsBox: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  emptyBillsBoxDark: {
    backgroundColor: '#16253B',
    borderColor: '#284163',
  },
  emptyBillsBoxLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D5E2EE',
  },
  emptyBillsTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4,
  },
  emptyBillsSub: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Quick Utility Sync Banner
  syncBanner: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  syncBannerDark: {
    backgroundColor: '#16253B',
    borderColor: '#284163',
  },
  syncBannerLight: {
    backgroundColor: '#EBF4FC',
    borderColor: '#CCE0F5',
  },
  syncBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  syncBannerTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  syncBannerSub: {
    fontSize: 11,
    marginTop: 1,
  },
  syncConnectedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 14,
    borderWidth: 1,
  },
  syncConnectedBadgeDark: {
    backgroundColor: '#0C2B4E',
    borderColor: '#284E77',
  },
  syncConnectedBadgeLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCE0F5',
  },
  syncConnectedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#006D35',
  },
  bottomSpacer: {
    height: 80,
  },

  // Typography & Colors
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
  darkCard: {
    backgroundColor: '#16253B',
    borderColor: '#284163',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D5E2EE',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
  },
});

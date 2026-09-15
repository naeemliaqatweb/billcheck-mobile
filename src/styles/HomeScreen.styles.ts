import { StyleSheet } from 'react-native';
import { COLORS } from './common.styles';

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#0F1C2C',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 110,
  },
  darkBg: {
    backgroundColor: '#070E17',
  },
  lightBg: {
    backgroundColor: '#F8F9FF',
  },

  // TopAppBar
  topAppBar: {
    height: 56,
    backgroundColor: '#0F1C2C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
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
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  sectionFilterCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#000',
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
    backgroundColor: '#EFF4FF',
    padding: 3,
    borderRadius: 20,
    gap: 2,
  },
  filterTabsWrapDark: {
    backgroundColor: '#0F1C2C',
  },
  filterTabItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  filterTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterTabActiveDark: {
    backgroundColor: '#213145',
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTabTextActive: {
    color: '#0B1C30',
    fontWeight: '800',
  },
  filterTabTextActiveDark: {
    color: '#FFFFFF',
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
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  emptyBillsBoxLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
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
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  syncBannerLight: {
    backgroundColor: '#EFF4FF',
    borderColor: '#D3E4FE',
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
    backgroundColor: '#0F1C2C',
    borderColor: '#334155',
  },
  syncConnectedBadgeLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
  syncConnectedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#006D35',
  },

  // Check Any Bill Collapsible Card
  checkNewBillCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  checkNewBillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkNewBillTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },

  // Lookup Section & Utility Switcher
  lookupContent: {
    marginTop: 14,
  },
  utilitySwitcherWrap: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  utilitySwitcherDark: {
    backgroundColor: '#0F1C2C',
  },
  utilitySwitcherLight: {
    backgroundColor: '#EFF4FF',
  },
  utilitySwitcherTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  utilitySwitcherTabActiveElectric: {
    backgroundColor: '#059669',
  },
  utilitySwitcherTabActiveGas: {
    backgroundColor: '#0284C7',
  },
  utilitySwitcherTabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  utilitySwitcherTabTextActive: {
    color: '#FFFFFF',
  },
  utilitySwitcherTabTextInactiveDark: {
    color: '#94A3B8',
  },
  utilitySwitcherTabTextInactiveLight: {
    color: '#64748B',
  },
  bottomSpacer: {
    height: 80,
  },

  // Typography & Colors
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
  darkCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
  },
});

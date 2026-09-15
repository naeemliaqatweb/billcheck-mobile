import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  darkBg: {
    backgroundColor: '#0F1C2C',
  },
  lightBg: {
    backgroundColor: '#F8F9FF',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },

  // Top App Bar
  topAppBar: {
    height: 56,
    backgroundColor: '#0F1C2C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
  appTitleGroup: {
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  appSubtitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#62FF96',
    marginTop: 1,
  },
  proBadge: {
    backgroundColor: 'rgba(0, 109, 53, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(98, 255, 150, 0.35)',
  },
  proBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#62FF96',
    letterSpacing: 0.5,
  },
  topAppRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 27, 60, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(116, 119, 125, 0.3)',
  },
  liveText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#62FF96',
    letterSpacing: 0.5,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#62FF96',
  },
  topBoltBtn: {
    padding: 4,
  },

  // Main Canvas
  mainCanvas: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 14,
  },

  // Screen Title Row
  screenTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  screenHeadline: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  screenSubheadline: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  yearPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#001B3C',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(63, 255, 139, 0.4)',
  },
  yearPickerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#62FF96',
  },

  // Segmented Pill Switcher
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#001B3C',
    padding: 4,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(116, 119, 125, 0.25)',
  },
  segmentedBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 99,
  },
  segmentedBtnActive: {
    backgroundColor: '#006D35',
    shadowColor: '#3FFF8B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  segmentedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#778598',
  },
  segmentedTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // Meter Selector Chips
  meterSelectorSection: {
    marginTop: -2,
  },
  meterSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  meterSelectorTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  meterChipScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  meterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
  },
  meterChipActive: {
    backgroundColor: '#006D35',
    borderColor: '#3FFF8B',
  },
  meterChipDark: {
    backgroundColor: '#001B3C',
    borderColor: 'rgba(116, 119, 125, 0.3)',
  },
  meterChipLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D3E4FE',
  },
  meterChipText: {
    fontSize: 11.5,
    fontWeight: '700',
  },

  // Empty State Card
  emptyCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginVertical: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  demoMeterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#006D35',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#3FFF8B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  demoMeterBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // Action Buttons Row
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    marginBottom: 10,
  },
  actionBtnOutline: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  actionBtnOutlineDark: {
    backgroundColor: 'rgba(0, 27, 60, 0.5)',
    borderColor: 'rgba(116, 119, 125, 0.35)',
  },
  actionBtnOutlineLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C4C6CC',
  },
  actionBtnOutlineText: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionBtnPrimary: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#006D35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    shadowColor: '#3FFF8B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
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

  // Card surfaces (used by HistoryScreen empty states & legacy components)
  darkCard: {
    backgroundColor: '#132033',
    borderColor: '#24354D',
    borderWidth: 1,
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D3E4FE',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  // Light-mode segmented switcher
  segmentedContainerLight: {
    backgroundColor: '#EAEEF4',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },

  // Light-mode year picker button
  yearPickerBtnLight: {
    backgroundColor: '#EFF4FF',
    borderColor: '#C4C6CC',
  },
  yearPickerTextLight: {
    color: '#0B1C30',
  },

  // ── ConsumptionMetricsGrid legacy styles ──────────────────────
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  gridCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  metricHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gridCardLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gridCardVal: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  gridCardSub: {
    fontSize: 10.5,
    marginTop: 2,
  },
  diffBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 99,
  },
  higherBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  lowerBadge: {
    backgroundColor: 'rgba(5, 150, 105, 0.15)',
  },
  diffBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  higherText: {
    color: '#EF4444',
  },
  lowerText: {
    color: '#10B981',
  },
  peakCard: {
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  peakLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  peakVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#EF4444',
    marginTop: 6,
  },
  peakSub: {
    fontSize: 10,
    color: '#778598',
    marginTop: 2,
  },
  lowestCard: {
    borderColor: 'rgba(5, 150, 105, 0.2)',
  },
  lowestLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  lowestVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#059669',
    marginTop: 6,
  },
  lowestSub: {
    fontSize: 10,
    color: '#778598',
    marginTop: 2,
  },

  // ── EnergySavingTips legacy styles ───────────────────────────
  tipsCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  tipHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
  },
  tipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 12,
    color: '#F59E0B',
    marginTop: 1,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});

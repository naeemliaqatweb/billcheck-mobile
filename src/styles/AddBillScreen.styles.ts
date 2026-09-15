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

  // Deep Navy Header Area
  header: {
    backgroundColor: '#0C2B4E',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
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
    height: 44,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingRight: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  helpButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },

  // Main Scrollable Content
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },

  // Subtitle Context
  subtitleSection: {
    marginBottom: 14,
  },
  subtitleTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveGridBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: 'rgba(98, 255, 150, 0.15)',
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  liveGridBadgeText: {
    color: '#006D35',
    fontSize: 11,
    fontWeight: '700',
  },
  liveGridBadgeTextDark: {
    color: '#3FFF8B',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  mainSubtitle: {
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },
  receiptIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Segmented Type Switcher
  typeSegmentWrap: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 4,
    borderWidth: 1,
    marginBottom: 16,
  },
  typeSegmentWrapLight: {
    backgroundColor: '#E5EEFF',
    borderColor: '#D3E4FE',
  },
  typeSegmentWrapDark: {
    backgroundColor: '#0C2B4E',
    borderColor: '#1F2937',
  },
  typeSegmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 20,
  },
  typeSegmentBtnActive: {
    backgroundColor: '#0C2B4E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  typeSegmentBtnActiveDark: {
    backgroundColor: '#006D35',
  },
  typeSegmentText: {
    fontSize: 13,
    fontWeight: '600',
  },
  typeSegmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Form Card Container
  formCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  fieldBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  fieldBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  requiredText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },

  // 2-Column Inline Provider Grid inside Add Bill
  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  gridCard: {
    width: '48.5%', // Exactly 2 inline cards per row
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'relative',
    marginBottom: 8,
  },
  gridCardGas: {
    width: '48.5%',
  },
  gridCardDark: {
    backgroundColor: '#0F1C2C',
    borderColor: '#284163',
  },
  gridCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D5E2EE',
  },
  gridCardActiveDark: {
    backgroundColor: 'rgba(0, 109, 53, 0.25)',
    borderColor: '#3FFF8B',
  },
  gridCardActiveLight: {
    backgroundColor: '#ECFDF5',
    borderColor: '#059669',
  },
  gridLogoBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  gridLogoImg: {
    width: '100%',
    height: '100%',
  },
  gridInfoCol: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  gridCodeText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  gridRegionText: {
    fontSize: 9.5,
    marginTop: 1,
    lineHeight: 13,
  },
  gridActiveCheckBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Provider Selected Box (Legacy/Compact)
  providerSelectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  providerSelectedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  selectedLogoBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  selectedLogoImg: {
    width: '100%',
    height: '100%',
  },
  selectedCodeText: {
    fontSize: 14,
    fontWeight: '800',
  },
  selectedFullNameText: {
    fontSize: 11,
    marginTop: 1,
  },
  changeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  changeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#006D35',
  },
  changeBtnTextDark: {
    color: '#3FFF8B',
  },

  // Input Field
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    height: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  monoInput: {
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  validationHelperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    paddingHorizontal: 2,
  },
  formatText: {
    fontSize: 10.5,
    fontFamily: 'monospace',
  },
  validStatusText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#006D35',
  },
  validStatusTextDark: {
    color: '#3FFF8B',
  },

  // Helpful Visual Guidance Card
  guideCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  guideHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  guideIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0C2B4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  guideSubtitle: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },

  // Mockup Bill Snippet
  billMockupBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  mockupTopNavyBar: {
    backgroundColor: '#0C2B4E',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mockupTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  mockupTopTitle: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mockupTopTag: {
    color: '#94A3B8',
    fontSize: 9.5,
  },
  mockupGrid: {
    flexDirection: 'row',
    gap: 6,
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
  },
  mockupCol: {
    flex: 1,
    justifyContent: 'center',
  },
  mockupHighlightCol: {
    flex: 1.4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#006D35',
    backgroundColor: 'rgba(63, 255, 139, 0.15)',
    padding: 4,
    justifyContent: 'center',
  },
  mockupLabel: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  mockupHighlightLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#006D35',
    textTransform: 'uppercase',
  },
  mockupVal: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  mockupHighlightVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#004689',
    marginTop: 1,
    fontFamily: 'monospace',
  },
  mockupFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  mockupFooterName: {
    fontSize: 10,
    fontWeight: '600',
  },
  mockupFooterDue: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },

  // CTA Buttons
  primaryCtaBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#3FFF8B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#00E676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 109, 53, 0.3)',
    marginBottom: 10,
  },
  primaryCtaText: {
    color: '#0C2B4E',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  secondaryScanBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  secondaryScanBtnLight: {
    borderColor: '#0C2B4E',
    backgroundColor: 'transparent',
  },
  secondaryScanBtnDark: {
    borderColor: '#62FF96',
    backgroundColor: 'transparent',
  },
  secondaryScanText: {
    fontSize: 13.5,
    fontWeight: '700',
  },

  // Encryption Notice
  encryptionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  encryptionText: {
    fontSize: 11,
    fontWeight: '500',
  },

  // Shared Dark/Light helpers
  darkCard: {
    backgroundColor: '#122D4D',
    borderColor: '#284E77',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D5E2EE',
  },
  darkBox: {
    backgroundColor: '#122D4D',
    borderColor: '#284E77',
  },
  lightBox: {
    backgroundColor: '#EBF4FC',
    borderColor: '#CCE0F5',
  },
  darkInput: {
    backgroundColor: '#0C2B4E',
    borderColor: '#284E77',
  },
  lightInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D5E2EE',
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
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
  },
});

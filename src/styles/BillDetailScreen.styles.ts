import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkBg: {
    backgroundColor: '#070E18',
  },
  lightBg: {
    backgroundColor: '#F0F5FA',
  },
  contentContainer: {
    paddingBottom: 160, // Space for fixed bottom action bar
  },

  // Official Top Navigation Bar (Deep Navy #0C2B4E)
  headerNavyContainer: {
    backgroundColor: '#0C2B4E',
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(211, 228, 254, 0.15)',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerProviderLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(98, 255, 150, 0.6)',
  },
  headerCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(211, 228, 254, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleGroup: {
    justifyContent: 'center',
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#62FF96',
  },
  headerVerifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#62FF96',
    letterSpacing: 0.8,
  },
  headerMetaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(119, 133, 152, 0.25)',
  },
  metaFetchedGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaFetchedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  metaAuthenticText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#62FF96',
    letterSpacing: 0.6,
  },

  // Verification Banner Pill
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  bannerLight: {
    backgroundColor: '#EFF4FF',
    borderColor: '#D3E4FE',
  },
  bannerDark: {
    backgroundColor: '#132033',
    borderColor: '#24354D',
  },
  bannerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 10,
  },
  bannerProviderLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  bannerCompanyName: {
    fontSize: 12,
    fontWeight: '600',
  },
  bannerCompanyBadge: {
    backgroundColor: '#0C2B4E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  bannerCompanyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#62FF96',
    letterSpacing: 0.5,
  },

  // Main Content Deck
  mainDeck: {
    paddingHorizontal: 16,
    gap: 14,
    marginTop: 8,
  },

  // Card 1: Dual Zone Current Bill Summary
  summaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  summaryLightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C4C6CC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryDarkCard: {
    backgroundColor: '#0C2B4E',
    borderColor: '#24354D',
  },
  summaryHeroTopZone: {
    backgroundColor: '#0C2B4E',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(211, 228, 254, 0.15)',
  },
  heroAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroPayableLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroAmountNumberGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 3,
  },
  heroPkrCurrency: {
    fontSize: 13,
    fontWeight: '800',
    color: '#62FF96',
  },
  heroAmountValue: {
    fontSize: 30,
    fontWeight: '900',
    color: '#62FF96',
    letterSpacing: -0.5,
  },
  statusChipColumn: {
    alignItems: 'flex-end',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
  },
  statusChipUnpaid: {
    backgroundColor: '#DC2626',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusChipPaid: {
    backgroundColor: '#059669',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusDotUnpaid: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  statusDotPaid: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  statusChipTextUnpaid: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusChipTextPaid: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusSubText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#CBD5E1',
    marginTop: 3,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(211, 228, 254, 0.12)',
    marginVertical: 12,
  },
  hero2ColGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  heroInfoBox: {
    flex: 1,
    backgroundColor: '#213145',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(211, 228, 254, 0.08)',
  },
  heroInfoBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  heroInfoBoxLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroInfoBoxValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 3,
  },
  summaryBottomNotice: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryBottomNoticeLight: {
    backgroundColor: '#EFF4FF',
  },
  summaryBottomNoticeDark: {
    backgroundColor: '#132033',
  },
  surchargeNoticeLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  surchargeNoticeValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#BA1A1A',
  },

  // Universal Section Cards (White / Dark)
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  sectionLightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C4C6CC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionDarkCard: {
    backgroundColor: '#0F1C2C',
    borderColor: '#24354D',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
  },
  cardTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitleText: {
    fontSize: 15,
    fontWeight: '800',
  },
  cardRightBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cardRightBadgeLight: {
    backgroundColor: '#DCE9FF',
  },
  cardRightBadgeDark: {
    backgroundColor: '#1E293B',
  },
  cardRightBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#006D35',
  },
  cardRightBadgeTextNepra: {
    fontSize: 10,
    fontWeight: '800',
    color: '#006D35',
    letterSpacing: 0.5,
  },

  // Consumer Info Rows
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 9,
    gap: 12,
  },
  detailRowDashed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
    borderStyle: 'dashed',
    gap: 10,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 0,
    marginTop: 1,
  },
  detailValueBold: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
    flex: 1,
    textAlign: 'right',
    flexWrap: 'wrap',
  },
  detailValueAddress: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    flexWrap: 'wrap',
    lineHeight: 16,
  },
  monoRefChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  monoRefChipLight: {
    backgroundColor: '#EFF4FF',
    borderColor: '#D3E4FE',
  },
  monoRefChipDark: {
    backgroundColor: '#132033',
    borderColor: '#24354D',
  },
  monoRefText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '800',
  },

  // 2-Box Info Grid (Meter / Month)
  boxed2ColGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  subInfoBox: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  subInfoBoxLight: {
    backgroundColor: '#EFF4FF',
    borderColor: '#D3E4FE',
  },
  subInfoBoxDark: {
    backgroundColor: '#132033',
    borderColor: '#24354D',
  },
  subInfoBoxLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  subInfoBoxValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },

  // Units Consumed Box
  unitsBox: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  unitsBoxLight: {
    backgroundColor: '#F8F9FF',
    borderColor: '#D3E4FE',
  },
  unitsBoxDark: {
    backgroundColor: '#070E17',
    borderColor: '#24354D',
  },
  unitsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  unitsHeaderLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  unitsBigValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#006D35',
  },
  unitsUnitSuffix: {
    fontSize: 11,
    fontWeight: '600',
    color: '#778598',
  },
  splitProgressBar: {
    height: 8,
    borderRadius: 99,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: '#DCE9FF',
    marginVertical: 6,
  },
  barPeak: {
    backgroundColor: '#0C2B4E',
  },
  barOffPeak: {
    backgroundColor: '#006D35',
  },
  unitsLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendPeakDot: {
    width: 7,
    height: 7,
    borderRadius: 2,
    backgroundColor: '#0C2B4E',
  },
  legendOffPeakDot: {
    width: 7,
    height: 7,
    borderRadius: 2,
    backgroundColor: '#006D35',
  },
  legendText: {
    fontSize: 11,
    fontWeight: '500',
  },
  legendBoldText: {
    fontWeight: '800',
  },

  // Tariff Breakdown Items
  breakdownList: {
    marginTop: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.12)',
  },
  breakdownRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#94A3B8',
  },
  breakdownLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  breakdownAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
  netTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginHorizontal: -16,
    marginBottom: -16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  netTotalRowLight: {
    backgroundColor: '#EFF4FF',
  },
  netTotalRowDark: {
    backgroundColor: '#132033',
  },
  netTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  netTotalValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#006D35',
  },

  // Institutional Guarantee Note
  guaranteeCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  guaranteeLight: {
    backgroundColor: '#EFF4FF',
    borderColor: '#D3E4FE',
  },
  guaranteeDark: {
    backgroundColor: '#132033',
    borderColor: '#24354D',
  },
  guaranteeText: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
    flex: 1,
  },

  // Save Meter Action Card (Stitch Design)
  saveMeterCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveMeterCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C4C6CC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  saveMeterCardDark: {
    backgroundColor: '#0C2B4E',
    borderColor: '#24354D',
  },
  saveMeterCardSaved: {
    backgroundColor: 'rgba(0, 109, 53, 0.08)',
    borderColor: '#006D35',
  },
  saveMeterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  saveMeterIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveMeterIconBoxDark: {
    backgroundColor: '#132033',
  },
  saveMeterIconBoxSaved: {
    backgroundColor: '#006D35',
  },
  saveMeterTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  saveMeterSub: {
    fontSize: 10,
    marginTop: 1,
    color: '#CBD5E1',
  },
  saveMeterPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#0C2B4E',
  },
  saveMeterPillSaved: {
    backgroundColor: '#059669',
  },
  saveMeterPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  saveMeterPillTextSaved: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Fixed Bottom Action Bar (Stitch 100% Match)
  fixedBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  fixedBottomLight: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#D3E4FE',
  },
  fixedBottomDark: {
    backgroundColor: '#070E17',
    borderTopColor: '#24354D',
  },
  bottomButtons2Col: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  btnDownloadPdf: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  btnDownloadPdfText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  btnShareBill: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  btnShareLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0C2B4E',
  },
  btnShareDark: {
    backgroundColor: '#0C2B4E',
    borderColor: '#62FF96',
  },
  btnShareTextLight: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0C2B4E',
  },
  btnShareTextDark: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Direct Pay Quick Strip
  directPayCard: {
    backgroundColor: '#0C2B4E',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  directPayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  directPayLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  directPayChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  payPartnerChip: {
    backgroundColor: '#213145',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  payPartnerChipHighlight: {
    backgroundColor: '#213145',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(98, 255, 150, 0.3)',
  },
  payPartnerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  payPartnerTextHighlight: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Utility typography & helpers
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

import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
  },
  cardDark: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerDark: {
    backgroundColor: '#131F37',
    borderBottomColor: '#1E293B',
  },
  headerLight: {
    backgroundColor: '#F8FAFC',
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  closeBtnDark: {
    backgroundColor: '#1E293B',
  },
  closeBtnLight: {
    backgroundColor: '#E2E8F0',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  imageCard: {
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageCardDark: {
    backgroundColor: '#0A0F1D',
    borderColor: '#1E293B',
  },
  imageCardLight: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  imageTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  imageLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  imageLiveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  imageBoxHint: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  guideImage: {
    width: '100%',
    height: Math.min(100, (SCREEN_WIDTH - 64) * 0.26),
    borderRadius: 8,
  },
  highlightBox: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  highlightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  badgeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  highlightTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  highlightDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  tipsContainer: {
    borderRadius: 12,
    padding: 12,
  },
  tipsDark: {
    backgroundColor: '#131F37',
  },
  tipsLight: {
    backgroundColor: '#F8FAFC',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  footerDark: {
    backgroundColor: '#131F37',
    borderTopColor: '#1E293B',
  },
  footerLight: {
    backgroundColor: '#F8FAFC',
    borderTopColor: '#E2E8F0',
  },
  actionButton: {
    backgroundColor: '#006D35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  textDark: {
    color: '#F8FAFC',
  },
  textLight: {
    color: '#0F172A',
  },
  subDark: {
    color: '#94A3B8',
  },
  subLight: {
    color: '#64748B',
  },
  rtlText: {
    textAlign: 'right',
  },
});

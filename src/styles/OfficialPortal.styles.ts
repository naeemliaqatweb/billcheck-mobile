import { StyleSheet } from 'react-native';
import { COLORS } from './common.styles';

export const styles = StyleSheet.create({
  darkCard: {
    backgroundColor: COLORS.darkCard,
    borderColor: COLORS.darkBorder,
  },
  lightCard: {
    backgroundColor: COLORS.lightCard,
    borderColor: COLORS.lightBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  btnRowSm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  portalCard: {
    paddingTop: 4,
  },
  portalDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  portalRefBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  portalRefBoxDark: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  portalRefBoxLight: {
    backgroundColor: '#F1F5F9',
    borderColor: COLORS.lightBorder,
  },
  portalRefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  portalRefLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  portalRefNumber: {
    fontSize: 15,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 0.5,
  },
  portalCopyBtn: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  portalCopyBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  openPortalPrimaryBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  openPortalPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 2,
  },
  portalSubBtnText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  openPortalSecondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#38BDF8',
    alignItems: 'center',
    marginBottom: 12,
  },
  openPortalSecondaryText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  sourceCitationBox: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(100, 116, 139, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#64748B',
  },
  sourceCitationHeader: {
    fontSize: 11,
    fontWeight: '700',
  },
  sourceCitationText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#64748B',
    fontStyle: 'italic',
  },
  darkText: {
    color: COLORS.darkText,
  },
  lightText: {
    color: COLORS.lightText,
  },
  darkSub: {
    color: COLORS.darkSub,
  },
  lightSub: {
    color: COLORS.lightSub,
  },
  rtlText: {
    textAlign: 'right',
  },
});

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  btnRowSm: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  portalCard: {
    paddingTop: 4,
    gap: 10,
  },
  portalDesc: {
    fontSize: 11.5,
    lineHeight: 17,
    fontWeight: '500',
  },
  portalRefBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  portalRefBoxDark: {
    backgroundColor: '#0C2B4E',
    borderColor: '#24354D',
  },
  portalRefBoxLight: {
    backgroundColor: '#EFF4FF',
    borderColor: '#D3E4FE',
  },
  portalRefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  portalRefLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  portalRefNumber: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  portalCopyBtn: {
    backgroundColor: 'rgba(98, 255, 150, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(98, 255, 150, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginLeft: 8,
  },
  portalCopyBtnLight: {
    backgroundColor: 'rgba(0, 109, 53, 0.1)',
    borderColor: 'rgba(0, 109, 53, 0.25)',
  },
  portalCopyBtnText: {
    color: '#006D35',
    fontSize: 10.5,
    fontWeight: '800',
  },
  portalCopyBtnTextDark: {
    color: '#62FF96',
  },
  openPortalPrimaryBtn: {
    backgroundColor: '#059669',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  openPortalPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 2,
  },
  portalSubBtnText: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: 9.5,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  openPortalSecondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  openPortalSecondaryBtnLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0C2B4E',
  },
  openPortalSecondaryBtnDark: {
    backgroundColor: '#0C2B4E',
    borderColor: '#62FF96',
  },
  openPortalSecondaryText: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  sourceCitationBox: {
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#006D35',
    marginTop: 2,
  },
  sourceCitationBoxLight: {
    backgroundColor: '#EFF4FF',
  },
  sourceCitationBoxDark: {
    backgroundColor: '#0C2B4E',
  },
  sourceCitationHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#62FF96',
  },
  sourceCitationText: {
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 3,
    color: '#FFFFFF',
  },
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
    color: '#334155',
  },
  rtlText: {
    textAlign: 'right',
  },
});


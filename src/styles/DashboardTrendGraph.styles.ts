import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(116, 119, 125, 0.22)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  trendLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  trendValueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(63, 255, 139, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  trendValueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#62FF96',
  },
  graphContainer: {
    width: '100%',
    height: 60,
    position: 'relative',
    marginVertical: 4,
    overflow: 'hidden',
  },
  animatedMask: {
    height: 60,
    overflow: 'hidden',
  },
  animatedMaskLTR: {
    alignSelf: 'flex-start',
  },
  animatedMaskRTL: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  fixedSvgWrapper: {
    height: 60,
  },
  fixedSvgWrapperLTR: {},
  fixedSvgWrapperRTL: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  svg: {
    overflow: 'visible',
  },
  pulseCircle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(63, 255, 139, 0.5)',
  },
  monthsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 6,
  },
  monthText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  monthTextActive: {
    color: '#3FFF8B',
    fontWeight: '900',
  },
  rtlText: {
    textAlign: 'right',
  },
});

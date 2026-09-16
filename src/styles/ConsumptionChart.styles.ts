import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(119, 133, 152, 0.15)',
  },
  hintBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hintBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  hintBadgeTextDark: {
    color: '#62FF96',
  },
  hintBadgeTextLight: {
    color: '#047857',
  },
  hintText: {
    fontSize: 10,
    fontWeight: '500',
  },
  chartScroll: {
    paddingRight: 14,
    paddingLeft: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 145,
    paddingTop: 8,
    paddingBottom: 2,
    gap: 8,
  },
  barColumn: {
    width: 42,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  latestTag: {
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 3,
    marginBottom: 3,
  },
  latestTagDark: {
    backgroundColor: '#006D35',
  },
  latestTagLight: {
    backgroundColor: '#059669',
  },
  latestTagText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  tagPlaceholder: {
    height: 15,
  },
  unitLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  latestUnitLabel: {
    color: '#10B981',
    fontWeight: '900',
  },
  barTrack: {
    width: 16,
    height: 82,
    justifyContent: 'flex-end',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barTrackLight: {
    backgroundColor: '#E2E8F0',
  },
  barTrackDark: {
    backgroundColor: '#070E17',
  },
  barFill: {
    width: '100%',
    borderRadius: 5,
  },
  regularBar: {
    backgroundColor: '#38BDF8',
  },
  peakSummerBar: {
    backgroundColor: '#EF4444',
  },
  latestBar: {
    backgroundColor: '#10B981',
  },
  monthLabel: {
    fontSize: 10,
    marginTop: 5,
    fontWeight: '700',
  },
  latestMonthLabel: {
    color: '#10B981',
    fontWeight: '900',
  },
  yearLabel: {
    fontSize: 8.5,
    fontWeight: '600',
  },
  darkMonth: {
    color: '#CBD5E1',
  },
  lightMonth: {
    color: '#1E293B',
  },
  darkSub: {
    color: '#94A3B8',
  },
  lightSub: {
    color: '#334155',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(119, 133, 152, 0.15)',
    paddingTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

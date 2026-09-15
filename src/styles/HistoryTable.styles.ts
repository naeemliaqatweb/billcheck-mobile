import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
  },
  darkContainer: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  lightContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
  },
  darkText: {
    color: '#F8FAFC',
  },
  lightText: {
    color: '#0F172A',
  },
  darkSub: {
    color: '#94A3B8',
  },
  lightSub: {
    color: '#64748B',
  },
  badge12: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  darkStatBox: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  lightStatBox: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  statVal1: {
    fontSize: 16,
    fontWeight: '900',
    color: '#10B981',
  },
  statVal2: {
    fontSize: 16,
    fontWeight: '900',
    color: '#38BDF8',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 4,
  },
  darkHeader: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
  },
  lightHeader: {
    backgroundColor: '#F1F5F9',
  },
  thText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  darkTh: {
    color: '#94A3B8',
  },
  lightTh: {
    color: '#64748B',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 1.5,
  },
  evenDarkRow: {
    backgroundColor: 'rgba(30, 41, 59, 0.25)',
  },
  oddDarkRow: {
    backgroundColor: 'transparent',
  },
  evenLightRow: {
    backgroundColor: '#F8FAFC',
  },
  oddLightRow: {
    backgroundColor: '#FFFFFF',
  },
  latestDarkHighlight: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
  },
  latestLightHighlight: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: '#10B981',
    borderWidth: 1,
  },
  monthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  boldText: {
    fontWeight: '800',
    color: '#10B981',
  },
  currentBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 1,
  },
  unitsText: {
    fontSize: 12,
    fontWeight: '700',
  },
  diffText: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 1,
  },
  diffUp: {
    color: '#EF4444',
  },
  diffDown: {
    color: '#10B981',
  },
  amountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  boldAmount: {
    fontWeight: '800',
    color: '#F87171',
  },
  dateText: {
    fontSize: 9,
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  paidBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  unpaidBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  paidText: {
    color: '#10B981',
  },
  unpaidText: {
    color: '#EF4444',
  },
  rtlText: {
    textAlign: 'right',
  },
});

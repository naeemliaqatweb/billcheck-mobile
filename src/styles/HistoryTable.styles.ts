import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  darkContainer: {
    backgroundColor: '#132033',
    borderColor: '#24354D',
  },
  lightContainer: {
    backgroundColor: '#F8F9FF',
    borderColor: '#D3E4FE',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
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
  badge12: {
    fontSize: 10,
    fontWeight: '800',
    color: '#62FF96',
    backgroundColor: '#0F1C2C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  darkStatBox: {
    backgroundColor: '#0F1C2C',
    borderColor: '#24354D',
  },
  lightStatBox: {
    backgroundColor: '#EFF4FF',
    borderColor: '#D3E4FE',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  statVal1: {
    fontSize: 14,
    fontWeight: '900',
    color: '#62FF96',
  },
  statVal2: {
    fontSize: 14,
    fontWeight: '900',
    color: '#38BDF8',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 2,
  },
  darkHeader: {
    backgroundColor: '#0F1C2C',
  },
  lightHeader: {
    backgroundColor: '#DCE9FF',
  },
  thText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  darkTh: {
    color: '#778598',
  },
  lightTh: {
    color: '#1E293B',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginVertical: 1,
  },
  evenDarkRow: {
    backgroundColor: 'rgba(15, 28, 44, 0.4)',
  },
  oddDarkRow: {
    backgroundColor: 'transparent',
  },
  evenLightRow: {
    backgroundColor: '#EFF4FF',
  },
  oddLightRow: {
    backgroundColor: '#FFFFFF',
  },
  latestDarkHighlight: {
    backgroundColor: 'rgba(98, 255, 150, 0.1)',
    borderColor: 'rgba(98, 255, 150, 0.3)',
    borderWidth: 1,
  },
  latestLightHighlight: {
    backgroundColor: 'rgba(0, 109, 53, 0.08)',
    borderColor: '#006D35',
    borderWidth: 1,
  },
  monthText: {
    fontSize: 11,
    fontWeight: '600',
  },
  boldText: {
    fontWeight: '800',
    color: '#006D35',
  },
  currentBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#006D35',
  },
  unitsText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  diffText: {
    fontSize: 8.5,
    fontWeight: '700',
  },
  diffUp: {
    color: '#FF6B6B',
  },
  diffDown: {
    color: '#006D35',
  },
  amountText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  boldAmount: {
    fontWeight: '800',
    color: '#006D35',
  },
  dateText: {
    fontSize: 8.5,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paidBadge: {
    backgroundColor: 'rgba(0, 109, 53, 0.15)',
  },
  unpaidBadge: {
    backgroundColor: 'rgba(186, 26, 26, 0.15)',
  },
  statusBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
  },
  paidText: {
    color: '#006D35',
  },
  unpaidText: {
    color: '#FF6B6B',
  },
  rtlText: {
    textAlign: 'right',
  },
});


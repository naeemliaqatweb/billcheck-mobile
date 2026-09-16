import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  darkContainer: {
    backgroundColor: '#1E1B18',
    borderColor: '#78350F',
  },
  lightContainer: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  icon: {
    fontSize: 14,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
  },
  darkTitle: {
    color: '#FBBF24',
  },
  lightTitle: {
    color: '#92400E',
  },
  description: {
    fontSize: 11,
    lineHeight: 16,
  },
  darkDesc: {
    color: '#FDE68A',
  },
  lightDesc: {
    color: '#78350F',
  },
  policyLinkRow: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  policyLinkText: {
    fontSize: 11,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  darkLink: {
    color: '#62FF96',
  },
  lightLink: {
    color: '#006D35',
  },
  rtlText: {
    textAlign: 'right',
  },
  rtlRow: {
    alignSelf: 'flex-end',
  },
});

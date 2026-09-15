import { StyleSheet } from 'react-native';
import { COLORS } from './common.styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: COLORS.darkBg,
  },
  lightContainer: {
    backgroundColor: COLORS.lightBg,
  },
  contentArea: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    height: 62,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  darkBottomBar: {
    backgroundColor: '#0F1C2C',
    borderTopColor: 'rgba(116, 119, 125, 0.18)',
  },
  lightBottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
  tabIconWrap: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  activeTabIcon: {
    transform: [{ scale: 1.15 }],
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  activeTabLabel: {
    fontWeight: '700',
  },
  inactiveTabLabel: {
    fontWeight: '500',
  },
  darkTabLabel: {
    color: '#74777D',
  },
  lightTabLabel: {
    color: '#8E9196',
  },
  tabActiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -4,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeCount: {
    fontSize: 9,
    fontWeight: '900',
  },
});

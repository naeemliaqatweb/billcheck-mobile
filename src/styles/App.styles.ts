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
    height: 64,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  darkBottomBar: {
    backgroundColor: '#0B0F19',
    borderTopColor: COLORS.darkBorder,
  },
  lightBottomBar: {
    backgroundColor: COLORS.lightCard,
    borderTopColor: COLORS.lightBorder,
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
  },
  activeTabLabel: {
    fontWeight: '800',
  },
  darkTabLabel: {
    color: '#64748B',
  },
  lightTabLabel: {
    color: '#94A3B8',
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
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
});

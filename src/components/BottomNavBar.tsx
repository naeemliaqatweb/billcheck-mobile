import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AppIcon } from './AppIcon';
import { styles } from '../styles/App.styles';

export type TabName = 'home' | 'saved' | 'analytics' | 'settings';

interface BottomNavBarProps {
  activeTab: TabName;
  onSelectTab: (tab: TabName) => void;
  savedCount: number;
  darkMode: boolean;
  labels: {
    home: string;
    saved: string;
    analytics: string;
    settings: string;
  };
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  darkMode,
  labels,
}) => {
  const inactiveColor = darkMode ? '#64748B' : '#94A3B8';

  const tabs: {
    id: TabName;
    label: string;
    icon: string;
    color: string;
    badge?: number;
  }[] = [
    {
      id: 'home',
      label: labels.home,
      icon: 'home',
      color: '#0284C7',
    },
    {
      id: 'saved',
      label: labels.saved,
      icon: 'bookmark',
      color: '#10B981',
      badge: savedCount,
    },
    {
      id: 'analytics',
      label: labels.analytics,
      icon: 'stats',
      color: '#6366F1',
    },
    {
      id: 'settings',
      label: labels.settings,
      icon: 'settings',
      color: '#F59E0B',
    },
  ];

  return (
    <View style={[styles.bottomBar, darkMode ? styles.darkBottomBar : styles.lightBottomBar]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const iconColor = isActive ? tab.color : inactiveColor;

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => onSelectTab(tab.id)}
            activeOpacity={0.7}
          >
            <View style={styles.tabIconWrap}>
              <AppIcon name={tab.icon} size={22} color={iconColor} />
              {!!tab.badge && tab.badge > 0 && (
                <View style={[styles.badge, { backgroundColor: tab.color }]}>
                  <Text style={styles.badgeCount}>{tab.badge}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabLabel,
                isActive
                  ? [styles.activeTabLabel, { color: tab.color }]
                  : darkMode
                  ? styles.darkTabLabel
                  : styles.lightTabLabel,
              ]}
            >
              {tab.label}
            </Text>
            {isActive ? (
              <View style={[styles.tabActiveDot, { backgroundColor: tab.color }]} />
            ) : (
              <View style={{ height: 4, marginTop: 2 }} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

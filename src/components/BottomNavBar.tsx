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
  // Uniform active & inactive brand colors across all tabs (matching Navy & Emerald design)
  const activeColor = darkMode ? '#3FFF8B' : '#006D35';
  const inactiveColor = darkMode ? '#7E8B9B' : '#486581';

  const tabs: {
    id: TabName;
    label: string;
    icon: string;
    badge?: number;
  }[] = [
    {
      id: 'home',
      label: labels.home,
      icon: 'home',
    },
    {
      id: 'saved',
      label: labels.saved,
      icon: 'history',
      badge: savedCount,
    },
    {
      id: 'analytics',
      label: labels.analytics,
      icon: 'monitoring',
    },
    {
      id: 'settings',
      label: labels.settings,
      icon: 'settings',
    },
  ];

  return (
    <View style={[styles.bottomBar, darkMode ? styles.darkBottomBar : styles.lightBottomBar]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const color = isActive ? activeColor : inactiveColor;

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => onSelectTab(tab.id)}
            activeOpacity={0.7}
          >
            <View style={styles.tabIconWrap}>
              <AppIcon
                name={tab.icon}
                size={22}
                color={color}
                strokeWidth={isActive ? 2.5 : 2.0}
              />
              {!!tab.badge && tab.badge > 0 && (
                <View style={[styles.badge, { backgroundColor: activeColor }]}>
                  <Text
                    style={[
                      styles.badgeCount,
                      { color: darkMode ? '#003919' : '#FFFFFF' },
                    ]}
                  >
                    {tab.badge}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabLabel,
                { color },
                isActive ? styles.activeTabLabel : styles.inactiveTabLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

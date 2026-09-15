import React, { useState, useEffect, useCallback } from 'react';
import {
  StatusBar,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { BillDetailScreen } from './src/screens/BillDetailScreen';
import { SavedBillsScreen } from './src/screens/SavedBillsScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { BillData, SavedMeter } from './src/types/bill';
import { TRANSLATIONS, Language } from './src/i18n/translations';
import { StorageService } from './src/services/storage';
import { NotificationService } from './src/services/notification';
import { CustomPopup, PopupConfig } from './src/components/CustomPopup';
import { BottomNavBar, TabName } from './src/components/BottomNavBar';
import { styles } from './src/styles/App.styles';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentBill, setCurrentBill] = useState<BillData | null>(null);
  const [savedMeters, setSavedMeters] = useState<SavedMeter[]>([]);
  const [popup, setPopup] = useState<PopupConfig>({
    visible: false,
    title: '',
    message: '',
  });

  const t = TRANSLATIONS[language];
  const isUrdu = language === 'ur';

  // Load preferences and saved meters on initial launch
  const loadInitialData = useCallback(async () => {
    const [savedLang, savedTheme, meters] = await Promise.all([
      StorageService.getLanguage(),
      StorageService.getTheme(),
      StorageService.getSavedMeters(),
    ]);
    setLanguage(savedLang);
    setDarkMode(savedTheme === 'dark');
    setSavedMeters(meters);

    // Auto sync saved meters in background for newly released monthly bills
    try {
      const newNotifs = await NotificationService.autoSyncSavedMeters(savedLang === 'ur');
      if (newNotifs.length > 0) {
        const freshMeters = await StorageService.getSavedMeters();
        setSavedMeters(freshMeters);
        const latest = newNotifs[0];
        setPopup({
          visible: true,
          type: 'bill-alert',
          title: latest.title,
          message: latest.message,
          primaryText: savedLang === 'ur' ? 'بل دیکھیں' : 'View Bill',
          secondaryText: savedLang === 'ur' ? 'ٹھیک ہے' : 'Dismiss',
          onPrimaryPress: async () => {
            setPopup((p) => ({ ...p, visible: false }));
            if (latest.company && latest.referenceNumber) {
              const cached = await StorageService.getCachedBill(latest.company, latest.referenceNumber);
              if (cached) setCurrentBill(cached);
            }
          },
          onClose: () => setPopup((p) => ({ ...p, visible: false })),
        });
      }
    } catch {
      // background auto-sync fails gracefully
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleToggleLanguage = async (newLang: Language) => {
    setLanguage(newLang);
    await StorageService.setLanguage(newLang);
  };

  const handleToggleTheme = async (isDark: boolean) => {
    setDarkMode(isDark);
    await StorageService.setTheme(isDark ? 'dark' : 'light');
  };

  const handleRefreshSaved = async () => {
    const meters = await StorageService.getSavedMeters();
    setSavedMeters(meters);
  };

  const handleBillChecked = (bill: BillData) => {
    setCurrentBill(bill);
  };

  const renderContent = () => {
    if (currentBill) {
      return (
        <BillDetailScreen
          bill={currentBill}
          language={language}
          darkMode={darkMode}
          onBack={() => setCurrentBill(null)}
          onSaveMeterComplete={handleRefreshSaved}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            language={language}
            darkMode={darkMode}
            savedMeters={savedMeters}
            onBillChecked={handleBillChecked}
            onRefreshSaved={handleRefreshSaved}
            onToggleLanguage={handleToggleLanguage}
            onToggleTheme={handleToggleTheme}
            onNavigateAnalytics={() => setActiveTab('analytics')}
          />
        );
      case 'saved':
        return (
          <SavedBillsScreen
            savedMeters={savedMeters}
            language={language}
            darkMode={darkMode}
            onSelectMeter={handleBillChecked}
            onRefreshSaved={handleRefreshSaved}
          />
        );
      case 'analytics':
        return (
          <HistoryScreen
            currentBill={currentBill}
            savedMeters={savedMeters}
            language={language}
            darkMode={darkMode}
            onSelectBill={handleBillChecked}
            onNavigateHome={() => setActiveTab('home')}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            language={language}
            darkMode={darkMode}
            onToggleLanguage={handleToggleLanguage}
            onToggleTheme={handleToggleTheme}
          />
        );
      default:
        return null;
    }
  };

  if (showSplash) {
    return (
      <SafeAreaProvider>
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
        <StatusBar
          barStyle={darkMode ? 'light-content' : 'dark-content'}
        />

        {/* Main View Area */}
        <View style={styles.contentArea}>{renderContent()}</View>

        {/* Bottom Navigation Bar */}
        {!currentBill && (
          <BottomNavBar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            savedCount={savedMeters.length}
            darkMode={darkMode}
            labels={{
              home: t.tabHome,
              saved: t.tabSaved,
              analytics: t.tabAnalytics,
              settings: t.tabSettings,
            }}
          />
        )}

        {/* Global Animated Popup Modal */}
        <CustomPopup
          {...popup}
          darkMode={darkMode}
          isUrdu={isUrdu}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


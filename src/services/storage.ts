import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedMeter, BillData } from '../types/bill';
import { Language } from '../i18n/translations';

const KEYS = {
  SAVED_METERS: '@pakbill_saved_meters',
  BILL_CACHE_PREFIX: '@pakbill_cache_',
  LAST_CHECKED_BILL: '@pakbill_last_checked_bill',
  LANGUAGE: '@pakbill_language',
  THEME: '@pakbill_theme',
};

export const StorageService = {
  // Get all saved meters
  async getSavedMeters(): Promise<SavedMeter[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.SAVED_METERS);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  },

  // Save or update a meter
  async saveMeter(meter: SavedMeter): Promise<boolean> {
    try {
      const meters = await this.getSavedMeters();
      const index = meters.findIndex((m) => m.referenceNumber === meter.referenceNumber && m.company === meter.company);
      if (index >= 0) {
        meters[index] = { ...meters[index], ...meter };
      } else {
        meters.unshift(meter);
      }
      await AsyncStorage.setItem(KEYS.SAVED_METERS, JSON.stringify(meters));
      return true;
    } catch {
      return false;
    }
  },

  // Delete a saved meter
  async deleteMeter(id: string): Promise<boolean> {
    try {
      const meters = await this.getSavedMeters();
      const filtered = meters.filter((m) => m.id !== id);
      await AsyncStorage.setItem(KEYS.SAVED_METERS, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  },

  // Cache bill data with timestamp
  async cacheBill(bill: BillData): Promise<void> {
    try {
      const key = `${KEYS.BILL_CACHE_PREFIX}${bill.company}_${bill.referenceNo}`;
      const payload = {
        ...bill,
        fetchedAt: bill.fetchedAt || new Date().toISOString(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(payload));
      await AsyncStorage.setItem(KEYS.LAST_CHECKED_BILL, JSON.stringify(payload));
    } catch {
      // ignore
    }
  },

  // Get last checked bill
  async getLastCheckedBill(): Promise<(BillData & { fetchedAt?: string }) | null> {
    try {
      const json = await AsyncStorage.getItem(KEYS.LAST_CHECKED_BILL);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  },

  async setLastCheckedBill(bill: BillData): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LAST_CHECKED_BILL, JSON.stringify(bill));
    } catch {
      // ignore
    }
  },

  // Get cached bill (includes fetchedAt for TTL check)
  async getCachedBill(company: string, referenceNo: string): Promise<(BillData & { fetchedAt?: string }) | null> {
    try {
      const key = `${KEYS.BILL_CACHE_PREFIX}${company}_${referenceNo}`;
      const json = await AsyncStorage.getItem(key);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  },

  // Clear cache for a specific bill (force refresh)
  async clearBillCache(company: string, referenceNo: string): Promise<void> {
    try {
      const key = `${KEYS.BILL_CACHE_PREFIX}${company}_${referenceNo}`;
      await AsyncStorage.removeItem(key);
    } catch {
      // ignore
    }
  },

  // Get cache age in minutes (for UI display)
  async getCacheAgeMinutes(company: string, referenceNo: string): Promise<number | null> {
    try {
      const cached = await this.getCachedBill(company, referenceNo);
      if (!cached?.fetchedAt) return null;
      return Math.round((Date.now() - new Date(cached.fetchedAt).getTime()) / 60000);
    } catch {
      return null;
    }
  },

  // Language setting
  async getLanguage(): Promise<Language> {
    try {
      const lang = await AsyncStorage.getItem(KEYS.LANGUAGE);
      return (lang === 'ur' || lang === 'en') ? lang : 'en';
    } catch {
      return 'en';
    }
  },

  async setLanguage(lang: Language): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
    } catch {
      // ignore
    }
  },

  // Theme setting
  async getTheme(): Promise<'dark' | 'light'> {
    try {
      const theme = await AsyncStorage.getItem(KEYS.THEME);
      return (theme === 'dark' || theme === 'light') ? theme : 'dark';
    } catch {
      return 'dark';
    }
  },

  async setTheme(theme: 'dark' | 'light'): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.THEME, theme);
    } catch {
      // ignore
    }
  },
};

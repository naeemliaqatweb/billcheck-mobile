import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedMeter, BillData } from '../types/bill';
import { Language } from '../i18n/translations';

const KEYS = {
  SAVED_METERS: '@pakbill_saved_meters',
  BILL_CACHE_PREFIX: '@pakbill_cache_',
  PDF_HTML_CACHE_PREFIX: '@pakbill_pdf_html_',
  LAST_CHECKED_BILL: '@pakbill_last_checked_bill',
  LANGUAGE: '@pakbill_language',
  THEME: '@pakbill_theme',
  NOTIFICATIONS: '@pakbill_notifications',
};

export const StorageService = {
  // Get all saved meters (purges any legacy dummy/seed meters)
  async getSavedMeters(): Promise<SavedMeter[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.SAVED_METERS);
      if (!json) return [];
      const meters: SavedMeter[] = JSON.parse(json);
      const DUMMY_IDS = ['meter_lesco_1', 'meter_sngpl_2', 'meter_ke_3', 'meter_iesco_4'];
      const DUMMY_REFS = [
        '04 1152 0984 201',
        '98 4210 5519 100',
        '01 9823 4410 392',
        '08 1234 5678 901',
        '0411520984201',
        '9842105519100',
        '0198234410392',
        '0812345678901',
      ];

      const realMeters = meters.filter(
        (m) =>
          !DUMMY_IDS.includes(m.id) &&
          !DUMMY_REFS.includes(m.referenceNumber) &&
          !DUMMY_REFS.includes(m.referenceNumber.replace(/\s+/g, ''))
      );

      if (realMeters.length !== meters.length) {
        await AsyncStorage.setItem(KEYS.SAVED_METERS, JSON.stringify(realMeters));
      }
      return realMeters;
    } catch {
      return [];
    }
  },

  // Clear all saved meters
  async clearAllSavedMeters(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.SAVED_METERS);
      await AsyncStorage.removeItem(KEYS.LAST_CHECKED_BILL);
    } catch {
      // ignore
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

  // Save generated/scraped duplicate bill HTML for instant (<100ms) offline/repeated PDF opening
  async cachePdfHtml(company: string, referenceNo: string, html: string, billMonth?: string): Promise<void> {
    try {
      const cleanRef = referenceNo.replace(/[^0-9a-zA-Z]/g, '').trim();
      const comp = company.toUpperCase();
      const monthKey = billMonth ? `_${billMonth.replace(/\s+/g, '')}` : '';
      const key = `${KEYS.PDF_HTML_CACHE_PREFIX}${comp}_${cleanRef}${monthKey}`;
      await AsyncStorage.setItem(key, html);
      // Also store fallback key without month for general hit
      if (monthKey) {
        await AsyncStorage.setItem(`${KEYS.PDF_HTML_CACHE_PREFIX}${comp}_${cleanRef}`, html);
      }
    } catch {
      // ignore
    }
  },

  // Retrieve cached bill HTML if available
  async getCachedPdfHtml(company: string, referenceNo: string, billMonth?: string): Promise<string | null> {
    try {
      const cleanRef = referenceNo.replace(/[^0-9a-zA-Z]/g, '').trim();
      const comp = company.toUpperCase();
      if (billMonth) {
        const monthKey = `_${billMonth.replace(/\s+/g, '')}`;
        const specificHtml = await AsyncStorage.getItem(`${KEYS.PDF_HTML_CACHE_PREFIX}${comp}_${cleanRef}${monthKey}`);
        if (specificHtml) return specificHtml;
      }
      return await AsyncStorage.getItem(`${KEYS.PDF_HTML_CACHE_PREFIX}${comp}_${cleanRef}`);
    } catch {
      return null;
    }
  },

  // Clear PDF cache
  async clearPdfCache(company?: string, referenceNo?: string): Promise<void> {
    try {
      if (company && referenceNo) {
        const cleanRef = referenceNo.replace(/[^0-9a-zA-Z]/g, '').trim();
        const comp = company.toUpperCase();
        await AsyncStorage.removeItem(`${KEYS.PDF_HTML_CACHE_PREFIX}${comp}_${cleanRef}`);
      } else {
        const keys = await AsyncStorage.getAllKeys();
        const pdfKeys = keys.filter((k) => k.startsWith(KEYS.PDF_HTML_CACHE_PREFIX));
        if (pdfKeys.length > 0) {
          await Promise.all(pdfKeys.map((k) => AsyncStorage.removeItem(k)));
        }
      }
    } catch {
      // ignore
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

  // Notification settings
  async getNotifications(): Promise<boolean> {
    try {
      const val = await AsyncStorage.getItem(KEYS.NOTIFICATIONS);
      return val === null ? true : val === 'true';
    } catch {
      return true;
    }
  },

  async setNotifications(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.NOTIFICATIONS, enabled ? 'true' : 'false');
    } catch {
      // ignore
    }
  },

  // Reset entire app storage / cache
  async resetAppAndCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter((k) => k.startsWith('@pakbill'));
      if (appKeys.length > 0) {
        await Promise.all(appKeys.map((k) => AsyncStorage.removeItem(k)));
      }
    } catch {
      // ignore
    }
  },
};

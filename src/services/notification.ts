import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from './storage';
import { ApiService } from './api';

const NOTIFICATIONS_STORAGE_KEY = '@pakbill_notifications_v1';
const { BillNotificationModule } = NativeModules;

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  company: string;
  referenceNumber: string;
  isRead: boolean;
  timestamp: string;
  billMonth?: string;
  billAmount?: number;
}

export const NotificationService = {
  /**
   * Triggers an authentic Android system tray notification (like WhatsApp/SMS).
   */
  async triggerSystemNotification(title: string, message: string, tag?: string): Promise<boolean> {
    if (Platform.OS !== 'android' || !BillNotificationModule) {
      return false;
    }
    try {
      const shown = await BillNotificationModule.showLocalNotification(title, message, tag || 'bill_alert');
      return !!shown;
    } catch {
      return false;
    }
  },

  /**
   * Check if notification permission is granted (Android 13+)
   */
  async hasNotificationPermission(): Promise<boolean> {
    if (Platform.OS !== 'android' || !BillNotificationModule) {
      return true;
    }
    try {
      return await BillNotificationModule.hasNotificationPermission();
    } catch {
      return true;
    }
  },

  /**
   * Predicts the approximate date when the next month's bill will be generated.
   * Based on the meter's recurring billing cycle (issue/due date).
   */
  predictNextBillReleaseDate(lastDueDate?: string, isUrdu = false): string {
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsUr = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 1);
    const nextMonthIdx = nextDate.getMonth();

    // If due date contains a day (e.g. "22 Sep" or "2024-09-22"), bill usually arrives 10-12 days before due date
    let estimatedDay = 10;
    if (lastDueDate) {
      const match = lastDueDate.match(/\b([0-2]?[0-9]|3[01])\b/);
      if (match) {
        const day = parseInt(match[1], 10);
        estimatedDay = Math.max(5, day - 10);
      }
    }

    if (isUrdu) {
      return `${estimatedDay} سے ${estimatedDay + 4} ${monthsUr[nextMonthIdx]}`;
    }
    return `${estimatedDay}th - ${estimatedDay + 4}th ${monthsEn[nextMonthIdx]}`;
  },

  async getNotifications(): Promise<AppNotification[]> {
    try {
      const raw = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async saveNotifications(list: AppNotification[]): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  },

  async getUnreadCount(): Promise<number> {
    const list = await this.getNotifications();
    return list.filter(n => !n.isRead).length;
  },

  async markAsRead(id: string): Promise<void> {
    const list = await this.getNotifications();
    const updated = list.map(n => (n.id === id ? { ...n, isRead: true } : n));
    await this.saveNotifications(updated);
  },

  async markAllAsRead(): Promise<void> {
    const list = await this.getNotifications();
    const updated = list.map(n => ({ ...n, isRead: true }));
    await this.saveNotifications(updated);
  },

  async addNotification(notif: Omit<AppNotification, 'id' | 'isRead' | 'timestamp'>): Promise<AppNotification> {
    const list = await this.getNotifications();
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      isRead: false,
      timestamp: new Date().toISOString(),
    };
    const updated = [newNotif, ...list].slice(0, 30); // keep last 30
    await this.saveNotifications(updated);
    return newNotif;
  },

  /**
   * Auto-Sync: Checks saved meters for newly released monthly bills.
   * If a meter's latest bill month has changed:
   * 1. Updates meter record & caches the fresh bill (replaces old cache).
   * 2. Adds in-app notification.
   * 3. Triggers Android native system tray notification (like WhatsApp).
   */
  async autoSyncSavedMeters(isUrdu = false): Promise<AppNotification[]> {
    const newNotifs: AppNotification[] = [];
    try {
      const savedMeters = await StorageService.getSavedMeters();
      if (savedMeters.length === 0) return [];

      for (const meter of savedMeters) {
        try {
          const fresh = await ApiService.fetchBill(meter.company, meter.referenceNumber, false);
          if (fresh && fresh.billMonth) {
            const hasNewBill =
              (!meter.lastBillMonth || meter.lastBillMonth !== fresh.billMonth) &&
              fresh.payableWithinDueDate > 0;

            if (hasNewBill) {
              // Update saved meter record
              await StorageService.saveMeter({
                ...meter,
                lastBillAmount: fresh.payableWithinDueDate,
                lastDueDate: fresh.dueDate,
                lastBillStatus: fresh.billStatus,
                lastBillMonth: fresh.billMonth,
              });

              // Overwrite / refresh cache with the newly released bill
              await StorageService.cacheBill(fresh);

              const title = isUrdu
                ? `⚡ نیا بل جاری: ${meter.nickname || meter.company}`
                : `⚡ New Bill Released: ${meter.nickname || meter.company}`;

              const message = isUrdu
                ? `${meter.company} نے ${fresh.billMonth} کا نیا بل جاری کر دیا ہے۔ کل رقم: Rs. ${fresh.payableWithinDueDate.toLocaleString()} (آخری تاریخ: ${fresh.dueDate})`
                : `${meter.company} has issued your new bill for ${fresh.billMonth}. Amount: Rs. ${fresh.payableWithinDueDate.toLocaleString()} (Due: ${fresh.dueDate})`;

              // 1. In-App Notification Store
              const notif = await this.addNotification({
                title,
                message,
                company: meter.company,
                referenceNumber: meter.referenceNumber,
                billMonth: fresh.billMonth,
                billAmount: fresh.payableWithinDueDate,
              });
              newNotifs.push(notif);

              // 2. Android Native System Push Notification (System Tray)
              await this.triggerSystemNotification(
                title,
                message,
                `bill_${meter.company}_${meter.referenceNumber}`
              );
            }
          }
        } catch {
          // ignore single meter sync failure
        }
      }
    } catch {
      // ignore
    }
    return newNotifs;
  },
};

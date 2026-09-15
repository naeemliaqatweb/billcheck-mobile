import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from './storage';
import { ApiService } from './api';

const NOTIFICATIONS_STORAGE_KEY = '@pakbill_notifications_v1';

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
   * If a meter's latest bill month has changed or is updated, creates a notification.
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
              await StorageService.saveMeter({
                ...meter,
                lastBillAmount: fresh.payableWithinDueDate,
                lastDueDate: fresh.dueDate,
                lastBillStatus: fresh.billStatus,
                lastBillMonth: fresh.billMonth,
              });

              const notif = await this.addNotification({
                title: isUrdu
                  ? `⚡ نیا بل جاری: ${meter.nickname}`
                  : `⚡ New Bill Released: ${meter.nickname}`,
                message: isUrdu
                  ? `${meter.company} نے ${fresh.billMonth} کا نیا بل جاری کر دیا ہے۔ کل رقم: Rs. ${fresh.payableWithinDueDate.toLocaleString()} (آخری تاریخ: ${fresh.dueDate})`
                  : `${meter.company} has issued your new bill for ${fresh.billMonth}. Amount: Rs. ${fresh.payableWithinDueDate.toLocaleString()} (Due: ${fresh.dueDate})`,
                company: meter.company,
                referenceNumber: meter.referenceNumber,
                billMonth: fresh.billMonth,
                billAmount: fresh.payableWithinDueDate,
              });
              newNotifs.push(notif);
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

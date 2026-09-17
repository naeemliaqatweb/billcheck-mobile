import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from './storage';
import { ApiService } from './api';
import { getMeterDisplayName } from '../utils/meterUtils';

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

import { PermissionsAndroid } from 'react-native';

export const NotificationService = {
  /**
   * Requests Android 13+ (API 33+) POST_NOTIFICATIONS permission
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;
    try {
      if (BillNotificationModule?.requestNotificationPermission) {
        await BillNotificationModule.requestNotificationPermission();
      }
      if (Platform.Version >= 33) {
        const check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        if (check) return true;
        const res = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Bill Release & Due Date Alerts',
            message: 'BillCheck PK needs notification access to alert you when your monthly bill is released and before the due date.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          }
        );
        return res === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Triggers an authentic Android system tray notification (like WhatsApp/SMS).
   */
  async triggerSystemNotification(title: string, message: string, tag?: string): Promise<boolean> {
    if (Platform.OS !== 'android' || !BillNotificationModule) {
      return false;
    }
    try {
      await this.requestNotificationPermission();
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
      if (Platform.Version >= 33) {
        return await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      }
      return await BillNotificationModule.hasNotificationPermission();
    } catch {
      return true;
    }
  },

  /**
   * Trigger notification when a new meter is added by the user (with bill amount & due date)
   */
  async notifyMeterAdded(
    meter: {
      nickname?: string;
      company: string;
      referenceNumber: string;
      consumerName?: string;
      lastBillAmount?: number;
      lastDueDate?: string;
      lastBillMonth?: string;
      lastBillStatus?: string;
    },
    isUrdu = false
  ): Promise<void> {
    const display = getMeterDisplayName(meter);
    const title = isUrdu
      ? `⚡ میٹر محفوظ ہو گیا: ${display}`
      : `⚡ Meter Added: ${display}`;

    const amount = meter.lastBillAmount ?? 0;
    const isPaid = meter.lastBillStatus === 'paid';
    const statusTag = isPaid ? (isUrdu ? ' (ادا شدہ)' : ' (Paid)') : (isUrdu ? ' (غیر ادا شدہ)' : ' (Unpaid)');
    const amountStr = amount > 0
      ? `Rs. ${amount.toLocaleString()}${statusTag}`
      : (isPaid ? (isUrdu ? 'ادا شدہ' : 'Paid') : 'Rs. 0');
    const dueStr = meter.lastDueDate ? (isUrdu ? ` • آخری تاریخ: ${meter.lastDueDate}` : ` • Due: ${meter.lastDueDate}`) : '';

    const message = isUrdu
      ? `${meter.company} کا ریفرنس نمبر ${meter.referenceNumber} محفوظ ہو گیا۔ بل کی رقم: ${amountStr}${dueStr}۔ نوٹیفیکیشنز فعال ہیں۔`
      : `Ref #${meter.referenceNumber} for ${meter.company} saved. Bill Amount: ${amountStr}${dueStr}. Alerts active.`;

    await this.addNotification({
      title,
      message,
      company: meter.company,
      referenceNumber: meter.referenceNumber,
      billMonth: meter.lastBillMonth,
      billAmount: meter.lastBillAmount,
    });

    await this.triggerSystemNotification(title, message, `meter_added_${meter.referenceNumber}`);
  },

  /**
   * Trigger notification when bill PDF is ready in background
   */
  async notifyPdfReady(
    bill: {
      company: string;
      referenceNo: string;
      consumerName?: string;
      payableWithinDueDate?: number;
      billMonth?: string;
    },
    isUrdu = false
  ): Promise<void> {
    const cleanRef = bill.referenceNo.replace(/[^0-9a-zA-Z]/g, '').trim();
    const title = isUrdu
      ? `📄 بل پی ڈی ایف تیار ہے: ${bill.company}`
      : `📄 Bill PDF Ready: ${bill.company}`;

    const amountStr = bill.payableWithinDueDate ? ` (Rs. ${bill.payableWithinDueDate.toLocaleString()})` : '';
    const message = isUrdu
      ? `${bill.company} ریفرنس #${cleanRef} کا آفیشل بل پی ڈی ایف کامیابی سے تیار ہو گیا ہے${amountStr}۔ ٹیپ کر کے دیکھیں۔`
      : `Official PDF for ${bill.company} (Ref #${cleanRef}) is ready${amountStr}. Tap to open.`;

    await this.addNotification({
      title,
      message,
      company: bill.company,
      referenceNumber: cleanRef,
      billMonth: bill.billMonth,
      billAmount: bill.payableWithinDueDate,
    });

    await this.triggerSystemNotification(title, message, `pdf_ready_${cleanRef}`);
  },

  /**
   * Checks saved meters and triggers reminder notification if due date is within 3 days.
   */
  async checkDueDateReminders(isUrdu = false): Promise<AppNotification[]> {
    const reminders: AppNotification[] = [];
    try {
      const savedMeters = await StorageService.getSavedMeters();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const meter of savedMeters) {
        if (meter.lastBillStatus === 'paid' || !meter.lastDueDate) continue;

        // Parse due date (e.g. "22 Sep 2026", "2026-09-22", "22-09-2026")
        let dueDateObj: Date | null = null;
        const parts = meter.lastDueDate.match(/(\d{1,2})[\s\-/]+(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|[0-9]{1,2})[\s\-/]+(\d{2,4})/i);
        if (parts) {
          const d = parseInt(parts[1], 10);
          const mStr = parts[2].toUpperCase();
          const y = parseInt(parts[3].length === 2 ? `20${parts[3]}` : parts[3], 10);
          const monMap: Record<string, number> = {
            JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
            JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
          };
          const m = monMap[mStr] !== undefined ? monMap[mStr] : (parseInt(mStr, 10) - 1);
          dueDateObj = new Date(y, m, d);
        } else {
          const parsed = Date.parse(meter.lastDueDate);
          if (!isNaN(parsed)) dueDateObj = new Date(parsed);
        }

        if (dueDateObj) {
          dueDateObj.setHours(0, 0, 0, 0);
          const diffMs = dueDateObj.getTime() - today.getTime();
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

          // Trigger reminder if due within 3 days (0, 1, 2, 3 days)
          if (diffDays >= 0 && diffDays <= 3) {
            const reminderKey = `@pakbill_due_reminded_${meter.id}_${today.toISOString().slice(0, 10)}`;
            const alreadyReminded = await AsyncStorage.getItem(reminderKey);
            if (!alreadyReminded) {
              await AsyncStorage.setItem(reminderKey, 'true');

              const daysText = diffDays === 0
                ? (isUrdu ? 'آج آخری دن ہے' : 'Today is the last day')
                : (isUrdu ? `${diffDays} دن باقی ہیں` : `${diffDays} days left`);

              const display = getMeterDisplayName(meter);
              const title = isUrdu
                ? `⚠️ بل کی آخری تاریخ قریب ہے: ${display}`
                : `⚠️ Bill Due Soon: ${display}`;

              const message = isUrdu
                ? `${display} بل کی آخری تاریخ ${meter.lastDueDate} ہے (${daysText})۔ لیٹ سرچارج سے بچنے کے لیے وقت پر ادا کریں۔ رقم: Rs. ${(meter.lastBillAmount || 0).toLocaleString()}`
                : `Due date for ${display} is ${meter.lastDueDate} (${daysText}). Pay on time to avoid surcharge. Amount: Rs. ${(meter.lastBillAmount || 0).toLocaleString()}`;

              const notif = await this.addNotification({
                title,
                message,
                company: meter.company,
                referenceNumber: meter.referenceNumber,
                billMonth: meter.lastBillMonth,
                billAmount: meter.lastBillAmount,
              });
              reminders.push(notif);

              await this.triggerSystemNotification(
                title,
                message,
                `due_${meter.company}_${meter.referenceNumber}`
              );
            }
          }
        }
      }
    } catch {
      // ignore
    }
    return reminders;
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
   * 1. Updates meter record & caches the fresh bill (Meter stays PERMANENTLY saved, only values update).
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
              // Update saved meter record (Preserves meter ID, company, reference, nickname permanently)
              await StorageService.saveMeter({
                ...meter,
                consumerName: fresh.consumerName || meter.consumerName,
                consumerAddress: fresh.consumerAddress || meter.consumerAddress,
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
          // ignore single meter sync failure (will retry automatically on next sync)
        }
      }
    } catch {
      // ignore
    }
    return newNotifs;
  },
};

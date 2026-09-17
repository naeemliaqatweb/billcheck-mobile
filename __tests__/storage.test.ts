import { StorageService } from '../src/services/storage';
import { SavedMeter, BillData } from '../src/types/bill';

describe('StorageService Test Suite', () => {
  beforeEach(async () => {
    await StorageService.resetAppAndCache();
  });

  describe('Saved Meters Management', () => {
    it('returns empty array when no meters saved initially', async () => {
      const meters = await StorageService.getSavedMeters();
      expect(meters).toEqual([]);
    });

    it('saves a new meter and retrieves it', async () => {
      const meter: SavedMeter = {
        id: 'meter-101',
        nickname: 'Home Meter',
        company: 'LESCO',
        referenceNumber: '01115120000000',
        utilityType: 'electricity',
        createdAt: new Date().toISOString(),
      };

      const success = await StorageService.saveMeter(meter);
      expect(success).toBe(true);

      const saved = await StorageService.getSavedMeters();
      expect(saved.length).toBe(1);
      expect(saved[0].nickname).toBe('Home Meter');
      expect(saved[0].referenceNumber).toBe('01115120000000');
    });

    it('updates an existing meter when saving with same company and reference', async () => {
      const meter1: SavedMeter = {
        id: 'meter-101',
        nickname: 'Old Name',
        company: 'LESCO',
        referenceNumber: '01115120000000',
        utilityType: 'electricity',
        createdAt: new Date().toISOString(),
      };
      await StorageService.saveMeter(meter1);

      const meterUpdated: SavedMeter = {
        id: 'meter-101',
        nickname: 'New Name Updated',
        company: 'LESCO',
        referenceNumber: '01115120000000',
        utilityType: 'electricity',
        createdAt: new Date().toISOString(),
      };
      await StorageService.saveMeter(meterUpdated);

      const saved = await StorageService.getSavedMeters();
      expect(saved.length).toBe(1);
      expect(saved[0].nickname).toBe('New Name Updated');
    });

    it('deletes a meter by id', async () => {
      const meter: SavedMeter = {
        id: 'meter-102',
        nickname: 'Shop Meter',
        company: 'MEPCO',
        referenceNumber: '14151210000000',
        utilityType: 'electricity',
        createdAt: new Date().toISOString(),
      };
      await StorageService.saveMeter(meter);
      let list = await StorageService.getSavedMeters();
      expect(list.length).toBe(1);

      await StorageService.deleteMeter('meter-102');
      list = await StorageService.getSavedMeters();
      expect(list.length).toBe(0);
    });

    it('clears all saved meters', async () => {
      await StorageService.saveMeter({
        id: 'm1',
        nickname: 'M1',
        company: 'IESCO',
        referenceNumber: '04141210000000',
        utilityType: 'electricity',
        createdAt: new Date().toISOString(),
      });
      await StorageService.saveMeter({
        id: 'm2',
        nickname: 'M2',
        company: 'SNGPL',
        referenceNumber: '12345678901',
        utilityType: 'gas',
        createdAt: new Date().toISOString(),
      });

      let list = await StorageService.getSavedMeters();
      expect(list.length).toBe(2);

      await StorageService.clearAllSavedMeters();
      list = await StorageService.getSavedMeters();
      expect(list.length).toBe(0);
    });
  });

  describe('Bill Caching', () => {
    it('caches and retrieves bill data', async () => {
      const bill: BillData = {
        referenceNo: '01115120000000',
        company: 'LESCO',
        companyName: 'LESCO Electric Supply',
        utilityType: 'electricity',
        consumerName: 'Ali Khan',
        billMonth: 'AUG 26',
        payableWithinDueDate: 5400,
        payableAfterDueDate: 5800,
        latePaymentSurcharge: 400,
        unitsConsumed: 220,
        billStatus: 'unpaid',
      } as unknown as BillData;

      await StorageService.cacheBill(bill);

      const cached = await StorageService.getCachedBill('LESCO', '01115120000000');
      expect(cached).not.toBeNull();
      expect(cached?.consumerName).toBe('Ali Khan');
      expect(cached?.payableWithinDueDate).toBe(5400);
      expect(cached?.fetchedAt).toBeDefined();
    });

    it('clears specific bill cache', async () => {
      const bill: BillData = {
        referenceNo: '08131210000000',
        company: 'FESCO',
        companyName: 'FESCO',
        utilityType: 'electricity',
        consumerName: 'Usman',
        billMonth: 'AUG 26',
        payableWithinDueDate: 3200,
        payableAfterDueDate: 3500,
        latePaymentSurcharge: 300,
        unitsConsumed: 110,
        billStatus: 'paid',
      } as unknown as BillData;


      await StorageService.cacheBill(bill);
      expect(await StorageService.getCachedBill('FESCO', '08131210000000')).not.toBeNull();

      await StorageService.clearBillCache('FESCO', '08131210000000');
      expect(await StorageService.getCachedBill('FESCO', '08131210000000')).toBeNull();
    });
  });

  describe('User Preferences (Language, Theme, Notifications)', () => {
    it('persists and retrieves language preference', async () => {
      expect(await StorageService.getLanguage()).toBe('en');
      await StorageService.setLanguage('ur');
      expect(await StorageService.getLanguage()).toBe('ur');
      await StorageService.setLanguage('en');
      expect(await StorageService.getLanguage()).toBe('en');
    });

    it('persists and retrieves theme preference', async () => {
      expect(await StorageService.getTheme()).toBe('dark');
      await StorageService.setTheme('light');
      expect(await StorageService.getTheme()).toBe('light');
    });

    it('persists and retrieves notification preference', async () => {
      expect(await StorageService.getNotifications()).toBe(true);
      await StorageService.setNotifications(false);
      expect(await StorageService.getNotifications()).toBe(false);
    });
  });

  describe('PDF HTML Caching', () => {
    it('caches and retrieves PDF HTML instantly', async () => {
      const sampleHtml = '<html><body><h1>LESCO Bill</h1></body></html>';
      await StorageService.cachePdfHtml('LESCO', '01115120000000', sampleHtml, 'AUG 26');

      const cachedWithMonth = await StorageService.getCachedPdfHtml('LESCO', '01115120000000', 'AUG 26');
      expect(cachedWithMonth).toBe(sampleHtml);

      const cachedGeneric = await StorageService.getCachedPdfHtml('LESCO', '01115120000000');
      expect(cachedGeneric).toBe(sampleHtml);
    });

    it('clears PDF cache for a specific meter or globally', async () => {
      const sampleHtml = '<html><body><h1>MEPCO Bill</h1></body></html>';
      await StorageService.cachePdfHtml('MEPCO', '14151210000000', sampleHtml);

      expect(await StorageService.getCachedPdfHtml('MEPCO', '14151210000000')).toBe(sampleHtml);

      await StorageService.clearPdfCache('MEPCO', '14151210000000');
      expect(await StorageService.getCachedPdfHtml('MEPCO', '14151210000000')).toBeNull();
    });
  });
});

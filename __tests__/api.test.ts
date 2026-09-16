import {
  sanitizeBillingMonth,
  generate12MonthHistory,
  parseDueDate,
  ApiService,
} from '../src/services/api';
import { StorageService } from '../src/services/storage';

describe('ApiService & Helper Functions Test Suite', () => {
  describe('sanitizeBillingMonth', () => {
    it('returns default latest issued month if given undefined or empty string', () => {
      const result = sanitizeBillingMonth();
      expect(result).toMatch(/^[A-Z]{3}\s\d{2}$/);
    });

    it('parses valid month strings correctly like "AUG 26" or "JUL 26"', () => {
      const aug = sanitizeBillingMonth('AUG 26');
      expect(aug).toBe('AUG 26');

      const jul = sanitizeBillingMonth('JUL 26');
      expect(jul).toBe('JUL 26');
    });

    it('handles dash and lowercase formatted month strings like "jul-2026"', () => {
      const res = sanitizeBillingMonth('jul-2026');
      expect(res).toBe('JUL 26');
    });

    it('clamps future months (e.g. SEP, OCT in Aug cycle) to default issued month', () => {
      const res = sanitizeBillingMonth('DEC 26');
      expect(res).toMatch(/^[A-Z]{3}\s\d{2}$/);
    });
  });

  describe('generate12MonthHistory', () => {
    it('generates an array of exactly 12 monthly bill history items', () => {
      const history = generate12MonthHistory(250, 9500, 'AUG 26');
      expect(history).toHaveLength(12);
    });

    it('correctly sets the latest month as current with given units and amount', () => {
      const history = generate12MonthHistory(300, 12000, 'AUG 26');
      const latest = history[history.length - 1];

      expect(latest.units).toBe(300);
      expect(latest.amount).toBe(12000);
      expect(latest.status).toBe('unpaid');
    });

    it('marks all previous months as paid with paymentDate strings', () => {
      const history = generate12MonthHistory(200, 8000, 'AUG 26');

      for (let i = 0; i < history.length - 1; i++) {
        expect(history[i].status).toBe('paid');
        expect(history[i].paymentDate).toBeDefined();
        expect(history[i].units).toBeGreaterThan(0);
        expect(history[i].amount).toBeGreaterThan(0);
      }
    });

    it('computes realistic month labels and years across year boundary', () => {
      const history = generate12MonthHistory(150, 6000, 'AUG 26');
      history.forEach((slot) => {
        expect(slot.month).toMatch(/^[A-Z]{3}\s\d{2}$/);
        expect(slot.year).toBeGreaterThanOrEqual(2025);
      });
    });
  });

  describe('parseDueDate', () => {
    it('parses text format like "11 SEP 26" or "15-AUG-2026"', () => {
      const d1 = parseDueDate('11 SEP 26');
      expect(d1).not.toBeNull();
      expect(d1?.getDate()).toBe(11);
      expect(d1?.getMonth()).toBe(8); // September is month 8 (0-indexed)
      expect(d1?.getFullYear()).toBe(2026);

      const d2 = parseDueDate('15-AUG-2026');
      expect(d2).not.toBeNull();
      expect(d2?.getDate()).toBe(15);
      expect(d2?.getMonth()).toBe(7); // August is month 7
      expect(d2?.getFullYear()).toBe(2026);
    });

    it('parses ISO date format "2026-08-25"', () => {
      const d = parseDueDate('2026-08-25');
      expect(d).not.toBeNull();
      expect(d?.getFullYear()).toBe(2026);
      expect(d?.getMonth()).toBe(7);
      expect(d?.getDate()).toBe(25);
    });

    it('parses slash format "20/08/2026"', () => {
      const d = parseDueDate('20/08/2026');
      expect(d).not.toBeNull();
      expect(d?.getFullYear()).toBe(2026);
      expect(d?.getMonth()).toBe(7);
      expect(d?.getDate()).toBe(20);
    });

    it('returns null for empty or invalid date strings', () => {
      expect(parseDueDate('')).toBeNull();
      expect(parseDueDate(undefined)).toBeNull();
      expect(parseDueDate('invalid-date-string')).toBeNull();
    });
  });

  describe('ApiService.fetchBill Cache & Network Handling', () => {
    beforeEach(async () => {
      await StorageService.resetAppAndCache();
      // Reset global fetch mock if any
      (globalThis as any).fetch = jest.fn();
    });


    it('returns cached bill when fresh cache exists', async () => {
      const mockBill: any = {
        referenceNo: '01115120000000',
        company: 'LESCO',
        consumerName: 'Muhammad Ali',
        payableWithinDueDate: 4500,
        billMonth: 'AUG 26',
        fetchedAt: new Date().toISOString(),
        isMockData: false,
      };

      await StorageService.cacheBill(mockBill);

      const bill = await ApiService.fetchBill('LESCO', '01115120000000', false);
      expect(bill).toBeDefined();
      expect(bill.referenceNo).toBe('01115120000000');
      expect(bill.consumerName).toBe('Muhammad Ali');
      expect((globalThis as any).fetch).not.toHaveBeenCalled();
    });

    it('calls live backend endpoint when not in cache or forceRefresh is true', async () => {
      const liveData: any = {
        referenceNo: '14151210000000',
        company: 'MEPCO',
        consumerName: 'Tariq Mehmood',
        payableWithinDueDate: 6200,
        billMonth: 'AUG 26',
        isMockData: false,
      };

      (globalThis as any).fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: liveData }),
      });

      const bill = await ApiService.fetchBill('MEPCO', '14151210000000', true);
      expect(bill.consumerName).toBe('Tariq Mehmood');
      expect(bill.payableWithinDueDate).toBe(6200);
    });

    it('handles official bill PDF fetch gracefully', async () => {
      (globalThis as any).fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, fileName: 'Official_Bill_LESCO_123.pdf' }),
      });


      const pdf = await ApiService.fetchOfficialBillPdfDocument('LESCO', '01115120000000');
      expect(pdf.success).toBe(true);
      expect(pdf.fileName).toContain('LESCO');
    });
  });
});

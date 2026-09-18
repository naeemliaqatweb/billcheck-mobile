import {
  sanitizeBillingMonth,
  generate12MonthHistory,
  parseDueDate,
  ApiService,
  parseSngplHtml,
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

    it('fetches authentic SNGPL baseline parameters', async () => {
      (globalThis as any).fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          acctId: '39008111096',
          category: 'DOM',
          protectedStatus: 'Protected',
          previousRead: '09125000',
          previousReadDt: '14-09-2026',
          gcv: '942',
          pressureFactor: 0.36,
          consumerSts: 'Active Consumer',
        }),
      });

      const params = await ApiService.fetchSngplParams('39008111096');
      expect(params.acctId).toBe('39008111096');
      expect(params.category).toBe('DOM');
      expect(params.protectedStatus).toBe('Protected');
      expect(params.previousRead).toBe('09125000');
      expect(params.previousReadDt).toBe('14-09-2026');
    });

    it('estimates SNGPL gas bill correctly with official response or fallback', async () => {
      (globalThis as any).fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          hm3: 0.307,
          mmbtu: 1.028,
          totalAmount: '915.0',
          gasCharges: '220.71',
          fixedCharges: '520.0',
          meterRent: '34.67',
          gst: '139.57',
          slab1Disp: 'Slab 1 Upto 0.25',
          tariff1Disp: '200.0',
        }),
      });

      const bill = await ApiService.estimateSngplBill({
        accountId: '39008111096',
        category: 'DOM',
        protectedStatus: 'Protected',
        previousRead: '09125000',
        previousReadDt: '14-09-2026',
        currentRead: '09155000',
        currentReadDt: '18-09-2026',
        gcv: '942',
        pressureFactor: 0.36,
      });

      expect(bill.company).toBe('SNGPL');
      expect(bill.utilityType).toBe('gas');
      expect(bill.payableWithinDueDate).toBe(915);
      expect(bill.referenceNo).toBe('39008111096');
      expect(bill.unitsConsumed).toBe(1.03);
    });

    it('parses authentic SNGPL duplicate bill HTML into complete BillData', () => {
      const sampleHtml = `
        <table>
          <tr><td>Name</td><td>SHAHEENA BEGUM</td></tr>
          <tr><td>Address</td><td>H NO 117 BLOCK B/B VITAL HOMES, LAHORE</td></tr>
          <tr><td>Billing Month</td><td>Aug 2026</td></tr>
          <tr class="txt-bld"><td>990</td><td>1,090</td><td>01-10-2026</td></tr>
          <tr><td>Issue Date: 11-09-2026</td></tr>
          <tr><td>Meter No:</td><td>BK-111096</td></tr>
          <tr><td>Tariff: DOMP-G</td></tr>
          <tr class="bdr-bt"><td>09125000</td><td>09087000</td></tr>
          <tr><td>Gas Charges</td><td class="txt-rt">188.01</td></tr>
          <tr><td>Meter Rent</td><td class="txt-rt">40.0</td></tr>
          <tr><td>Fixed Charges</td><td class="txt-rt">600.0</td></tr>
          <tr><td>GST</td><td class="txt-rt">158.84</td></tr>
          <tr>
            <td class="history">Jul 2026</td>
            <td class="history">0.038</td>
            <td class="history">188.0</td>
            <td class="history">990</td>
            <td class="history">01-09-2026</td>
          </tr>
        </table>
      `;

      const parsed = parseSngplHtml(sampleHtml, '39008111096');
      expect(parsed.consumerName).toBe('SHAHEENA BEGUM');
      expect(parsed.consumerAddress).toContain('VITAL HOMES');
      expect(parsed.payableWithinDueDate).toBe(990);
      expect(parsed.payableAfterDueDate).toBe(1090);
      expect(parsed.dueDate).toBe('01-10-2026');
      expect(parsed.presentReading).toBe(9125000);
      expect(parsed.previousReading).toBe(9087000);
      expect(parsed.company).toBe('SNGPL');
      expect(parsed.utilityType).toBe('gas');
    });

    it('fetches official SNGPL duplicate bill and parses properly', async () => {
      const mockHtml = `
        <table>
          <tr><td>Name</td><td>SHAHEENA BEGUM</td></tr>
          <tr><td>Billing Month</td><td>Aug 2026</td></tr>
          <tr class="txt-bld"><td>990</td><td>1,090</td><td>01-10-2026</td></tr>
          <tr><td>Gas Charges</td><td class="txt-rt">188.01</td></tr>
        </table>
      ` + ' '.repeat(500);

      (globalThis as any).fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        text: async () => mockHtml,
      });

      const res = await ApiService.fetchOfficialSngplBill('39008111096');
      expect(res.bill.consumerName).toBe('SHAHEENA BEGUM');
      expect(res.bill.payableWithinDueDate).toBe(990);
      expect(res.html).toBe(mockHtml);
    });
  });
});

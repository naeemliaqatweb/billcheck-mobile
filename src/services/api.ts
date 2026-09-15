import { BillData, BillMonthHistory } from '../types/bill';
import { StorageService } from './storage';

// ─── Backend URLs ────────────────────────────────────────────────────────────
// Priority order: Real machine IP → emulator bridge → localhost
const BACKEND_URLS = [
  'http://192.168.4.223:3001/api/bills',  // Real phone on same WiFi
  'http://10.0.2.2:3001/api/bills',       // Android emulator bridge
  'http://localhost:3001/api/bills',       // Fallback
];

// Cache fresh for 6 hours (same bill won't change in 6hrs)
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

export function generate12MonthHistory(currentUnits: number, currentAmount: number): BillMonthHistory[] {
  const monthLabels = [
    { label: 'SEP 25', year: 2025, seasonMultiplier: 0.85 },
    { label: 'OCT 25', year: 2025, seasonMultiplier: 0.65 },
    { label: 'NOV 25', year: 2025, seasonMultiplier: 0.45 },
    { label: 'DEC 25', year: 2025, seasonMultiplier: 0.40 },
    { label: 'JAN 26', year: 2026, seasonMultiplier: 0.38 },
    { label: 'FEB 26', year: 2026, seasonMultiplier: 0.42 },
    { label: 'MAR 26', year: 2026, seasonMultiplier: 0.55 },
    { label: 'APR 26', year: 2026, seasonMultiplier: 0.75 },
    { label: 'MAY 26', year: 2026, seasonMultiplier: 0.95 },
    { label: 'JUN 26', year: 2026, seasonMultiplier: 1.15 },
    { label: 'JUL 26', year: 2026, seasonMultiplier: 1.20 },
    { label: 'AUG 26', year: 2026, seasonMultiplier: 1.00 },
  ];

  const history: BillMonthHistory[] = [];
  let prevUnits = 0;

  for (let i = 0; i < monthLabels.length; i++) {
    const item = monthLabels[i];
    const isCurrent = i === monthLabels.length - 1;
    const units = isCurrent ? currentUnits : Math.max(50, Math.round(currentUnits * item.seasonMultiplier));
    const amount = isCurrent ? currentAmount : Math.round(units * 38.5 * 1.22);
    const diff = prevUnits > 0 ? Math.round(((units - prevUnits) / prevUnits) * 100) : 0;
    prevUnits = units;

    history.push({
      month: item.label,
      year: item.year,
      units,
      amount,
      status: isCurrent ? 'unpaid' : 'paid',
      paymentDate: isCurrent ? undefined : `15 ${item.label.split(' ')[0]} ${item.year}`,
      unitsDiffPercentage: diff,
    });
  }

  return history;
}

export const ApiService = {
  async fetchBill(
    company: string,
    referenceNumber: string,
    forceRefresh = false,
    searchType?: 'refno' | 'consumerId' | 'auto',
  ): Promise<BillData> {
    const cleanRef = referenceNumber.replace(/[^0-9a-zA-Z]/g, '').trim();

    // ── Cache-first: skip API if fresh cache exists ─────────────────────────
    if (!forceRefresh) {
      const cached = await StorageService.getCachedBill(company, cleanRef);
      if (cached && cached.fetchedAt && cached.payableWithinDueDate > 0 && !cached.isMockData) {
        const age = Date.now() - new Date(cached.fetchedAt as string).getTime();
        if (age < CACHE_TTL_MS) {
          return cached; // ← return valid cached, no API call
        }
      }
    }

    // ── Live API call ────────────────────────────────────────────────────────
    const isConsumerId = searchType === 'consumerId' || (searchType !== 'refno' && cleanRef.length <= 10);
    const requestPayload = {
      company,
      referenceNumber: cleanRef,
      consumerId: cleanRef,
      searchType: isConsumerId ? 'consumerId' : 'refno',
    };

    for (const url of BACKEND_URLS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(requestPayload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            const bill: BillData = { ...json.data, fetchedAt: new Date().toISOString() };
            await StorageService.cacheBill(bill); // auto-save to cache
            // Also cache under query key so subsequent searches by consumer id hit cache
            if (cleanRef !== bill.referenceNo) {
              await StorageService.cacheBill({ ...bill, referenceNo: cleanRef });
            }
            return bill;
          }
        }
      } catch {
        // try next endpoint
      }
    }

    // ── Offline fallback ─────────────────────────────────────────────────────
    return this.generateOfflineBill(company, cleanRef);
  },

  generateOfflineBill(company: string, refNo: string): BillData {
    const seed = parseInt(refNo.slice(-6), 10) || 1598719;
    const isGas = company === 'SNGPL' || company === 'SSGC';
    const units = isGas ? 55 + (seed % 60) : 240 + (seed % 220);
    const unitRate = isGas ? 14.5 : 38.5;
    const rawCost = Math.round(units * unitRate);
    const gst = Math.round(rawCost * 0.18);
    const fpa = isGas ? 0 : Math.round(units * 3.42);
    const tvFee = isGas ? 0 : 35;
    const electricityDuty = isGas ? 0 : Math.round(rawCost * 0.015);
    const total = rawCost + gst + fpa + tvFee + electricityDuty;
    const lateFee = Math.round(total * 0.085);

    const issueDate = new Date();
    issueDate.setDate(issueDate.getDate() - 6);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 8);

    const names = [
      'HAFIZ ABDUL REHMAN',
      'MUHAMMAD NAEEM',
      'TARIQ MEHMOOD',
      'ALI HASSAN',
      'KHALID JAVED',
    ];

    const prevReading = (seed % 10000) + 1200;
    const history12 = generate12MonthHistory(units, total);

    const formattedRef = refNo.length === 14
      ? `${refNo.substring(0, 2)} ${refNo.substring(2, 7)} ${refNo.substring(7, 14)} U`
      : refNo;

    return {
      referenceNo: refNo,
      formattedRefNo: formattedRef,
      consumerId: refNo.length >= 10 ? refNo.substring(2, 12) : refNo,
      company,
      companyName: `${company} Utility Company`,
      utilityType: isGas ? 'gas' : 'electricity',
      consumerName: names[seed % names.length],
      consumerAddress: `House #${(seed % 120) + 1}, St ${(seed % 18) + 1}, Sector ${(seed % 6) + 1}, Lahore`,
      subDivision: 'DHA SUB DIVISION (11890)',
      feederName: 'F-12 INDUSTRIAL FEEDER',
      billMonth: 'AUG 26',
      issueDate: issueDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      payableWithinDueDate: total,
      payableAfterDueDate: total + lateFee,
      latePaymentSurcharge: lateFee,
      unitsConsumed: units,
      previousReading: prevReading,
      presentReading: prevReading + units,
      billStatus: 'unpaid',
      meterNo: `MTR-${(seed % 899999) + 100000}`,
      tariff: isGas ? 'DOMESTIC (CAT-I)' : 'A-1a (01) RESIDENTIAL',
      connectedLoad: '2.0 kW',
      fpaAmount: fpa,
      tvFee,
      gstAmount: gst,
      electricityDuty,
      history12Months: history12,
      isMockData: true,
    };
  },
};

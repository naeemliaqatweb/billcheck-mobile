export type UtilityType = 'electricity' | 'gas';

export type BillStatus = 'paid' | 'unpaid' | 'overdue';

export interface BillMonthHistory {
  month: string;
  year: number;
  units: number;
  amount: number;
  status: 'paid' | 'unpaid';
  paymentDate?: string;
  unitsDiffPercentage?: number;
}

export interface ChargeBreakdownItem {
  labelEn: string;
  labelUr: string;
  percentage?: string;
  value: number;
}

export interface SurchargeTier {
  period: string;
  surcharge: number;
  payable: number;
}

export interface ConsumerDetails {
  referenceNo: string;
  consumerId: string;
  name: string;
  address: string;
  transformer?: string;
  feeder: string;
  subDivision: string;
  category: string;
  status?: string;
  tariffCategory: string;
  tariff: string;
  sanctionedLoad: string;
}

export interface MeterDetails {
  meterNo: string;
  mf: number;
  previousReading: number;
  presentReading: number;
  unitsConsumed: number;
}

export interface BillData {
  referenceNo: string;
  formattedRefNo?: string;
  consumerId?: string;
  company: string;
  companyName: string;
  utilityType: UtilityType;
  consumerName: string;
  consumerAddress: string;
  subDivision?: string;
  feederName?: string;
  billMonth: string;
  issueDate: string;
  dueDate: string;
  payableWithinDueDate: number;
  payableAfterDueDate: number;
  latePaymentSurcharge: number;
  unitsConsumed: number;
  previousReading?: number;
  presentReading?: number;
  billStatus: BillStatus;
  meterNo: string;
  tariff: string;
  connectedLoad?: string;
  fpaAmount: number;
  tvFee: number;
  gstAmount: number;
  electricityDuty?: number;
  history12Months: BillMonthHistory[];
  sourceUrl?: string;
  isMockData?: boolean;
  fetchedAt?: string; // ISO timestamp when bill was last fetched from API

  // Rich structured breakdown
  consumerDetails?: ConsumerDetails;
  meterDetails?: MeterDetails;
  chargesBreakdown?: ChargeBreakdownItem[];
  surchargeTiers?: SurchargeTier[];
  totalElectricityCharges?: number;
  subsidyAmount?: number;
  netElectricityCharges?: number;
  currentBillAmount?: number;
  fpaMessage?: string;
  subsidyMessage?: string;
}

export interface SavedMeter {
  id: string;
  nickname: string;
  company: string;
  referenceNumber: string;
  consumerId?: string;
  consumerName?: string;
  consumerAddress?: string;
  utilityType: UtilityType;
  lastCheckedDate?: string;
  lastBillAmount?: number;
  lastDueDate?: string;
  lastBillStatus?: BillStatus;
  lastBillMonth?: string;
  createdAt?: string;
}

export interface ProviderInfo {
  code: string;
  name: string;
  fullName: string;
  type: UtilityType;
  region: string;
  refLength: number;
  refPlaceholder: string;
  badgeColor: string;
  iconName: string;
  portalUrl?: string;
  officialSite?: string;
}

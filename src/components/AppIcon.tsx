import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import {
  House,
  Star,
  Bookmark,
  BookmarkCheck,
  ChartColumn,
  Settings,
  Zap,
  Flame,
  Search,
  Share2,
  Copy,
  Check,
  X,
  Bell,
  BellRing,
  AlertTriangle,
  AlertCircle,
  Info,
  BadgeCheck,
  ShieldCheck,
  Globe,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Plus,
  History,
  Gauge,
  CreditCard,
  Banknote,
  Trash2,
  Receipt,
  ReceiptText,
  User,
  Calendar,
  FileText,
  FileDown,
  Download,
  Phone,
  PhoneCall,
  Sparkles,
  Shield,
  Moon,
  Sun,
  Lock,
  Building,
  Building2,
  Megaphone,
  Eye,
  EyeOff,
  CheckCircle2,
  Terminal,
  LogOut,
  RotateCcw,
  QrCode,
  ScanLine,
  HelpCircle,
  Printer,
  Wallet,
  Cloud,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  TrendingDown,
  TrendingUp,
  Calculator,
  Menu,
  Sliders,
  Lightbulb,
  LucideIcon,
} from 'lucide-react-native';

export type IconName =
  | 'bolt'
  | 'zap'
  | 'flash'
  | 'flame'
  | 'gas'
  | 'search'
  | 'star'
  | 'bookmark'
  | 'share'
  | 'copy'
  | 'check'
  | 'close'
  | 'x'
  | 'bell'
  | 'alert'
  | 'info'
  | 'official'
  | 'globe'
  | 'back'
  | 'chevron-right'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-forward'
  | 'refresh'
  | 'plus'
  | 'add'
  | 'history'
  | 'stats'
  | 'speedometer'
  | 'meter'
  | 'card'
  | 'cash'
  | 'home'
  | 'settings'
  | 'trash'
  | 'delete'
  | 'receipt'
  | 'person'
  | 'user'
  | 'calendar'
  | 'document'
  | 'sparkles'
  | 'shield'
  | 'moon'
  | 'lock'
  | 'business'
  | 'megaphone'
  | string;

export interface AppIconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  badgeColor?: string;
  badgeSize?: number;
  library?: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
}

const ICON_MAP: Record<string, LucideIcon> = {
  // Navigation & Core
  home: House,
  house: House,
  saved: BookmarkCheck,
  star: Star,
  bookmark: Bookmark,
  'bookmark-check': BookmarkCheck,
  stats: ChartColumn,
  analytics: ChartColumn,
  monitoring: ChartColumn,
  chart: ChartColumn,
  settings: Settings,

  // Utilities
  bolt: Zap,
  zap: Zap,
  flash: Zap,
  flame: Flame,
  gas: Flame,

  // Actions
  search: Search,
  share: Share2,
  copy: Copy,
  check: Check,
  'check-circle': CheckCircle2,
  close: X,
  x: X,
  plus: Plus,
  add: Plus,
  refresh: RefreshCw,
  trash: Trash2,
  delete: Trash2,

  // Alerts & Notifications
  bell: Bell,
  'bell-ring': BellRing,
  notification: BellRing,
  alert: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
  official: ShieldCheck,
  verified: BadgeCheck,
  'verified-user': ShieldCheck,

  // Arrows & Navigation
  back: ArrowLeft,
  'arrow-left': ArrowLeft,
  'arrow-back': ArrowLeft,
  'arrow-forward': ArrowRight,
  'arrow-right': ArrowRight,
  'arrow-down': ArrowDown,
  'arrow_downward': ArrowDown,
  'arrow-up': ArrowUp,
  'arrow_upward': ArrowUp,
  'chevron-right': ChevronRight,
  'chevron-forward': ChevronRight,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  menu: Menu,

  // Analytics & Calculators
  trending_down: TrendingDown,
  'trending-down': TrendingDown,
  trending_up: TrendingUp,
  'trending-up': TrendingUp,
  calculate: Calculator,
  calculator: Calculator,
  insights: ChartColumn,
  payments: Banknote,
  local_fire_department: Flame,
  campaign: Megaphone,
  lightbulb: Lightbulb,
  sliders: Sliders,

  // General app items
  globe: Globe,
  history: History,
  speedometer: Gauge,
  meter: Gauge,
  gauge: Gauge,
  card: CreditCard,
  cash: Banknote,
  receipt: Receipt,
  'receipt-long': ReceiptText,
  'receipt-text': ReceiptText,
  person: User,
  user: User,
  calendar: Calendar,
  document: FileText,
  download: Download,
  'file-download': FileDown,
  'file-down': FileDown,
  phone: Phone,
  'phone-call': PhoneCall,
  helpline: PhoneCall,
  sparkles: Sparkles,
  shield: Shield,
  'shield-check': ShieldCheck,
  moon: Moon,
  dark: Moon,
  sun: Sun,
  light: Sun,
  theme: Sun,
  lock: Lock,
  security: ShieldCheck,
  business: Building2,
  building: Building,
  'corporate-fare': Building2,
  megaphone: Megaphone,
  eye: Eye,
  'eye-off': EyeOff,
  terminal: Terminal,
  logout: LogOut,
  'log-out': LogOut,
  reset: RotateCcw,
  help: HelpCircle,
  'help-circle': HelpCircle,
  'help-outline': HelpCircle,
  print: Printer,
  printer: Printer,
  wallet: Wallet,
  'account_balance_wallet': Wallet,
  cloud: Cloud,
  'cloud-done': Cloud,
  'cloud_done': Cloud,
  qr: QrCode,
  'qr-code': QrCode,
  'qr-scanner': ScanLine,
  'qr_code_scanner': ScanLine,
};

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 20,
  color = '#10B981',
  strokeWidth = 2.2,
  containerStyle,
}) => {
  const IconComponent = (name && ICON_MAP[name.toLowerCase()]) || House;
  const ComponentToRender = IconComponent || House;

  return (
    <View style={[styles.container, containerStyle]}>
      {ComponentToRender ? (
        <ComponentToRender
          size={size}
          color={color}
          strokeWidth={strokeWidth}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

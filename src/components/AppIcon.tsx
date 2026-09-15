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
  User,
  Calendar,
  FileText,
  Sparkles,
  Shield,
  Moon,
  Sun,
  Lock,
  Building2,
  Megaphone,
  Eye,
  EyeOff,
  CheckCircle2,
  Terminal,
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
  alert: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
  official: ShieldCheck,
  verified: BadgeCheck,

  // Arrows & Navigation
  back: ArrowLeft,
  'arrow-left': ArrowLeft,
  'chevron-right': ChevronRight,
  'chevron-forward': ChevronRight,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,

  // General app items
  globe: Globe,
  history: History,
  speedometer: Gauge,
  meter: Gauge,
  gauge: Gauge,
  card: CreditCard,
  cash: Banknote,
  receipt: Receipt,
  person: User,
  user: User,
  calendar: Calendar,
  document: FileText,
  sparkles: Sparkles,
  shield: Shield,
  'shield-check': ShieldCheck,
  moon: Moon,
  dark: Moon,
  sun: Sun,
  light: Sun,
  theme: Sun,
  lock: Lock,
  business: Building2,
  megaphone: Megaphone,
  eye: Eye,
  'eye-off': EyeOff,
  terminal: Terminal,
};

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 20,
  color = '#10B981',
  strokeWidth = 2.2,
  containerStyle,
}) => {
  const IconComponent = ICON_MAP[name.toLowerCase()] || House;

  return (
    <View style={[styles.container, containerStyle]}>
      <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

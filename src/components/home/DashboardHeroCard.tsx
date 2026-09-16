import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { AppIcon } from '../AppIcon';
import { DashboardTrendGraph } from './DashboardTrendGraph';
import { ElectricGridAnimation } from './ElectricGridAnimation';
import { Language } from '../../i18n/translations';
import { BillMonthHistory } from '../../types/bill';

interface DashboardHeroCardProps {
  location?: string;
  totalDueAmount: number;
  unpaidBillsCount: number;
  history?: BillMonthHistory[];
  billMonth?: string;
  language: Language;
  darkMode: boolean;
  onOpenNotifications?: () => void;
  onToggleLanguage?: (lang: Language) => void;
  onToggleTheme?: (isDark: boolean) => void;
  onAddBill?: () => void;
}

const URDU_MONTH_NAMES: Record<string, string> = {
  JAN: 'جنوری',
  FEB: 'فروری',
  MAR: 'مارچ',
  APR: 'اپریل',
  MAY: 'مئی',
  JUN: 'جون',
  JUL: 'جولائی',
  AUG: 'اگست',
  SEP: 'ستمبر',
  OCT: 'اکتوبر',
  NOV: 'نومبر',
  DEC: 'دسمبر',
};

const formatCurrentBillMonth = (
  history?: BillMonthHistory[],
  customBillMonth?: string,
  isUrdu = false
) => {
  if (customBillMonth) {
    const parts = customBillMonth.trim().toUpperCase().split(/[\s-]+/);
    const m = parts[0] || '';
    const y = parts[1] ? (parts[1].length === 2 ? `20${parts[1]}` : parts[1]) : '';
    for (const [key, urVal] of Object.entries(URDU_MONTH_NAMES)) {
      if (m.startsWith(key)) {
        return isUrdu ? `${urVal} ${y}`.trim() : `${key.charAt(0) + key.slice(1).toLowerCase()} ${y}`.trim();
      }
    }
    return customBillMonth;
  }

  if (history && history.length > 0) {
    const latest = history[history.length - 1];
    if (latest?.month) {
      const parts = latest.month.trim().toUpperCase().split(/[\s-]+/);
      const m = parts[0] || '';
      const y = parts[1] ? (parts[1].length === 2 ? `20${parts[1]}` : parts[1]) : (latest.year ? `${latest.year}` : '');
      for (const [key, urVal] of Object.entries(URDU_MONTH_NAMES)) {
        if (m.startsWith(key)) {
          return isUrdu ? `${urVal} ${y}`.trim() : `${key.charAt(0) + key.slice(1).toLowerCase()} ${y}`.trim();
        }
      }
    }
  }

  // Fallback to dynamic system current month & year
  const now = new Date();
  const MON_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MON_UR = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];
  const curM = now.getMonth();
  const curY = now.getFullYear();
  return isUrdu ? `${MON_UR[curM]} ${curY}` : `${MON_EN[curM]} ${curY}`;
};

export const DashboardHeroCard: React.FC<DashboardHeroCardProps> = ({
  location: _location = 'Lahore, PK',
  totalDueAmount = 0,
  unpaidBillsCount = 0,
  history,
  billMonth,
  language,
  darkMode,
  onOpenNotifications,
  onToggleLanguage,
  onToggleTheme,
}) => {
  const isUrdu = language === 'ur';

  // Current dynamic bill month text (e.g. "Aug 2026" or "اگست 2026")
  const activeMonthText = useMemo(
    () => formatCurrentBillMonth(history, billMonth, isUrdu),
    [history, billMonth, isUrdu]
  );

  return (
    <View style={styles.heroWrapper}>
      <View style={styles.heroContent}>
        {/* Top Bar Row: Greeting & Actions */}
        <View style={[styles.topRow, isUrdu && styles.rtlRow]}>
          <View style={[styles.greetingCol, isUrdu ? { paddingLeft: 8 } : { paddingRight: 8 }]}>
            <Text style={[styles.greetingText, isUrdu && styles.rtlText]}>
              {isUrdu ? 'خوش آمدید!' : 'Welcome Back!'}
            </Text>
            <View style={[styles.subLocationRow, isUrdu && styles.rtlRow]}>
              <Text
                style={[styles.locationText, isUrdu && styles.rtlText]}
                numberOfLines={1}
              >
                {isUrdu ? 'قومی گرڈ لائیو سنک' : 'National Grid Live'}
              </Text>
            </View>
          </View>

          {/* Quick Header Actions */}
          <View style={styles.actionsRow}>
            {onToggleLanguage && (
              <TouchableOpacity
                style={styles.actionCircleBtn}
                onPress={() => onToggleLanguage(language === 'en' ? 'ur' : 'en')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionBtnText}>{isUrdu ? 'EN' : 'اردو'}</Text>
              </TouchableOpacity>
            )}

            {onToggleTheme && (
              <TouchableOpacity
                style={styles.actionCircleBtn}
                onPress={() => onToggleTheme(!darkMode)}
                activeOpacity={0.7}
              >
                <AppIcon
                  name={darkMode ? 'sun' : 'moon'}
                  size={15}
                  color={darkMode ? '#F59E0B' : '#62FF96'}
                />
              </TouchableOpacity>
            )}

            {/* Notification Bell with Electric Green Dot */}
            <TouchableOpacity
              style={styles.notificationBtn}
              onPress={onOpenNotifications}
              activeOpacity={0.7}
            >
              <AppIcon name="bell" size={18} color="#FFFFFF" />
              <View style={styles.unreadGreenDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bento Spending Metric Card with Animated Electric Grid Background */}
        <View style={styles.bentoCard}>
          {/* Dynamic Animated National Grid Background inside Total Due Card */}
          <ElectricGridAnimation darkMode={darkMode} />

          <View style={[styles.bentoTopRow, isUrdu && styles.rtlRow]}>
            <View>
              <Text style={[styles.bentoLabel, isUrdu && styles.rtlText]}>
                {isUrdu ? `کل واجب الادا رقم (${activeMonthText})` : `Total Due (${activeMonthText})`}
              </Text>
              <Text style={styles.bentoAmount}>
                Rs. {totalDueAmount.toLocaleString()}
              </Text>
            </View>

            {/* Electric Green Unpaid Badge */}
            <View style={styles.unpaidBadge}>
              <View style={styles.unpaidPingDot} />
              <Text style={styles.unpaidBadgeText}>
                {unpaidBillsCount > 0
                  ? `${unpaidBillsCount} ${isUrdu ? 'غیر ادا شدہ بل' : 'Unpaid Bills'}`
                  : (isUrdu ? 'کوئی بل باقی نہیں' : 'All Clear')}
              </Text>
            </View>
          </View>

          {/* Glowing 6-Month Trend SVG Graph */}
          <DashboardTrendGraph
            isUrdu={isUrdu}
            history={history}
            trendLabel={isUrdu ? `6 ماہ کا رجحان (${activeMonthText})` : `6-Month Trend (${activeMonthText})`}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroWrapper: {
    backgroundColor: '#0C2B4E',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  circuitDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    opacity: 0.12,
  },
  circuitLine: {
    width: 1,
    height: '100%',
    backgroundColor: '#62FF96',
  },
  heroContent: {
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  greetingCol: {
    flex: 1,
  },
  greetingText: {
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  subLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 6,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#62FF96',
    letterSpacing: 0.3,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3FFF8B',
  },
  syncText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionCircleBtn: {
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#213145',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#213145',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  unreadGreenDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#62FF96',
    borderWidth: 1.5,
    borderColor: '#0C2B4E',
  },
  bentoCard: {
    backgroundColor: '#0F2238',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(98, 255, 150, 0.40)',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#62FF96',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 14,
    elevation: 6,
  },
  bentoTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bentoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bentoAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  unpaidBadge: {
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unpaidPingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  unpaidBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rtlText: {
    textAlign: 'right',
  },
});

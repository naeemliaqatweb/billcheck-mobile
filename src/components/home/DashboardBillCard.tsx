import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SavedMeter } from '../../types/bill';
import { AppIcon } from '../AppIcon';
import { ProviderLogo } from '../ProviderLogo';
import { Language } from '../../i18n/translations';
import { NotificationService } from '../../services/notification';

interface DashboardBillCardProps {
  meter: SavedMeter;
  language: Language;
  darkMode: boolean;
  isLoading?: boolean;
  onCheckBill: (meter: SavedMeter) => void;
  onDownloadPdf?: (meter: SavedMeter) => void;
  onDeleteMeter?: (meter: SavedMeter) => void;
}

export const DashboardBillCard: React.FC<DashboardBillCardProps> = ({
  meter,
  language,
  darkMode,
  isLoading = false,
  onCheckBill,
  onDownloadPdf,
  onDeleteMeter,
}) => {
  const isUrdu = language === 'ur';
  const isGas = meter.utilityType === 'gas';

  const amount = meter.lastBillAmount;
  const dueDate = meter.lastDueDate;
  const status = meter.lastBillStatus;

  // Determine status pill style
  const renderStatusBadge = () => {
    if (status === 'paid') {
      return (
        <View style={[styles.statusBadge, styles.statusPaidBadge]}>
          <View style={[styles.statusDot, { backgroundColor: '#007237' }]} />
          <Text style={styles.statusPaidText}>
            {isUrdu ? 'ادا شدہ' : 'PAID'}
          </Text>
        </View>
      );
    }

    if (status === 'overdue') {
      return (
        <View style={[styles.statusBadge, styles.statusUnpaidBadge]}>
          <View style={[styles.statusDot, { backgroundColor: '#BA1A1A' }]} />
          <Text style={styles.statusUnpaidText}>
            {isUrdu ? 'تاریخ گزر چکی' : 'OVERDUE'}
          </Text>
        </View>
      );
    }

    if (status === 'unpaid') {
      return (
        <View style={[styles.statusBadge, styles.statusUnpaidBadge]}>
          <View style={[styles.statusDot, { backgroundColor: '#BA1A1A' }]} />
          <Text style={styles.statusUnpaidText}>
            {isUrdu ? 'غیر ادا شدہ' : 'UNPAID'}
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.statusBadge, styles.statusNeutralBadge]}>
        <View style={[styles.statusDot, { backgroundColor: '#62FF96' }]} />
        <Text style={styles.statusNeutralText}>
          {isUrdu ? 'محفوظ میٹر' : 'SAVED'}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.cardContainer, darkMode ? styles.darkCard : styles.lightCard]}>
      {/* Top Zone: Deep Navy Header with Circuit Styling */}
      <View style={styles.topZone}>
        <View style={styles.topHeaderLeft}>
          {/* Official Provider Logo */}
          <ProviderLogo code={meter.company} size={38} />

          {/* Provider and Nickname */}
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.companyText}>{meter.company}</Text>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.nicknameText}>{meter.nickname || (isGas ? 'Home Gas' : 'Home')}</Text>
            </View>
            <Text style={styles.refText}>
              Ref: {meter.referenceNumber}
              {meter.lastBillMonth ? ` • ${meter.lastBillMonth}` : ''}
            </Text>
          </View>
        </View>

        {/* Right Status Pill */}
        {renderStatusBadge()}
      </View>

      {/* Bottom Zone: Amount, Due Date and Quick Action Buttons */}
      <View style={[styles.bottomZone, darkMode ? styles.bottomZoneDark : styles.bottomZoneLight]}>
        <View style={[styles.amountDueDateRow, isUrdu && styles.rtlRow]}>
          {/* Payable Amount */}
          <View>
            <Text style={[styles.fieldLabel, darkMode ? styles.darkSub : styles.lightSub, isUrdu && styles.rtlText]}>
              {isUrdu ? 'واجب الادا رقم' : 'Payable Amount'}
            </Text>
            <Text style={[styles.amountVal, darkMode ? styles.darkText : styles.lightText]}>
              {amount !== undefined && amount !== null ? `Rs. ${amount.toLocaleString()}` : (isUrdu ? 'بل چیک کریں' : 'Tap to Check')}
            </Text>
          </View>

          {/* Due Date */}
          <View style={{ alignItems: isUrdu ? 'flex-start' : 'flex-end' }}>
            <Text style={[styles.fieldLabel, darkMode ? styles.darkSub : styles.lightSub, isUrdu && styles.rtlText]}>
              {isUrdu ? 'آخری تاریخ' : 'Due Date'}
            </Text>
            <View style={styles.dueDateRow}>
              <AppIcon name="calendar" size={13} color={status === 'paid' ? '#059669' : (dueDate ? '#BA1A1A' : '#778598')} />
              <Text
                style={[
                  styles.dueDateVal,
                  { color: status === 'paid' ? '#059669' : (dueDate ? '#BA1A1A' : '#778598') },
                ]}
              >
                {dueDate || '--'}
              </Text>
            </View>
          </View>
        </View>

        {/* Expected Next Bill Date Indicator */}
        {dueDate ? (
          <View style={[styles.predictionRow, darkMode ? styles.predictionRowDark : styles.predictionRowLight]}>
            <AppIcon name="bell" size={12} color={darkMode ? '#62FF96' : '#006D35'} />
            <Text style={[styles.predictionText, darkMode ? styles.predictionTextDark : styles.predictionTextLight]}>
              {isUrdu ? 'اگلا بل متوقع:' : 'Next Bill Expected:'}{' '}
              <Text style={{ fontWeight: '800' }}>
                {NotificationService.predictNextBillReleaseDate(dueDate, isUrdu)}
              </Text>
            </Text>
          </View>
        ) : null}

        {/* Action Buttons Grid */}
        <View style={styles.actionGrid}>
          {/* Download PDF button */}
          <TouchableOpacity
            style={[
              styles.downloadBtn,
              darkMode ? styles.downloadBtnDark : styles.downloadBtnLight,
            ]}
            onPress={() => onDownloadPdf ? onDownloadPdf(meter) : onCheckBill(meter)}
            activeOpacity={0.75}
          >
            <AppIcon
              name="document"
              size={16}
              color={darkMode ? '#FFFFFF' : '#0F1C2C'}
            />
            <Text
              style={[
                styles.downloadBtnText,
                darkMode ? styles.downloadBtnTextDark : styles.downloadBtnTextLight,
              ]}
            >
              {isUrdu ? 'پی ڈی ایف ڈاؤن لوڈ' : 'Download PDF'}
            </Text>
          </TouchableOpacity>

          {/* View Live Bill Details button */}
          <TouchableOpacity
            style={[styles.viewBillBtn, isGas && styles.gasViewBtn]}
            onPress={() => onCheckBill(meter)}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={isGas ? '#0F1C2C' : '#00210B'} />
            ) : (
              <>
                <AppIcon
                  name="receipt"
                  size={16}
                  color={isGas ? '#0F1C2C' : '#00210B'}
                />
                <Text
                  style={[
                    styles.viewBillText,
                    isGas && styles.gasViewText,
                  ]}
                >
                  {isUrdu ? 'بل دیکھیں' : 'View Bill'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 14,
  },
  darkCard: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  topZone: {
    backgroundColor: '#0F1C2C',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#213145',
    borderWidth: 1,
    borderColor: 'rgba(98, 255, 150, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  companyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#62FF96',
    letterSpacing: 0.3,
  },
  bulletDot: {
    color: '#778598',
    fontSize: 12,
  },
  nicknameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  refText: {
    fontSize: 11,
    color: '#778598',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusUnpaidBadge: {
    backgroundColor: '#FFDAD6',
  },
  statusUnpaidText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#93000A',
    letterSpacing: 0.4,
  },
  statusNeutralBadge: {
    backgroundColor: '#D3E4FE',
  },
  statusNeutralText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0B1C30',
    letterSpacing: 0.3,
  },
  statusPaidBadge: {
    backgroundColor: '#D1FAE5',
  },
  statusPaidText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#007237',
    letterSpacing: 0.4,
  },
  bottomZone: {
    padding: 16,
  },
  bottomZoneDark: {
    backgroundColor: '#1E293B',
  },
  bottomZoneLight: {
    backgroundColor: '#FFFFFF',
  },
  amountDueDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  amountVal: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  downloadBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  downloadBtnDark: {
    borderColor: '#334155',
    backgroundColor: '#0F1C2C',
  },
  downloadBtnLight: {
    borderColor: '#0F1C2C',
    backgroundColor: '#FFFFFF',
  },
  downloadBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  downloadBtnTextDark: {
    color: '#FFFFFF',
  },
  downloadBtnTextLight: {
    color: '#0F1C2C',
  },
  viewBillBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#3FFF8B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#3FFF8B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  gasViewBtn: {
    backgroundColor: '#E2E8F0',
    shadowOpacity: 0,
  },
  viewBillText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#00210B',
  },
  gasViewText: {
    color: '#0F1C2C',
  },
  darkText: {
    color: '#F8FAFC',
  },
  lightText: {
    color: '#0B1C30',
  },
  darkSub: {
    color: '#94A3B8',
  },
  lightSub: {
    color: '#334155',
  },
  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 2,
    borderWidth: 1,
  },
  predictionRowDark: {
    backgroundColor: '#0F1C2C',
    borderColor: 'rgba(98, 255, 150, 0.2)',
  },
  predictionRowLight: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  predictionText: {
    fontSize: 11,
    fontWeight: '500',
  },
  predictionTextDark: {
    color: '#94A3B8',
  },
  predictionTextLight: {
    color: '#166534',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
  },
});

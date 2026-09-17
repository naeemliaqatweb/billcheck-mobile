import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SavedMeter, BillStatus } from '../../types/bill';
import { AppIcon } from '../AppIcon';
import { ProviderLogo } from '../ProviderLogo';
import { Language } from '../../i18n/translations';
import { NotificationService } from '../../services/notification';
import { StorageService } from '../../services/storage';
import { parseDueDate } from '../../services/api';
import { getMeterShortName } from '../../utils/meterUtils';

interface DashboardBillCardProps {
  meter: SavedMeter;
  language: Language;
  darkMode: boolean;
  isLoading?: boolean;
  isDownloadingPdf?: boolean;
  onCheckBill: (meter: SavedMeter) => void;
  onDownloadPdf?: (meter: SavedMeter) => void;
  onDeleteMeter?: (meter: SavedMeter) => void;
  onStatusChange?: (meter: SavedMeter, newStatus: BillStatus) => void;
}

export const DashboardBillCard: React.FC<DashboardBillCardProps> = ({
  meter,
  language,
  darkMode,
  isLoading = false,
  isDownloadingPdf = false,
  onCheckBill,
  onDownloadPdf,
  onDeleteMeter,
  onStatusChange,
}) => {
  const isUrdu = language === 'ur';
  const isGas = meter.utilityType === 'gas';

  const amount = meter.lastBillAmount;
  const dueDate = meter.lastDueDate;

  const [localStatus, setLocalStatus] = React.useState<BillStatus | undefined>(meter.lastBillStatus);

  React.useEffect(() => {
    setLocalStatus(meter.lastBillStatus);
  }, [meter.lastBillStatus]);

  // Compute status: if marked paid, always show PAID. If unpaid & past due date, show OVERDUE
  const effectiveStatus: BillStatus = React.useMemo(() => {
    if (localStatus === 'paid') return 'paid';
    if (dueDate) {
      const parsedDue = parseDueDate(dueDate);
      if (parsedDue && parsedDue.getTime() < Date.now()) {
        return 'overdue';
      }
    }
    return localStatus || 'unpaid';
  }, [localStatus, dueDate]);

  const handleToggleStatus = async () => {
    const nextStatus: BillStatus = effectiveStatus === 'paid' ? 'unpaid' : 'paid';
    setLocalStatus(nextStatus);
    await StorageService.saveMeter({
      ...meter,
      lastBillStatus: nextStatus,
    });
    if (onStatusChange) {
      onStatusChange(meter, nextStatus);
    }
  };

  // Retrieve consumer name from meter or cached bill
  const [cachedName, setCachedName] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!meter.consumerName) {
      StorageService.getCachedBill(meter.company, meter.referenceNumber).then((cached) => {
        if (cached?.consumerName) {
          setCachedName(cached.consumerName);
        }
      });
    }
  }, [meter.company, meter.referenceNumber, meter.consumerName]);

  const consumerDisplayName = meter.consumerName || cachedName;

  // Clean nickname to avoid repeating company name e.g. "MEPCO • MEPCO (liaqat)"
  const getDisplayNickname = () => {
    return getMeterShortName({
      nickname: meter.nickname,
      company: meter.company,
      consumerName: consumerDisplayName,
    });
  };

  // Determine status pill style
  const renderStatusBadge = () => {
    if (effectiveStatus === 'paid') {
      return (
        <TouchableOpacity
          onPress={handleToggleStatus}
          activeOpacity={0.75}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          style={[styles.statusBadge, styles.statusPaidBadge]}
          accessibilityLabel="Mark Bill Unpaid"
        >
          <View style={[styles.statusDot, { backgroundColor: '#FFFFFF' }]} />
          <Text style={styles.statusPaidText}>
            {isUrdu ? 'ادا شدہ' : 'PAID'}
          </Text>
        </TouchableOpacity>
      );
    }

    if (effectiveStatus === 'overdue') {
      return (
        <TouchableOpacity
          onPress={handleToggleStatus}
          activeOpacity={0.75}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          style={[styles.statusBadge, styles.statusUnpaidBadge]}
          accessibilityLabel="Mark Bill Paid"
        >
          <View style={[styles.statusDot, { backgroundColor: '#FFFFFF' }]} />
          <Text style={styles.statusUnpaidText}>
            {isUrdu ? 'تاریخ گزر گئی' : 'OVERDUE'}
          </Text>
        </TouchableOpacity>
      );
    }

    if (effectiveStatus === 'unpaid') {
      return (
        <TouchableOpacity
          onPress={handleToggleStatus}
          activeOpacity={0.75}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          style={[styles.statusBadge, styles.statusUnpaidBadge]}
          accessibilityLabel="Mark Bill Paid"
        >
          <View style={[styles.statusDot, { backgroundColor: '#FFFFFF' }]} />
          <Text style={styles.statusUnpaidText}>
            {isUrdu ? 'غیر ادا شدہ' : 'UNPAID'}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={handleToggleStatus}
        activeOpacity={0.75}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        style={[styles.statusBadge, styles.statusNeutralBadge]}
        accessibilityLabel="Mark Bill Paid"
      >
        <View style={[styles.statusDot, { backgroundColor: '#FFFFFF' }]} />
        <Text style={styles.statusNeutralText}>
          {isUrdu ? 'محفوظ' : 'SAVED'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.cardContainer, darkMode ? styles.darkCard : styles.lightCard]}>
      {/* Top Zone: Deep Navy Header with Circuit Styling */}
      <View style={styles.topZone}>
        <View style={styles.topHeaderLeft}>
          {/* Official Provider Logo */}
          <ProviderLogo code={meter.company} size={36} />

          {/* Provider and Nickname */}
          <View style={styles.headerTextGroup}>
            <View style={styles.titleRow}>
              <Text style={styles.companyText}>{meter.company}</Text>
              <Text style={styles.bulletDot}>•</Text>
              <Text
                style={styles.nicknameText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {getDisplayNickname()}
              </Text>
            </View>
            <Text
              style={styles.refText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Ref: {meter.referenceNumber}
              {meter.lastBillMonth ? ` • ${meter.lastBillMonth}` : ''}
            </Text>
          </View>
        </View>

        {/* Right Status Pill & Delete Button */}
        <View style={styles.topHeaderRight}>
          {renderStatusBadge()}
          {onDeleteMeter && (
            <TouchableOpacity
              onPress={() => onDeleteMeter(meter)}
              activeOpacity={0.7}
              style={styles.deleteCircleBtn}
              accessibilityLabel="Delete Meter"
            >
              <AppIcon name="trash" size={12} color="#FF8A80" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Bottom Zone: Amount, Due Date and Quick Action Buttons */}
      <View style={[styles.bottomZone, darkMode ? styles.bottomZoneDark : styles.bottomZoneLight]}>
        {/* Consumer / Customer Name Info Row */}
        {consumerDisplayName ? (
          <View
            style={[
              styles.consumerContainer,
              darkMode ? styles.consumerContainerDark : styles.consumerContainerLight,
              isUrdu && styles.rtlRow,
            ]}
          >
            <View style={[styles.consumerLeftGroup, isUrdu && styles.rtlRow]}>
              <AppIcon
                name="user"
                size={13}
                color={darkMode ? '#62FF96' : '#006D35'}
              />
              <Text
                style={[
                  styles.consumerLabel,
                  darkMode ? styles.darkSub : styles.lightSub,
                ]}
              >
                {isUrdu ? 'صارف کا نام:' : 'Consumer:'}
              </Text>
            </View>
            <Text
              style={[
                styles.consumerNameText,
                darkMode ? styles.darkText : styles.lightText,
                isUrdu && styles.rtlText,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {consumerDisplayName}
            </Text>
          </View>
        ) : null}

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
              <AppIcon name="calendar" size={13} color={effectiveStatus === 'paid' ? '#059669' : (dueDate ? '#BA1A1A' : '#778598')} />
              <Text
                style={[
                  styles.dueDateVal,
                  { color: effectiveStatus === 'paid' ? '#059669' : (dueDate ? '#BA1A1A' : '#778598') },
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
              isDownloadingPdf && { opacity: 0.75 },
            ]}
            onPress={() => (onDownloadPdf ? onDownloadPdf(meter) : onCheckBill(meter))}
            disabled={isDownloadingPdf || isLoading}
            activeOpacity={0.75}
          >
            {isDownloadingPdf ? (
              <ActivityIndicator
                size="small"
                color={darkMode ? '#62FF96' : '#006D35'}
              />
            ) : (
              <AppIcon
                name="document"
                size={16}
                color={darkMode ? '#FFFFFF' : '#0F1C2C'}
              />
            )}
            <Text
              style={[
                styles.downloadBtnText,
                darkMode ? styles.downloadBtnTextDark : styles.downloadBtnTextLight,
              ]}
            >
              {isDownloadingPdf
                ? (isUrdu ? 'لوڈ ہو رہا ہے...' : 'Preparing PDF...')
                : (isUrdu ? 'پی ڈی ایف ڈاؤن لوڈ' : 'Download PDF')}
            </Text>
          </TouchableOpacity>

          {/* View Live Bill Details button */}
          <TouchableOpacity
            style={[
              styles.viewBillBtn,
              darkMode ? styles.viewBillBtnDark : styles.viewBillBtnLight,
              isGas && (darkMode ? styles.gasViewBtnDark : styles.gasViewBtnLight),
            ]}
            onPress={() => onCheckBill(meter)}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <>
                <AppIcon
                  name="receipt"
                  size={16}
                  color="#FFFFFF"
                />
                <Text
                  style={[
                    styles.viewBillText,
                    darkMode ? styles.viewBillTextDark : styles.viewBillTextLight,
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
    backgroundColor: '#16253B',
    borderColor: '#284163',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D5E2EE',
  },
  topZone: {
    backgroundColor: '#0C2B4E',
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  topHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  headerTextGroup: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  companyText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#62FF96',
    letterSpacing: 0.3,
    flexShrink: 0,
  },
  bulletDot: {
    color: '#FFFFFF',
    fontSize: 11,
    flexShrink: 0,
  },
  nicknameText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  refText: {
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  topHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  statusBadge: {
    paddingHorizontal: 7.5,
    paddingVertical: 3.5,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    flexShrink: 0,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusUnpaidBadge: {
    backgroundColor: '#DC2626',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusUnpaidText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  statusNeutralBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  statusNeutralText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  statusPaidBadge: {
    backgroundColor: '#059669',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusPaidText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  bottomZone: {
    padding: 16,
  },
  bottomZoneDark: {
    backgroundColor: '#16253B',
  },
  bottomZoneLight: {
    backgroundColor: '#FFFFFF',
  },
  consumerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    gap: 8,
  },
  consumerContainerDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: '#284163',
  },
  consumerContainerLight: {
    backgroundColor: '#F0F5FA',
    borderColor: '#D5E2EE',
  },
  consumerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
  },
  consumerLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  consumerNameText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  amountDueDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
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
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  downloadBtn: {
    flex: 1,
    height: 44,
    minHeight: 44,
    maxHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 0,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  downloadBtnDark: {
    borderColor: '#284E77',
    backgroundColor: '#0C2B4E',
  },
  downloadBtnLight: {
    borderColor: '#0C2B4E',
    backgroundColor: '#F0F5FA',
  },
  downloadBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  downloadBtnTextDark: {
    color: '#FFFFFF',
  },
  downloadBtnTextLight: {
    color: '#0A1C30',
  },
  viewBillBtn: {
    flex: 1,
    height: 44,
    minHeight: 44,
    maxHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  viewBillBtnDark: {
    backgroundColor: '#059669',
  },
  viewBillBtnLight: {
    backgroundColor: '#059669',
  },
  gasViewBtnDark: {
    backgroundColor: '#284E77',
  },
  gasViewBtnLight: {
    backgroundColor: '#0C2B4E',
  },
  viewBillText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  viewBillTextDark: {
    color: '#FFFFFF',
  },
  viewBillTextLight: {
    color: '#FFFFFF',
  },
  darkText: {
    color: '#F8FAFC',
  },
  lightText: {
    color: '#0A1C30',
  },
  darkSub: {
    color: '#CBD5E1',
  },
  lightSub: {
    color: '#334E68',
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
    backgroundColor: '#0C2B4E',
    borderColor: 'rgba(98, 255, 150, 0.2)',
  },
  predictionRowLight: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  predictionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  predictionTextDark: {
    color: '#FFFFFF',
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
  deleteCircleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 138, 128, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

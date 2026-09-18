import React from 'react';
import {
  View,
  Text,
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
import { styles } from '../../styles/DashboardBillCard.styles';

interface DashboardBillCardProps {
  meter: SavedMeter;
  language: Language;
  darkMode: boolean;
  isLoading?: boolean;
  isLoadingOfficial?: boolean;
  onCheckBill: (meter: SavedMeter) => void;
  onOfficialView?: (meter: SavedMeter) => void;
  onDeleteMeter?: (meter: SavedMeter) => void;
  onStatusChange?: (meter: SavedMeter, newStatus: BillStatus) => void;
}

export const DashboardBillCard: React.FC<DashboardBillCardProps> = ({
  meter,
  language,
  darkMode,
  isLoading = false,
  isLoadingOfficial = false,
  onCheckBill,
  onOfficialView,
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
          <View style={[styles.dueDateCol, isUrdu ? styles.alignStart : styles.alignEnd]}>
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
              <Text style={styles.predictionHighlight}>
                {NotificationService.predictNextBillReleaseDate(dueDate, isUrdu)}
              </Text>
            </Text>
          </View>
        ) : null}

        {/* Action Buttons Grid */}
        <View style={styles.actionGrid}>
          {/* Official View / Duplicate Bill button */}
          <TouchableOpacity
            style={[
              styles.officialViewBtn,
              darkMode ? styles.officialViewBtnDark : styles.officialViewBtnLight,
              isLoadingOfficial && { opacity: 0.75 },
            ]}
            onPress={() => (onOfficialView ? onOfficialView(meter) : onCheckBill(meter))}
            disabled={isLoadingOfficial || isLoading}
            activeOpacity={0.75}
            accessibilityLabel="Official Duplicate Bill View"
          >
            {isLoadingOfficial ? (
              <ActivityIndicator
                size="small"
                color={darkMode ? '#62FF96' : '#006D35'}
              />
            ) : (
              <AppIcon
                name="document"
                size={15}
                color={darkMode ? '#62FF96' : '#006D35'}
              />
            )}
            <Text
              style={[
                styles.officialViewBtnText,
                darkMode ? styles.officialViewBtnTextDark : styles.officialViewBtnTextLight,
              ]}
            >
              {isLoadingOfficial
                ? (isUrdu ? 'لوڈ ہو رہا ہے...' : 'Loading PDF...')
                : (isUrdu ? 'پی ڈی ایف بل' : 'PDF Bill')}
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


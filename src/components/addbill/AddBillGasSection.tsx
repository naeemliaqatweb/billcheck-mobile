import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { AppIcon } from '../AppIcon';
import { SngplConsumerParams } from '../../services/api';

interface AddBillGasSectionProps {
  sngplParams: SngplConsumerParams | null;
  fetchingSngpl: boolean;
  onFetchSngpl: () => void;
  currentReading: string;
  onChangeCurrentReading: (text: string) => void;
  currentReadingDate: string;
  onChangeCurrentReadingDate: (text: string) => void;
  isRefValid: boolean;
  darkMode: boolean;
  isUrdu: boolean;
  labels: {
    fetchSngplDetails: string;
    fetchingSngplDetails: string;
    sngplBaselineTitle: string;
    sngplCategory: string;
    sngplStatus: string;
    sngplPrevReading: string;
    sngplPrevReadingDate: string;
    sngplGcvPressure: string;
    sngplCurrentReadingLabel: string;
    sngplCurrentReadingPlaceholder: string;
    sngplCurrentReadingSub: string;
    sngplCurrentReadingDateLabel: string;
    sngplNoAutoFetchNoticeTitle: string;
    sngplNoAutoFetchNoticeBody: string;
    requiredBadge: string;
  };
}

export const AddBillGasSection: React.FC<AddBillGasSectionProps> = ({
  sngplParams,
  fetchingSngpl,
  onFetchSngpl,
  currentReading,
  onChangeCurrentReading,
  currentReadingDate,
  onChangeCurrentReadingDate,
  isRefValid,
  darkMode,
  isUrdu,
  labels,
}) => {
  return (
    <View style={styles.container}>
      {/* Step 1: Trigger to Fetch Baseline Details if not yet loaded */}
      {!sngplParams ? (
        <TouchableOpacity
          style={[
            styles.fetchParamsBtn,
            darkMode ? styles.fetchParamsBtnDark : styles.fetchParamsBtnLight,
            (!isRefValid || fetchingSngpl) && styles.fetchParamsBtnDisabled,
          ]}
          onPress={onFetchSngpl}
          disabled={!isRefValid || fetchingSngpl}
          activeOpacity={0.8}
        >
          {fetchingSngpl ? (
            <View style={styles.btnRow}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.fetchBtnText}>{labels.fetchingSngplDetails}</Text>
            </View>
          ) : (
            <View style={styles.btnRow}>
              <AppIcon name="search" size={18} color="#FFFFFF" />
              <Text style={styles.fetchBtnText}>{labels.fetchSngplDetails}</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        /* Step 2: Display Baseline Details Once Fetched */
        <View style={styles.flowWrap}>
          {/* Baseline Card */}
          <View
            style={[
              styles.baselineCard,
              darkMode ? styles.baselineCardDark : styles.baselineCardLight,
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <AppIcon name="verified" size={18} color="#059669" />
                <Text
                  style={[
                    styles.cardHeaderTitle,
                    darkMode ? styles.textDark : styles.textLight,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {labels.sngplBaselineTitle}
                </Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  sngplParams.protectedStatus === 'Protected'
                    ? styles.statusProtected
                    : styles.statusNormal,
                ]}
              >
                <Text style={styles.statusPillText}>
                  {sngplParams.protectedStatus}
                </Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text
                  style={[
                    styles.metricLabel,
                    darkMode ? styles.subDark : styles.subLight,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {labels.sngplCategory}
                </Text>
                <Text
                  style={[
                    styles.metricValue,
                    darkMode ? styles.textDark : styles.textLight,
                  ]}
                >
                  {sngplParams.category}
                </Text>
              </View>

              <View style={styles.metricItem}>
                <Text
                  style={[
                    styles.metricLabel,
                    darkMode ? styles.subDark : styles.subLight,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {labels.sngplPrevReading}
                </Text>
                <Text
                  style={[
                    styles.metricValueMono,
                    { color: darkMode ? '#3FFF8B' : '#006D35' },
                  ]}
                >
                  {sngplParams.previousRead}
                </Text>
              </View>

              <View style={styles.metricItem}>
                <Text
                  style={[
                    styles.metricLabel,
                    darkMode ? styles.subDark : styles.subLight,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {labels.sngplPrevReadingDate}
                </Text>
                <Text
                  style={[
                    styles.metricValue,
                    darkMode ? styles.textDark : styles.textLight,
                  ]}
                >
                  {sngplParams.previousReadDt}
                </Text>
              </View>

              <View style={styles.metricItem}>
                <Text
                  style={[
                    styles.metricLabel,
                    darkMode ? styles.subDark : styles.subLight,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {labels.sngplGcvPressure}
                </Text>
                <Text
                  style={[
                    styles.metricValue,
                    darkMode ? styles.textDark : styles.textLight,
                  ]}
                >
                  {sngplParams.gcv} / {sngplParams.pressureFactor}
                </Text>
              </View>
            </View>
          </View>

          {/* 2 Input Fields Shown After Data Fetched */}
          <View
            style={[
              styles.inputsCard,
              darkMode ? styles.inputsCardDark : styles.inputsCardLight,
            ]}
          >
            {/* Input 1: Current Meter Reading */}
            <View style={styles.inputGroup}>
              <View style={styles.fieldLabelRow}>
                <View style={styles.labelLeft}>
                  <AppIcon name="speed" size={16} color="#0284C7" />
                  <Text
                    style={[
                      styles.fieldLabel,
                      darkMode ? styles.textDark : styles.textLight,
                      isUrdu && styles.rtlText,
                    ]}
                  >
                    {labels.sngplCurrentReadingLabel}
                  </Text>
                </View>
                <Text style={styles.requiredText}>{labels.requiredBadge}</Text>
              </View>

              <View
                style={[
                  styles.textInputWrap,
                  darkMode ? styles.inputDark : styles.inputLight,
                  currentReading.length >= 8 && styles.inputValidBorder,
                ]}
              >
                <TextInput
                  style={[
                    styles.textInput,
                    styles.monoInput,
                    darkMode ? styles.textDark : styles.textLight,
                    isUrdu && styles.rtlText,
                  ]}
                  placeholder={labels.sngplCurrentReadingPlaceholder}
                  placeholderTextColor={darkMode ? '#64748B' : '#94A3B8'}
                  value={currentReading}
                  onChangeText={(val) =>
                    onChangeCurrentReading(val.replace(/[^0-9]/g, ''))
                  }
                  keyboardType="numeric"
                  maxLength={8}
                />
              </View>
              <Text
                style={[
                  styles.fieldSubtext,
                  darkMode ? styles.subDark : styles.subLight,
                  isUrdu && styles.rtlText,
                ]}
              >
                {labels.sngplCurrentReadingSub}
              </Text>
            </View>

            {/* Input 2: Current Reading Date */}
            <View style={styles.inputGroup}>
              <View style={styles.fieldLabelRow}>
                <View style={styles.labelLeft}>
                  <AppIcon name="calendar-today" size={16} color="#F59E0B" />
                  <Text
                    style={[
                      styles.fieldLabel,
                      darkMode ? styles.textDark : styles.textLight,
                      isUrdu && styles.rtlText,
                    ]}
                  >
                    {labels.sngplCurrentReadingDateLabel}
                  </Text>
                </View>
                <Text style={styles.requiredText}>{labels.requiredBadge}</Text>
              </View>

              <View
                style={[
                  styles.textInputWrap,
                  darkMode ? styles.inputDark : styles.inputLight,
                ]}
              >
                <TextInput
                  style={[
                    styles.textInput,
                    styles.monoInput,
                    darkMode ? styles.textDark : styles.textLight,
                    isUrdu && styles.rtlText,
                  ]}
                  value={currentReadingDate}
                  onChangeText={onChangeCurrentReadingDate}
                  placeholder="DD-MM-YYYY"
                  placeholderTextColor={darkMode ? '#64748B' : '#94A3B8'}
                  maxLength={10}
                />
              </View>
            </View>
          </View>

          {/* Prominent Disclaimer/Notice: SNGPL will NOT auto-fetch; user must enter reading next time */}
          <View
            style={[
              styles.noticeCard,
              darkMode ? styles.noticeCardDark : styles.noticeCardLight,
            ]}
          >
            <View style={styles.noticeHeader}>
              <AppIcon name="info" size={18} color="#D97706" />
              <Text
                style={[
                  styles.noticeTitle,
                  darkMode ? styles.noticeTitleDark : styles.noticeTitleLight,
                  isUrdu && styles.rtlText,
                ]}
              >
                {labels.sngplNoAutoFetchNoticeTitle}
              </Text>
            </View>
            <Text
              style={[
                styles.noticeBody,
                darkMode ? styles.noticeBodyDark : styles.noticeBodyLight,
                isUrdu && styles.rtlText,
              ]}
            >
              {labels.sngplNoAutoFetchNoticeBody}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  fetchParamsBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  fetchParamsBtnLight: {
    backgroundColor: '#0284C7',
  },
  fetchParamsBtnDark: {
    backgroundColor: '#0369A1',
  },
  fetchParamsBtnDisabled: {
    opacity: 0.5,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fetchBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  flowWrap: {
    gap: 14,
  },
  baselineCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  baselineCardLight: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  baselineCardDark: {
    backgroundColor: '#062B1E',
    borderColor: '#0F5132',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.2)',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusProtected: {
    backgroundColor: '#10B981',
  },
  statusNormal: {
    backgroundColor: '#0284C7',
  },
  statusPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  metricValueMono: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  inputsCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 14,
  },
  inputsCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  inputsCardDark: {
    backgroundColor: '#0F1E33',
    borderColor: '#1E3A5F',
  },
  inputGroup: {
    gap: 6,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  requiredText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '700',
  },
  textInputWrap: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  inputLight: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  inputDark: {
    backgroundColor: '#0B1524',
    borderColor: '#FFFFFF',
    borderWidth: 1.5,
  },
  inputValidBorder: {
    borderColor: '#059669',
  },
  textInput: {
    fontSize: 14,
    padding: 0,
    fontWeight: '600',
  },
  monoInput: {
    fontFamily: 'monospace',
    letterSpacing: 1.5,
  },
  fieldSubtext: {
    fontSize: 11,
    lineHeight: 15,
  },
  noticeCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  noticeCardLight: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
  },
  noticeCardDark: {
    backgroundColor: '#291E04',
    borderColor: '#8D6409',
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  noticeTitle: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  noticeTitleLight: {
    color: '#B45309',
  },
  noticeTitleDark: {
    color: '#FBBF24',
  },
  noticeBody: {
    fontSize: 11.5,
    lineHeight: 17,
  },
  noticeBodyLight: {
    color: '#92400E',
  },
  noticeBodyDark: {
    color: '#FDE68A',
  },
  textLight: {
    color: '#0F172A',
  },
  textDark: {
    color: '#F8FAFC',
  },
  subLight: {
    color: '#64748B',
  },
  subDark: {
    color: '#94A3B8',
  },
  rtlText: {
    textAlign: 'right',
  },
});

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { ProviderInfo } from '../../constants/providers';
import { getProviderLogo } from '../../constants/providerLogos';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/AddBillScreen.styles';

interface AddBillFormFieldsProps {
  selectedProvider: ProviderInfo;
  onChangeProvider?: () => void;
  referenceNo: string;
  onChangeReferenceNo: (text: string) => void;
  onClearReferenceNo: () => void;
  consumerNo?: string;
  onChangeConsumerNo?: (text: string) => void;
  onClearConsumerNo?: () => void;
  isRefValid: boolean;
  nickname: string;
  onChangeNickname: (text: string) => void;
  darkMode: boolean;
  isUrdu: boolean;
  labels: {
    selectDistCompany: string;
    discoSngplBadge: string;
    changeCompany: string;
    enter14DigitRef: string;
    enterConsumerIdLabel: string;
    requiredBadge: string;
    refFormatNotice: string;
    refDigitsValid: string;
    billNickname: string;
    optionalBadge: string;
    billNicknamePlaceholder: string;
    billNicknameSub: string;
  };
}

export const AddBillFormFields: React.FC<AddBillFormFieldsProps> = ({
  selectedProvider,
  onChangeProvider,
  referenceNo,
  onChangeReferenceNo,
  onClearReferenceNo,
  consumerNo = '',
  onChangeConsumerNo,
  onClearConsumerNo,
  isRefValid,
  nickname,
  onChangeNickname,
  darkMode,
  isUrdu,
  labels,
}) => {
  const logo = getProviderLogo(selectedProvider.code);
  const isKE = selectedProvider.code === 'KELECTRIC' || selectedProvider.code === 'KE';

  const refLabel = isKE
    ? (isUrdu ? '13 ہندسوں کا اکاؤنٹ نمبر' : '13-Digit Account Number')
    : selectedProvider.type === 'gas'
      ? labels.enterConsumerIdLabel
      : labels.enter14DigitRef;

  const keNotice = isUrdu
    ? 'کے الیکٹرک بل کے اوپر دائیں کونے سے 13 ہندسوں کا اکاؤنٹ نمبر درج کریں'
    : 'Enter 13-digit Account Number from top right of your KE bill';

  return (
    <View style={[styles.formCard, darkMode ? styles.darkCard : styles.lightCard]}>
      {/* Field 1: Distribution Company Selector */}
      <View style={styles.fieldGroup}>
        <View style={styles.fieldLabelRow}>
          <View style={styles.fieldLabelLeft}>
            <AppIcon name="corporate-fare" size={16} color="#0284C7" />
            <Text
              style={[
                styles.fieldLabel,
                darkMode ? styles.darkText : styles.lightText,
                isUrdu && styles.rtlText,
              ]}
            >
              {labels.selectDistCompany}
            </Text>
          </View>
          <View style={[styles.fieldBadge, darkMode ? styles.darkBox : styles.lightBox]}>
            <Text
              style={[
                styles.fieldBadgeText,
                darkMode ? styles.darkSub : styles.lightSub,
              ]}
            >
              {labels.discoSngplBadge}
            </Text>
          </View>
        </View>

        {/* Selected Provider Box with Change Button */}
        <TouchableOpacity
          style={[
            styles.providerSelectedBox,
            darkMode ? styles.darkInput : styles.lightInput,
            { borderColor: darkMode ? '#FFFFFF' : '#D5E2EE' },
          ]}
          onPress={onChangeProvider}
          activeOpacity={0.7}
        >
          <View style={styles.providerSelectedLeft}>
            <View
              style={[
                styles.selectedLogoBox,
                darkMode ? styles.darkBox : styles.lightBox,
              ]}
            >
              {logo ? (
                <Image
                  source={logo}
                  style={styles.selectedLogoImg}
                  resizeMode="contain"
                />
              ) : (
                <AppIcon name="bolt" size={20} color="#006D35" />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.selectedCodeText,
                  darkMode ? styles.darkText : styles.lightText,
                ]}
              >
                {selectedProvider.name}
              </Text>
              <Text
                style={[
                  styles.selectedFullNameText,
                  darkMode ? styles.darkSub : styles.lightSub,
                ]}
                numberOfLines={2}
              >
                {selectedProvider.fullName}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.changeBtn,
              darkMode ? styles.darkBox : styles.lightBox,
            ]}
          >
            <Text
              style={[
                styles.changeBtnText,
                darkMode && styles.changeBtnTextDark,
              ]}
            >
              {labels.changeCompany}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Field 2: Reference Number / Account Number */}
      <View style={styles.fieldGroup}>
        <View style={styles.fieldLabelRow}>
          <View style={styles.fieldLabelLeft}>
            <AppIcon name="receipt" size={16} color="#006D35" />
            <Text
              style={[
                styles.fieldLabel,
                darkMode ? styles.darkText : styles.lightText,
                isUrdu && styles.rtlText,
              ]}
            >
              {refLabel}
            </Text>
          </View>
          <Text style={styles.requiredText}>{labels.requiredBadge}</Text>
        </View>

        <View
          style={[
            styles.inputWrap,
            darkMode ? styles.darkInput : styles.lightInput,
            isRefValid && { borderColor: '#006D35' },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              styles.monoInput,
              darkMode ? styles.darkText : styles.lightText,
              isUrdu && styles.rtlText,
            ]}
            placeholder={isKE ? '0400014224678' : (selectedProvider.refPlaceholder || '04 11223 0987600')}
            placeholderTextColor={darkMode ? '#64748B' : '#94A3B8'}
            value={referenceNo}
            onChangeText={onChangeReferenceNo}
            keyboardType="numeric"
            maxLength={isKE ? 13 : (selectedProvider.refLength || (selectedProvider.type === 'gas' ? 10 : 14))}
          />
          {referenceNo.length > 0 && (
            <TouchableOpacity onPress={onClearReferenceNo} activeOpacity={0.7}>
              <AppIcon name="close" size={18} color={darkMode ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.validationHelperRow}>
          <Text
            style={[
              styles.formatText,
              darkMode ? styles.darkSub : styles.lightSub,
            ]}
          >
            {isKE ? keNotice : labels.refFormatNotice}
          </Text>
          {isRefValid ? (
            <Text
              style={[
                styles.validStatusText,
                darkMode && styles.validStatusTextDark,
              ]}
            >
              ● {isKE ? (isUrdu ? 'اکاؤنٹ نمبر درست ہے' : 'Account Number Valid') : labels.refDigitsValid}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Field 2b: Consumer Number (Specifically for K-Electric) */}
      {isKE && (
        <View style={styles.fieldGroup}>
          <View style={styles.fieldLabelRow}>
            <View style={styles.fieldLabelLeft}>
              <AppIcon name="person" size={16} color="#0284C7" />
              <Text
                style={[
                  styles.fieldLabel,
                  darkMode ? styles.darkText : styles.lightText,
                  isUrdu && styles.rtlText,
                ]}
              >
                {isUrdu ? 'کنزیومر نمبر' : 'Consumer Number'}
              </Text>
            </View>
            <View style={[styles.fieldBadge, darkMode ? styles.darkBox : styles.lightBox]}>
              <Text
                style={[
                  styles.fieldBadgeText,
                  darkMode ? styles.darkSub : styles.lightSub,
                ]}
              >
                {isUrdu ? 'بل شناختی کوڈ' : 'Consumer ID'}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.inputWrap,
              darkMode ? styles.darkInput : styles.lightInput,
              consumerNo.length >= 6 && { borderColor: '#0284C7' },
            ]}
          >
            <TextInput
              style={[
                styles.textInput,
                styles.monoInput,
                darkMode ? styles.darkText : styles.lightText,
                isUrdu && styles.rtlText,
              ]}
              placeholder="AL868024"
              placeholderTextColor={darkMode ? '#64748B' : '#94A3B8'}
              value={consumerNo}
              onChangeText={onChangeConsumerNo}
              autoCapitalize="characters"
              maxLength={10}
            />
            {consumerNo.length > 0 && onClearConsumerNo && (
              <TouchableOpacity onPress={onClearConsumerNo} activeOpacity={0.7}>
                <AppIcon name="close" size={18} color={darkMode ? '#94A3B8' : '#64748B'} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.validationHelperRow}>
            <Text
              style={[
                styles.formatText,
                darkMode ? styles.darkSub : styles.lightSub,
              ]}
            >
              {isUrdu
                ? 'کے الیکٹرک بل پر درج کنزیومر نمبر (جیسے AL868024)'
                : 'Consumer Number from your KE bill (e.g. AL868024)'}
            </Text>
          </View>
        </View>
      )}

      {/* Field 3: Bill Nickname (Optional) */}
      <View style={styles.fieldGroup}>
        <View style={styles.fieldLabelRow}>
          <View style={styles.fieldLabelLeft}>
            <AppIcon name="bookmark" size={16} color="#6366F1" />
            <Text
              style={[
                styles.fieldLabel,
                darkMode ? styles.darkText : styles.lightText,
                isUrdu && styles.rtlText,
              ]}
            >
              {labels.billNickname}
            </Text>
          </View>
          <View style={[styles.fieldBadge, darkMode ? styles.darkBox : styles.lightBox]}>
            <Text
              style={[
                styles.fieldBadgeText,
                darkMode ? styles.darkSub : styles.lightSub,
              ]}
            >
              {labels.optionalBadge}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.inputWrap,
            darkMode ? styles.darkInput : styles.lightInput,
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              darkMode ? styles.darkText : styles.lightText,
              isUrdu && styles.rtlText,
            ]}
            placeholder={labels.billNicknamePlaceholder}
            placeholderTextColor={darkMode ? '#64748B' : '#94A3B8'}
            value={nickname}
            onChangeText={onChangeNickname}
          />
        </View>
        <Text
          style={[
            styles.mainSubtitle,
            darkMode ? styles.darkSub : styles.lightSub,
            isUrdu && styles.rtlText,
          ]}
        >
          {labels.billNicknameSub}
        </Text>
      </View>
    </View>
  );
};

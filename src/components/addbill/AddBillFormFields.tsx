import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { ProviderInfo } from '../../constants/providers';
import { getProviderLogo } from '../../constants/providerLogos';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/AddBillScreen.styles';

interface AddBillFormFieldsProps {
  selectedProvider: ProviderInfo;
  onChangeProvider: () => void;
  referenceNo: string;
  onChangeReferenceNo: (text: string) => void;
  onClearReferenceNo: () => void;
  isRefValid: boolean;
  nickname: string;
  onChangeNickname: (text: string) => void;
  darkMode: boolean;
  isUrdu: boolean;
  onOpenRefGuide?: () => void;
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
  isRefValid,
  nickname,
  onChangeNickname,
  darkMode,
  isUrdu,
  onOpenRefGuide,
  labels,
}) => {
  const logo = getProviderLogo(selectedProvider.code);

  const refLabel =
    selectedProvider.type === 'gas' ||
    selectedProvider.code === 'KELECTRIC' ||
    selectedProvider.code === 'KE'
      ? labels.enterConsumerIdLabel
      : labels.enter14DigitRef;

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
            { borderColor: darkMode ? '#334155' : '#CBD5E1' },
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

      {/* Field 2: Reference Number */}
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {onOpenRefGuide && (
              <TouchableOpacity
                onPress={onOpenRefGuide}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 3,
                  backgroundColor: darkMode ? '#1E293B' : '#E0F2FE',
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                  borderRadius: 6,
                }}
              >
                <AppIcon name="help-circle" size={12} color="#0284C7" />
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: '#0284C7',
                  }}
                >
                  {isUrdu ? 'بل پر کہاں ہے؟' : 'Where on bill?'}
                </Text>
              </TouchableOpacity>
            )}
            <Text style={styles.requiredText}>{labels.requiredBadge}</Text>
          </View>
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
            placeholder={selectedProvider.refPlaceholder || '04 11223 0987600'}
            placeholderTextColor={darkMode ? '#64748B' : '#94A3B8'}
            value={referenceNo}
            onChangeText={onChangeReferenceNo}
            keyboardType="numeric"
            maxLength={18}
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
            {labels.refFormatNotice}
          </Text>
          {isRefValid ? (
            <Text
              style={[
                styles.validStatusText,
                darkMode && styles.validStatusTextDark,
              ]}
            >
              ● {labels.refDigitsValid}
            </Text>
          ) : null}
        </View>
      </View>

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

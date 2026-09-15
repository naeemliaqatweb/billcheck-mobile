import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { ProviderInfo, ELECTRICITY_PROVIDERS, GAS_PROVIDERS } from '../../constants/providers';
import { getProviderLogo } from '../../constants/providerLogos';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/AddBillScreen.styles';

interface AddBillFormFieldsProps {
  selectedProvider: ProviderInfo;
  onSelectProvider?: (provider: ProviderInfo) => void;
  availableProviders?: ProviderInfo[];
  onChangeProvider?: () => void;
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
  onSelectProvider,
  availableProviders,
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
  const providerList =
    availableProviders ||
    (selectedProvider.type === 'gas' ? GAS_PROVIDERS : ELECTRICITY_PROVIDERS);

  const refLabel =
    selectedProvider.type === 'gas' ||
    selectedProvider.code === 'KELECTRIC' ||
    selectedProvider.code === 'KE'
      ? labels.enterConsumerIdLabel
      : labels.enter14DigitRef;

  return (
    <View style={[styles.formCard, darkMode ? styles.darkCard : styles.lightCard]}>
      {/* Field 1: Distribution Company Selector Grid */}
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
              {selectedProvider.type === 'gas'
                ? isUrdu
                  ? 'سوئی گیس'
                  : '2 Gas Companies'
                : isUrdu
                ? '11 ڈسکوز'
                : '11 DISCOs'}
            </Text>
          </View>
        </View>

        {/* Provider Selection Grid */}
        <View style={styles.providerGrid}>
          {providerList.map((provider) => {
            const isSelected = selectedProvider.code === provider.code;
            const provLogo = getProviderLogo(provider.code);
            const isGas = provider.type === 'gas';

            return (
              <TouchableOpacity
                key={provider.code}
                style={[
                  styles.gridCard,
                  isGas && styles.gridCardGas,
                  darkMode ? styles.gridCardDark : styles.gridCardLight,
                  isSelected &&
                    (darkMode
                      ? styles.gridCardActiveDark
                      : styles.gridCardActiveLight),
                ]}
                onPress={() => onSelectProvider && onSelectProvider(provider)}
                activeOpacity={0.7}
              >
                {/* Active Checkmark Badge */}
                {isSelected && (
                  <View style={styles.gridActiveCheckBadge}>
                    <AppIcon name="check" size={9} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}

                <View
                  style={[
                    styles.gridLogoBox,
                    darkMode ? styles.darkBox : styles.lightBox,
                    isSelected && {
                      borderColor: darkMode ? '#3FFF8B' : '#059669',
                    },
                  ]}
                >
                  {provLogo ? (
                    <Image
                      source={provLogo}
                      style={styles.gridLogoImg}
                      resizeMode="contain"
                    />
                  ) : (
                    <AppIcon
                      name="bolt"
                      size={16}
                      color={isSelected ? '#10B981' : '#006D35'}
                    />
                  )}
                </View>

                <Text
                  style={[
                    styles.gridCodeText,
                    darkMode ? styles.darkText : styles.lightText,
                    isSelected && {
                      color: darkMode ? '#3FFF8B' : '#006D35',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {provider.name}
                </Text>

                <Text
                  style={[
                    styles.gridRegionText,
                    darkMode ? styles.darkSub : styles.lightSub,
                  ]}
                  numberOfLines={1}
                >
                  {provider.region ? provider.region.split(',')[0] : provider.fullName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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

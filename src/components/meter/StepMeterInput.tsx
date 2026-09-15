import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ProviderInfo } from '../../types/bill';
import { AppIcon } from '../AppIcon';
import { ProviderLogo } from '../ProviderLogo';
import { FloatingLabelInput } from '../FloatingLabelInput';
import { styles } from '../../styles/AddMeterModal.styles';

export type SearchMode = 'refno' | 'consumerid';

interface StepMeterInputProps {
  selectedProvider: ProviderInfo;
  searchMode: SearchMode;
  setSearchMode: (mode: SearchMode) => void;
  inputValue: string;
  setInputValue: (val: string) => void;
  nickname: string;
  setNickname: (val: string) => void;
  saving: boolean;
  onSave: () => void;
  isUrdu: boolean;
  c: {
    bg: string;
    card: string;
    border: string;
    text: string;
    sub: string;
    input: string;
    accent: string;
  };
}

export const StepMeterInput: React.FC<StepMeterInputProps> = ({
  selectedProvider,
  searchMode,
  setSearchMode,
  inputValue,
  setInputValue,
  nickname,
  setNickname,
  saving,
  onSave,
  isUrdu,
  c,
}) => {
  const requiredLength = searchMode === 'refno' ? selectedProvider.refLength : 10;
  const isComplete = inputValue.length === requiredLength;

  return (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      {/* Provider badge */}
      <View
        style={[
          styles.selectedProviderBadge,
          { backgroundColor: selectedProvider.badgeColor + '18' },
        ]}
      >
        <ProviderLogo
          code={selectedProvider.code}
          size={44}
          badgeColor={selectedProvider.badgeColor}
        />
        <View>
          <Text style={[styles.selectedProvName, { color: selectedProvider.badgeColor }]}>
            {selectedProvider.code}
          </Text>
          <Text style={[styles.selectedProvFull, { color: c.sub }]}>
            {selectedProvider.fullName}
          </Text>
        </View>
      </View>

      {/* Search Mode Toggle */}
      <Text style={[styles.fieldLabel, { color: c.sub }]}>Search by</Text>
      <View style={[styles.toggleRow, { backgroundColor: c.input, borderColor: c.border }]}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            searchMode === 'refno' && { backgroundColor: selectedProvider.badgeColor },
          ]}
          onPress={() => {
            setSearchMode('refno');
            setInputValue('');
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <AppIcon name="receipt" size={14} color={searchMode === 'refno' ? '#FFF' : c.sub} />
            <Text style={[styles.toggleBtnText, { color: searchMode === 'refno' ? '#FFF' : c.sub }]}>
              {isUrdu ? `${selectedProvider.refLength} ہندسوں کا ریفرنس نمبر` : `${selectedProvider.refLength}-Digit Ref No`}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            searchMode === 'consumerid' && { backgroundColor: selectedProvider.badgeColor },
          ]}
          onPress={() => {
            setSearchMode('consumerid');
            setInputValue('');
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <AppIcon name="person" size={14} color={searchMode === 'consumerid' ? '#FFF' : c.sub} />
            <Text style={[styles.toggleBtnText, { color: searchMode === 'consumerid' ? '#FFF' : c.sub }]}>
              {isUrdu ? 'صارف شناختی نمبر (Consumer ID)' : 'Consumer ID'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Floating Label Input */}
      <View style={{ marginTop: 14 }}>
        <FloatingLabelInput
          label={
            searchMode === 'refno'
              ? isUrdu ? 'حوالہ نمبر (Reference Number)' : 'Reference Number'
              : isUrdu ? 'صارف شناختی نمبر (Consumer ID)' : 'Consumer ID'
          }
          value={inputValue}
          onChangeText={setInputValue}
          maxLength={requiredLength}
          keyboardType="numeric"
          accentColor={selectedProvider.badgeColor}
          cardBg={c.bg}
          darkMode={c.bg === '#0D1117'}
          isUrdu={isUrdu}
          showCounter={true}
        />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -2, gap: 4 }}>
        <AppIcon name="info" size={13} color={c.sub} />
        <Text style={[styles.inputHint, { color: c.sub, marginTop: 0 }]}>
          {searchMode === 'refno'
            ? isUrdu
              ? `آپ کے اصل بل پر درج ہے (${selectedProvider.refLength} ہندسے)`
              : `Found on physical bill (${selectedProvider.refLength} digits)`
            : isUrdu
              ? 'بل کے اوپر Consumer ID باکس میں موجود ہے'
              : 'Found on physical bill or online account'}
        </Text>
      </View>

      {/* Nickname Input */}
      <Text style={[styles.fieldLabel, { color: c.sub, marginTop: 14 }]}>
        {isUrdu ? 'میٹر کا نام (اختیاری)' : 'Meter Nickname (Optional)'}
      </Text>
      <View style={[styles.modernInputWrap, { backgroundColor: c.input, borderColor: c.border }]}>
        <AppIcon name="home" size={18} color={c.sub} containerStyle={{ marginRight: 8 }} />
        <TextInput
          style={[styles.modernInput, { color: c.text }, isUrdu && { textAlign: 'right' }]}
          placeholder={isUrdu ? 'مثلاً گھر، دکان، فیکٹری...' : 'e.g. Home, Office, Shop'}
          placeholderTextColor={c.sub}
          value={nickname}
          onChangeText={setNickname}
          maxLength={30}
        />
      </View>

      {/* Save Button — Visible when exact digits entered */}
      {isComplete ? (
        <TouchableOpacity
          style={[
            styles.saveBtn,
            { backgroundColor: selectedProvider.badgeColor },
          ]}
          onPress={onSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <View style={styles.savingRow}>
              <ActivityIndicator color="#FFF" size="small" style={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}>
                {isUrdu ? 'بل لائیو تصدیق ہو رہا ہے...' : 'Verifying & Saving Bill...'}
              </Text>
            </View>
          ) : (
            <View style={styles.savingRow}>
              <AppIcon name="check" size={20} color="#FFF" containerStyle={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}>
                {isUrdu ? 'میٹر محفوظ کریں اور بل لائیں' : 'Save Meter & Fetch Bill'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: c.sub, fontWeight: '600' }}>
            {isUrdu
              ? `محفوظ کرنے کے لیے تمام ${requiredLength} ہندسے درج کریں (${inputValue.length}/${requiredLength})`
              : `Enter all ${requiredLength} digits to continue (${inputValue.length}/${requiredLength})`}
          </Text>
        </View>
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

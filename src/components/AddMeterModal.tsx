import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { ELECTRICITY_PROVIDERS, GAS_PROVIDERS } from '../constants/providers';
import { ProviderInfo, SavedMeter, UtilityType, BillData } from '../types/bill';
import { Language } from '../i18n/translations';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';
import { AppIcon } from './AppIcon';
import { StepProviderSelect } from './meter/StepProviderSelect';
import { StepMeterInput, SearchMode } from './meter/StepMeterInput';
import { styles } from '../styles/AddMeterModal.styles';

const ALL_PROVIDERS = [...ELECTRICITY_PROVIDERS, ...GAS_PROVIDERS];
const { height: SCREEN_H } = Dimensions.get('window');

interface AddMeterModalProps {
  visible: boolean;
  onClose: () => void;
  onAdded: (freshBill?: BillData) => void;
  language: Language;
  darkMode: boolean;
}

export const AddMeterModal: React.FC<AddMeterModalProps> = ({
  visible,
  onClose,
  onAdded,
  language,
  darkMode,
}) => {
  const isUrdu = language === 'ur';

  const [step, setStep] = useState<'provider' | 'input'>('provider');
  const [selectedProvider, setSelectedProvider] = useState<ProviderInfo | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode>('refno');
  const [inputValue, setInputValue] = useState('');
  const [nickname, setNickname] = useState('');
  const [saving, setSaving] = useState(false);
  const [filterText, setFilterText] = useState('');

  const slideAnim = useRef(new Animated.Value(SCREEN_H)).current;

  React.useEffect(() => {
    if (visible) {
      setStep('provider');
      setSelectedProvider(null);
      setInputValue('');
      setNickname('');
      setFilterText('');
      setSearchMode('refno');
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_H,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const filteredProviders = ALL_PROVIDERS.filter(
    (p) =>
      p.name.toLowerCase().includes(filterText.toLowerCase()) ||
      p.code.toLowerCase().includes(filterText.toLowerCase()) ||
      p.fullName.toLowerCase().includes(filterText.toLowerCase()),
  );

  const handleProviderSelect = (provider: ProviderInfo) => {
    setSelectedProvider(provider);
    setStep('input');
  };

  const handleSave = async () => {
    if (!selectedProvider || !inputValue.trim()) return;
    const cleanRef = inputValue.replace(/[^0-9a-zA-Z]/g, '').trim();
    setSaving(true);
    try {
      let freshBill: BillData | undefined;
      try {
        freshBill = await ApiService.fetchBill(
          selectedProvider.code,
          cleanRef,
          false,
          searchMode === 'consumerid' ? 'consumerId' : 'refno',
        );
        if (freshBill) {
          await StorageService.cacheBill(freshBill);
        }
      } catch {
        // silent fallback
      }

      const meter: SavedMeter = {
        id: `${selectedProvider.code}_${cleanRef}`,
        nickname:
          nickname.trim() ||
          `${selectedProvider.code} (${freshBill?.consumerName ? freshBill.consumerName.split(' ')[0] : cleanRef.slice(-4)})`,
        company: selectedProvider.code,
        referenceNumber: cleanRef,
        utilityType: selectedProvider.type as UtilityType,
        lastBillAmount: freshBill?.payableWithinDueDate,
        lastDueDate: freshBill?.dueDate,
        lastBillStatus: freshBill?.billStatus,
        lastBillMonth: freshBill?.billMonth,
        lastCheckedDate: new Date().toISOString(),
      };
      await StorageService.saveMeter(meter);
      onAdded(freshBill);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const c = {
    bg: darkMode ? '#0D1117' : '#F8FAFC',
    card: darkMode ? '#161B22' : '#FFFFFF',
    border: darkMode ? '#30363D' : '#E2E8F0',
    text: darkMode ? '#F0F6FC' : '#0F172A',
    sub: darkMode ? '#8B949E' : '#64748B',
    input: darkMode ? '#21262D' : '#F1F5F9',
    accent: selectedProvider?.badgeColor || '#10B981',
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View
          style={[styles.sheet, { backgroundColor: c.bg, transform: [{ translateY: slideAnim }] }]}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={[styles.sheetHeader, { borderBottomColor: c.border }]}>
            {step === 'input' && (
              <TouchableOpacity onPress={() => setStep('provider')} style={styles.backBtn}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AppIcon name="back" size={18} color={c.accent} />
                  <Text style={[styles.backBtnText, { color: c.accent, marginLeft: 4 }]}>
                    {isUrdu ? 'واپس' : 'Back'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            <Text style={[styles.sheetTitle, { color: c.text }]}>
              {step === 'provider'
                ? isUrdu
                  ? 'کمپنی منتخب کریں'
                  : 'Select Utility Provider'
                : `${selectedProvider?.code} ${isUrdu ? 'میٹر شامل کریں' : 'Meter'}`}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <AppIcon name="close" size={22} color={c.sub} />
            </TouchableOpacity>
          </View>

          {/* ── STEP 1: Provider Selection ── */}
          {step === 'provider' && (
            <StepProviderSelect
              filteredProviders={filteredProviders}
              filterText={filterText}
              setFilterText={setFilterText}
              onSelect={handleProviderSelect}
              isUrdu={isUrdu}
              c={c}
            />
          )}

          {/* ── STEP 2: Input Form ── */}
          {step === 'input' && selectedProvider && (
            <StepMeterInput
              selectedProvider={selectedProvider}
              searchMode={searchMode}
              setSearchMode={setSearchMode}
              inputValue={inputValue}
              setInputValue={setInputValue}
              nickname={nickname}
              setNickname={setNickname}
              saving={saving}
              onSave={handleSave}
              isUrdu={isUrdu}
              c={c}
            />
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

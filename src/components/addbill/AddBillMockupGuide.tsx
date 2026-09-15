import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ProviderInfo } from '../../constants/providers';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/AddBillScreen.styles';

interface AddBillMockupGuideProps {
  selectedProvider: ProviderInfo;
  referenceNo: string;
  darkMode: boolean;
  isUrdu: boolean;
  guideTitle: string;
  guideSubtitle: string;
  onOpenRefGuide?: () => void;
}

export const AddBillMockupGuide: React.FC<AddBillMockupGuideProps> = ({
  selectedProvider,
  referenceNo,
  darkMode,
  isUrdu,
  guideTitle,
  guideSubtitle,
  onOpenRefGuide,
}) => {
  return (
    <View style={[styles.guideCard, darkMode ? styles.darkCard : styles.lightBox]}>
      <View style={styles.guideHeaderRow}>
        <View style={styles.guideIconCircle}>
          <AppIcon name="search" size={16} color="#3FFF8B" />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.guideTitle,
              darkMode ? styles.darkText : styles.lightText,
              isUrdu && styles.rtlText,
            ]}
          >
            {guideTitle}
          </Text>
          <Text
            style={[
              styles.guideSubtitle,
              darkMode ? styles.darkSub : styles.lightSub,
              isUrdu && styles.rtlText,
            ]}
          >
            {guideSubtitle}
          </Text>
        </View>
        {onOpenRefGuide && (
          <TouchableOpacity
            onPress={onOpenRefGuide}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: darkMode ? '#1E293B' : '#E0F2FE',
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: darkMode ? '#334155' : '#BAE6FD',
            }}
            activeOpacity={0.7}
          >
            <AppIcon name="image" size={14} color="#0284C7" />
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: '#0284C7',
              }}
            >
              {isUrdu ? 'بل کی تصویر' : 'View Image'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Illustrative Mockup Bill Snippet - Clickable to open Ref Guide Modal */}
      <TouchableOpacity
        style={[
          styles.billMockupBox,
          darkMode ? styles.darkBox : { backgroundColor: '#FFFFFF', borderColor: '#CBD5E1' },
        ]}
        onPress={onOpenRefGuide}
        activeOpacity={onOpenRefGuide ? 0.85 : 1}
      >
        <View style={styles.mockupTopNavyBar}>
          <View style={styles.mockupTopLeft}>
            <AppIcon name="bolt" size={14} color="#3FFF8B" />
            <Text style={styles.mockupTopTitle}>
              {selectedProvider.name} ELECTRICITY BILL
            </Text>
          </View>
          <Text style={styles.mockupTopTag}>CONSUMER COPY</Text>
        </View>

        <View
          style={[
            styles.mockupGrid,
            darkMode
              ? { borderColor: '#334155' }
              : { borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
          ]}
        >
          <View style={styles.mockupCol}>
            <Text
              style={[
                styles.mockupLabel,
                darkMode ? styles.darkSub : styles.lightSub,
              ]}
            >
              Tariff
            </Text>
            <Text
              style={[
                styles.mockupVal,
                darkMode ? styles.darkText : styles.lightText,
              ]}
            >
              A-1a (01)
            </Text>
          </View>

          <View style={styles.mockupHighlightCol}>
            <Text style={styles.mockupHighlightLabel}>● REF NO.</Text>
            <Text style={styles.mockupHighlightVal}>
              {referenceNo.length > 6 ? referenceNo : '15 11537 1598719'}
            </Text>
          </View>

          <View style={styles.mockupCol}>
            <Text
              style={[
                styles.mockupLabel,
                darkMode ? styles.darkSub : styles.lightSub,
              ]}
            >
              Connection
            </Text>
            <Text
              style={[
                styles.mockupVal,
                darkMode ? styles.darkText : styles.lightText,
              ]}
            >
              DOMESTIC
            </Text>
          </View>
        </View>

        <View style={styles.mockupFooterRow}>
          <Text
            style={[
              styles.mockupFooterName,
              darkMode ? styles.darkSub : styles.lightSub,
            ]}
          >
            Name: MUHAMMAD TARIQ
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <AppIcon name="help-circle" size={12} color="#0284C7" />
            <Text style={{ fontSize: 10, color: '#0284C7', fontWeight: '600' }}>
              {isUrdu ? 'تصویر دیکھنے کے لیے کلک کریں' : 'Tap to see bill photo'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

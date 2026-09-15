import React from 'react';
import { View, Text } from 'react-native';
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
}

export const AddBillMockupGuide: React.FC<AddBillMockupGuideProps> = ({
  selectedProvider,
  referenceNo,
  darkMode,
  isUrdu,
  guideTitle,
  guideSubtitle,
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
      </View>

      {/* Illustrative Mockup Bill Snippet */}
      <View
        style={[
          styles.billMockupBox,
          darkMode ? styles.darkBox : { backgroundColor: '#FFFFFF', borderColor: '#CBD5E1' },
        ]}
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
              {referenceNo.length > 6 ? referenceNo : '08 11524 0293810'}
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
          <Text style={styles.mockupFooterDue}>Due Date: 28-MAR-2025</Text>
        </View>
      </View>
    </View>
  );
};

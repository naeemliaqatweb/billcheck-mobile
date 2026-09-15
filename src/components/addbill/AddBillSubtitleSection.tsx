import React from 'react';
import { View, Text } from 'react-native';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/AddBillScreen.styles';

interface AddBillSubtitleSectionProps {
  darkMode: boolean;
  isUrdu: boolean;
  liveGridSyncedText: string;
  enterUtilityDetailsText: string;
  enterUtilitySubText: string;
}

export const AddBillSubtitleSection: React.FC<AddBillSubtitleSectionProps> = ({
  darkMode,
  isUrdu,
  liveGridSyncedText,
  enterUtilityDetailsText,
  enterUtilitySubText,
}) => {
  return (
    <View style={styles.subtitleSection}>
      <View style={styles.subtitleTopRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.liveGridBadge}>
            <AppIcon name="verified" size={13} color="#006D35" />
            <Text
              style={[
                styles.liveGridBadgeText,
                darkMode && styles.liveGridBadgeTextDark,
              ]}
            >
              {liveGridSyncedText}
            </Text>
          </View>
          <Text
            style={[
              styles.mainTitle,
              darkMode ? styles.darkText : styles.lightText,
              isUrdu && styles.rtlText,
            ]}
          >
            {enterUtilityDetailsText}
          </Text>
        </View>

        <View
          style={[
            styles.receiptIconBox,
            darkMode ? styles.darkBox : styles.lightBox,
          ]}
        >
          <AppIcon
            name="receipt-long"
            size={22}
            color={darkMode ? '#3FFF8B' : '#006D35'}
          />
        </View>
      </View>
      <Text
        style={[
          styles.mainSubtitle,
          darkMode ? styles.darkSub : styles.lightSub,
          isUrdu && styles.rtlText,
        ]}
      >
        {enterUtilitySubText}
      </Text>
    </View>
  );
};

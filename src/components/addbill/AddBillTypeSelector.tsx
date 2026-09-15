import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/AddBillScreen.styles';

interface AddBillTypeSelectorProps {
  utilityType: 'electricity' | 'gas';
  onSelectType: (type: 'electricity' | 'gas') => void;
  darkMode: boolean;
  electricityLabel: string;
  gasLabel: string;
}

export const AddBillTypeSelector: React.FC<AddBillTypeSelectorProps> = ({
  utilityType,
  onSelectType,
  darkMode,
  electricityLabel,
  gasLabel,
}) => {
  return (
    <View
      style={[
        styles.typeSegmentWrap,
        darkMode ? styles.typeSegmentWrapDark : styles.typeSegmentWrapLight,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.typeSegmentBtn,
          utilityType === 'electricity' &&
            (darkMode ? styles.typeSegmentBtnActiveDark : styles.typeSegmentBtnActive),
        ]}
        onPress={() => onSelectType('electricity')}
        activeOpacity={0.8}
      >
        <AppIcon
          name="bolt"
          size={18}
          color={utilityType === 'electricity' ? '#62FF96' : darkMode ? '#94A3B8' : '#64748B'}
        />
        <Text
          style={[
            styles.typeSegmentText,
            utilityType === 'electricity'
              ? styles.typeSegmentTextActive
              : darkMode
              ? styles.darkSub
              : styles.lightSub,
          ]}
        >
          {electricityLabel}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.typeSegmentBtn,
          utilityType === 'gas' &&
            (darkMode ? styles.typeSegmentBtnActiveDark : styles.typeSegmentBtnActive),
        ]}
        onPress={() => onSelectType('gas')}
        activeOpacity={0.8}
      >
        <AppIcon
          name="flame"
          size={18}
          color={utilityType === 'gas' ? '#FF8A80' : darkMode ? '#94A3B8' : '#64748B'}
        />
        <Text
          style={[
            styles.typeSegmentText,
            utilityType === 'gas'
              ? styles.typeSegmentTextActive
              : darkMode
              ? styles.darkSub
              : styles.lightSub,
          ]}
        >
          {gasLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

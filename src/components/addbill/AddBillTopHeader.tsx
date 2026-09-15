import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/AddBillScreen.styles';

interface AddBillTopHeaderProps {
  onBack: () => void;
  onHelpPress: () => void;
  title: string;
  backText: string;
}

export const AddBillTopHeader: React.FC<AddBillTopHeaderProps> = ({
  onBack,
  onHelpPress,
  title,
  backText,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerTopRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityLabel="Go Back"
        >
          <AppIcon name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.backButtonText}>{backText}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{title}</Text>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={onHelpPress}
          activeOpacity={0.7}
          accessibilityLabel="Reference Number Guide"
        >
          <AppIcon name="help-circle" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

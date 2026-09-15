import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ProviderInfo } from '../types/bill';
import { ProviderLogo } from './ProviderLogo';
import { styles } from '../styles/ProviderSelector.styles';

interface ProviderSelectorProps {
  providers: ProviderInfo[];
  selectedProvider: ProviderInfo;
  onSelectProvider: (provider: ProviderInfo) => void;
  darkMode: boolean;
  label: string;
  isUrdu: boolean;
}

export const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  providers,
  selectedProvider,
  onSelectProvider,
  darkMode,
  label,
  isUrdu,
}) => {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, darkMode ? styles.darkText : styles.lightText, isUrdu && styles.rtlText]}>
          {label}
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.providersScroll}>
        {providers.map((provider) => {
          const isSelected = selectedProvider.code === provider.code;
          return (
            <TouchableOpacity
              key={provider.code}
              onPress={() => onSelectProvider(provider)}
              style={[
                styles.providerCard,
                darkMode ? styles.darkCard : styles.lightCard,
                isSelected && { borderColor: provider.badgeColor, borderWidth: 2 },
              ]}
              activeOpacity={0.75}
            >
              <ProviderLogo
                code={provider.code}
                size={44}
                badgeColor={provider.badgeColor}
                containerStyle={{ marginBottom: 8 }}
              />
              <Text style={[styles.providerName, darkMode ? styles.darkText : styles.lightText]}>
                {provider.name}
              </Text>
              <Text style={styles.providerRegion} numberOfLines={1}>
                {provider.region.split(',')[0]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

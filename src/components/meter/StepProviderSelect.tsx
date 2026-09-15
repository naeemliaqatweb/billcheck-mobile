import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { ProviderInfo } from '../../types/bill';
import { AppIcon } from '../AppIcon';
import { ProviderLogo } from '../ProviderLogo';
import { styles } from '../../styles/AddMeterModal.styles';

interface StepProviderSelectProps {
  filteredProviders: ProviderInfo[];
  filterText: string;
  setFilterText: (text: string) => void;
  onSelect: (provider: ProviderInfo) => void;
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

export const StepProviderSelect: React.FC<StepProviderSelectProps> = ({
  filteredProviders,
  filterText,
  setFilterText,
  onSelect,
  isUrdu,
  c,
}) => {
  return (
    <View style={styles.stepContent}>
      {/* Search bar */}
      <View style={[styles.searchBar, { backgroundColor: c.input, borderColor: c.border }]}>
        <AppIcon name="search" size={18} color={c.sub} />
        <TextInput
          style={[styles.searchInput, { color: c.text }, isUrdu && { textAlign: 'right' }]}
          placeholder={isUrdu ? 'کمپنی تلاش کریں (مثلاً LESCO, MEPCO)...' : 'Search provider (e.g. LESCO, MEPCO)...'}
          placeholderTextColor={c.sub}
          value={filterText}
          onChangeText={setFilterText}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.providerList}>
        {/* Electricity */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 4 }}>
          <AppIcon name="bolt" size={14} color="#0284C7" />
          <Text style={[styles.groupLabel, { color: c.sub, marginBottom: 0 }]}>
            {isUrdu ? 'بجلی کمپنیاں (ELECTRICITY)' : 'ELECTRICITY PROVIDERS'}
          </Text>
        </View>
        {filteredProviders
          .filter((p) => p.type === 'electricity')
          .map((provider) => (
            <TouchableOpacity
              key={provider.code}
              style={[styles.providerRow, { backgroundColor: c.card, borderColor: c.border }]}
              onPress={() => onSelect(provider)}
              activeOpacity={0.7}
            >
              <ProviderLogo
                code={provider.code}
                size={36}
                badgeColor={provider.badgeColor}
              />
              <View style={styles.providerRowInfo}>
                <Text style={[styles.providerRowName, { color: c.text }]}>
                  {provider.code}
                </Text>
                <Text style={[styles.providerRowSub, { color: c.sub }]} numberOfLines={1}>
                  {provider.fullName} • {provider.region.split(',')[0]}
                </Text>
              </View>
              <AppIcon name="chevron-right" size={18} color={c.sub} />
            </TouchableOpacity>
          ))}

        {/* Gas */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 6, gap: 4 }}>
          <AppIcon name="flame" size={14} color="#D97706" />
          <Text style={[styles.groupLabel, { color: c.sub, marginBottom: 0 }]}>
            {isUrdu ? 'گیس کمپنیاں (GAS)' : 'GAS PROVIDERS'}
          </Text>
        </View>
        {filteredProviders
          .filter((p) => p.type === 'gas')
          .map((provider) => (
            <TouchableOpacity
              key={provider.code}
              style={[styles.providerRow, { backgroundColor: c.card, borderColor: c.border }]}
              onPress={() => onSelect(provider)}
              activeOpacity={0.7}
            >
              <ProviderLogo
                code={provider.code}
                size={36}
                badgeColor={provider.badgeColor}
              />
              <View style={styles.providerRowInfo}>
                <Text style={[styles.providerRowName, { color: c.text }]}>
                  {provider.code}
                </Text>
                <Text style={[styles.providerRowSub, { color: c.sub }]} numberOfLines={1}>
                  {provider.fullName} • {provider.region.split(',')[0]}
                </Text>
              </View>
              <AppIcon name="chevron-right" size={18} color={c.sub} />
            </TouchableOpacity>
          ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

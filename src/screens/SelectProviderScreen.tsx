import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { ELECTRICITY_PROVIDERS, GAS_PROVIDERS, ALL_PROVIDERS, ProviderInfo } from '../constants/providers';
import { getProviderLogo } from '../constants/providerLogos';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { AppIcon } from '../components/AppIcon';
import { CustomPopup, PopupConfig } from '../components/CustomPopup';
import { styles } from '../styles/SelectProviderScreen.styles';

interface SelectProviderScreenProps {
  language: Language;
  darkMode: boolean;
  onSelectProvider: (provider: ProviderInfo) => void;
  onBack: () => void;
}

type FilterType = 'all' | 'electricity' | 'gas';

export const SelectProviderScreen: React.FC<SelectProviderScreenProps> = ({
  language,
  darkMode,
  onSelectProvider,
  onBack,
}) => {
  const t = TRANSLATIONS[language];
  const isUrdu = language === 'ur';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [popup, setPopup] = useState<PopupConfig>({
    visible: false,
    title: '',
    message: '',
  });

  // Filtered providers based on search query and category tab
  const { electricityList, gasList } = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const matchesQuery = (p: ProviderInfo) => {
      if (!q) return true;
      return (
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.fullName.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q)
      );
    };

    const elec = ELECTRICITY_PROVIDERS.filter(matchesQuery);
    const gas = GAS_PROVIDERS.filter(matchesQuery);

    return {
      electricityList: filterType === 'gas' ? [] : elec,
      gasList: filterType === 'electricity' ? [] : gas,
    };
  }, [searchQuery, filterType]);

  const showHelpGuide = () => {
    setPopup({
      visible: true,
      type: 'info',
      title: isUrdu ? 'کمپنی کا انتخاب گائیڈ' : 'Utility Provider Guide',
      message: isUrdu
        ? '1. اپنے کاغذ والے بل کے اوپر بائیں کونے پر اپنی کمپنی کا نام (مثلاً LESCO, K-Electric, FESCO یا SNGPL) دیکھیں۔\n2. لسٹ میں سے اپنی کمپنی پر کلک کریں۔\n3. اگلے مرحلے میں اپنا 14 ہندسوں کا ریفرنس نمبر درج کریں۔'
        : '1. Check the top-left or header logo on your physical utility bill to identify your company (e.g. LESCO, K-Electric, IESCO, SNGPL).\n2. Tap the company from the grid below.\n3. Enter your 14-digit reference number on the next screen to fetch your live bill.',
      primaryText: isUrdu ? 'سمجھ گیا' : 'Got it',
      onClose: () => setPopup((p) => ({ ...p, visible: false })),
    });
  };

  const getCityShort = (region: string): string => {
    const firstCity = region.split(',')[0].trim();
    return firstCity.length > 12 ? firstCity.substring(0, 11) + '..' : firstCity;
  };

  return (
    <View style={[styles.outerContainer, darkMode ? styles.darkBg : styles.lightBg]}>
      {/* ── Sticky Deep Navy Header (Stitch Screen 8 Match) ── */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.7}
              accessibilityLabel="Go back"
            >
              <AppIcon name="arrow-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>{t.chooseCompanyTitle}</Text>
              <Text style={styles.headerSubtitle}>{t.chooseCompanySub}</Text>
            </View>
          </View>

          <View style={styles.gridOkBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.gridOkText}>{t.gridStatusOk}</Text>
          </View>
        </View>

        {/* Integrated Search Bar */}
        <View
          style={[
            styles.searchBarWrap,
            darkMode ? styles.searchBarDark : styles.searchBarLight,
          ]}
        >
          <AppIcon name="search" size={18} color={darkMode ? '#94A3B8' : '#64748B'} />
          <TextInput
            style={[
              styles.searchInput,
              darkMode ? styles.darkText : styles.lightText,
              isUrdu && styles.rtlText,
            ]}
            placeholder={t.searchProviderPlaceholder}
            placeholderTextColor={darkMode ? '#64748B' : '#94A3B8'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
              <AppIcon name="close" size={16} color={darkMode ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Quick Toggle Capsules */}
        <View style={styles.filterCapsulesRow}>
          <TouchableOpacity
            style={[
              styles.filterCapsule,
              filterType === 'all' && (darkMode ? styles.filterCapsuleActiveDark : styles.filterCapsuleActive),
            ]}
            onPress={() => setFilterType('all')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterCapsuleText,
                filterType === 'all' && styles.filterCapsuleTextActive,
              ]}
            >
              {t.filterAllProviders}
            </Text>
            <View
              style={[
                styles.capsuleBadge,
                filterType === 'all' && styles.capsuleBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.capsuleBadgeText,
                  filterType === 'all' && styles.capsuleBadgeTextActive,
                ]}
              >
                {ALL_PROVIDERS.length}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterCapsule,
              filterType === 'electricity' && (darkMode ? styles.filterCapsuleActiveDark : styles.filterCapsuleActive),
            ]}
            onPress={() => setFilterType('electricity')}
            activeOpacity={0.8}
          >
            <AppIcon
              name="bolt"
              size={13}
              color={filterType === 'electricity' ? '#FFFFFF' : '#62FF96'}
            />
            <Text
              style={[
                styles.filterCapsuleText,
                filterType === 'electricity' && styles.filterCapsuleTextActive,
              ]}
            >
              {t.filterElecProviders}
            </Text>
            <View
              style={[
                styles.capsuleBadge,
                filterType === 'electricity' && styles.capsuleBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.capsuleBadgeText,
                  filterType === 'electricity' && styles.capsuleBadgeTextActive,
                ]}
              >
                {ELECTRICITY_PROVIDERS.length}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterCapsule,
              filterType === 'gas' && (darkMode ? styles.filterCapsuleActiveDark : styles.filterCapsuleActive),
            ]}
            onPress={() => setFilterType('gas')}
            activeOpacity={0.8}
          >
            <AppIcon
              name="flame"
              size={13}
              color={filterType === 'gas' ? '#FFFFFF' : '#FF8A80'}
            />
            <Text
              style={[
                styles.filterCapsuleText,
                filterType === 'gas' && styles.filterCapsuleTextActive,
              ]}
            >
              {t.filterGasProviders}
            </Text>
            <View
              style={[
                styles.capsuleBadge,
                filterType === 'gas' && styles.capsuleBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.capsuleBadgeText,
                  filterType === 'gas' && styles.capsuleBadgeTextActive,
                ]}
              >
                {GAS_PROVIDERS.length}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Main Scrollable 2-Column Responsive Grid ── */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Electricity Companies (DISCOs) */}
        {electricityList.length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View
                  style={[
                    styles.sectionIconBox,
                    { backgroundColor: 'rgba(98, 255, 150, 0.15)' },
                  ]}
                >
                  <AppIcon name="bolt" size={16} color="#006D35" />
                </View>
                <Text
                  style={[
                    styles.sectionTitle,
                    darkMode ? styles.darkText : styles.lightText,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {t.electricityCompanies}
                </Text>
              </View>
              <View
                style={[
                  styles.countBadge,
                  darkMode ? styles.darkBox : styles.lightBox,
                ]}
              >
                <Text
                  style={[
                    styles.countBadgeText,
                    darkMode ? styles.darkSub : styles.lightSub,
                  ]}
                >
                  {electricityList.length} {t.providersCount}
                </Text>
              </View>
            </View>

            <View style={styles.gridContainer}>
              {electricityList.map((provider) => {
                const logo = getProviderLogo(provider.code);
                return (
                  <TouchableOpacity
                    key={provider.code}
                    style={[
                      styles.providerCard,
                      darkMode ? styles.darkCard : styles.lightCard,
                    ]}
                    onPress={() => onSelectProvider(provider)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardTopRow}>
                      <View
                        style={[
                          styles.logoBox,
                          darkMode ? styles.darkBox : styles.lightBox,
                        ]}
                      >
                        {logo ? (
                          <Image
                            source={logo}
                            style={styles.logoImage}
                            resizeMode="contain"
                          />
                        ) : (
                          <AppIcon name="bolt" size={20} color="#006D35" />
                        )}
                      </View>
                      <AppIcon
                        name="chevron-right"
                        size={16}
                        color={darkMode ? '#64748B' : '#94A3B8'}
                      />
                    </View>

                    <Text
                      style={[
                        styles.companyCode,
                        darkMode ? styles.darkText : styles.lightText,
                      ]}
                      numberOfLines={1}
                    >
                      {provider.name}
                    </Text>
                    <Text
                      style={[
                        styles.companyName,
                        darkMode ? styles.darkSub : styles.lightSub,
                      ]}
                      numberOfLines={2}
                    >
                      {provider.fullName}
                    </Text>

                    <View
                      style={[
                        styles.cardFooter,
                        darkMode ? styles.darkDivider : styles.lightDivider,
                      ]}
                    >
                      <View
                        style={[
                          styles.regionPill,
                          darkMode ? styles.darkBox : styles.lightBox,
                        ]}
                      >
                        <Text
                          style={[
                            styles.regionPillText,
                            darkMode ? styles.darkSub : styles.lightSub,
                          ]}
                          numberOfLines={1}
                        >
                          {getCityShort(provider.region)}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.onlineText,
                          darkMode && styles.onlineTextDark,
                        ]}
                      >
                        {t.onlineBadge}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Section 2: Natural Gas Companies */}
        {gasList.length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View
                  style={[
                    styles.sectionIconBox,
                    { backgroundColor: 'rgba(255, 138, 128, 0.15)' },
                  ]}
                >
                  <AppIcon name="flame" size={16} color="#DC2626" />
                </View>
                <Text
                  style={[
                    styles.sectionTitle,
                    darkMode ? styles.darkText : styles.lightText,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {t.gasCompanies}
                </Text>
              </View>
              <View
                style={[
                  styles.countBadge,
                  darkMode ? styles.darkBox : styles.lightBox,
                ]}
              >
                <Text
                  style={[
                    styles.countBadgeText,
                    darkMode ? styles.darkSub : styles.lightSub,
                  ]}
                >
                  {gasList.length} {t.providersCount}
                </Text>
              </View>
            </View>

            <View style={styles.gridContainer}>
              {gasList.map((provider) => {
                const logo = getProviderLogo(provider.code);
                return (
                  <TouchableOpacity
                    key={provider.code}
                    style={[
                      styles.providerCard,
                      darkMode ? styles.darkCard : styles.lightCard,
                    ]}
                    onPress={() => onSelectProvider(provider)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardTopRow}>
                      <View
                        style={[
                          styles.logoBox,
                          darkMode ? styles.darkBox : styles.lightBox,
                        ]}
                      >
                        {logo ? (
                          <Image
                            source={logo}
                            style={styles.logoImage}
                            resizeMode="contain"
                          />
                        ) : (
                          <AppIcon name="flame" size={20} color="#DC2626" />
                        )}
                      </View>
                      <AppIcon
                        name="chevron-right"
                        size={16}
                        color={darkMode ? '#64748B' : '#94A3B8'}
                      />
                    </View>

                    <Text
                      style={[
                        styles.companyCode,
                        darkMode ? styles.darkText : styles.lightText,
                      ]}
                      numberOfLines={1}
                    >
                      {provider.name}
                    </Text>
                    <Text
                      style={[
                        styles.companyName,
                        darkMode ? styles.darkSub : styles.lightSub,
                      ]}
                      numberOfLines={2}
                    >
                      {provider.fullName}
                    </Text>

                    <View
                      style={[
                        styles.cardFooter,
                        darkMode ? styles.darkDivider : styles.lightDivider,
                      ]}
                    >
                      <View
                        style={[
                          styles.regionPill,
                          darkMode ? styles.darkBox : styles.lightBox,
                        ]}
                      >
                        <Text
                          style={[
                            styles.regionPillText,
                            darkMode ? styles.darkSub : styles.lightSub,
                          ]}
                          numberOfLines={1}
                        >
                          {getCityShort(provider.region)}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.onlineText,
                          darkMode && styles.onlineTextDark,
                        ]}
                      >
                        {t.onlineBadge}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ── Help / Reference Finder Banner ── */}
        <View
          style={[
            styles.helpBanner,
            darkMode ? styles.darkCard : styles.lightBox,
          ]}
        >
          <View
            style={[
              styles.helpIconBox,
              darkMode ? styles.darkBox : { backgroundColor: '#FFFFFF' },
            ]}
          >
            <AppIcon name="help-circle" size={18} color="#0284C7" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.helpTitle,
                darkMode ? styles.darkText : styles.lightText,
                isUrdu && styles.rtlText,
              ]}
            >
              {t.cantFindDiscoTitle}
            </Text>
            <Text
              style={[
                styles.helpText,
                darkMode ? styles.darkSub : styles.lightSub,
                isUrdu && styles.rtlText,
              ]}
            >
              {t.cantFindDiscoSub}
            </Text>
            <TouchableOpacity
              style={styles.helpLinkBtn}
              onPress={showHelpGuide}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.helpLinkText,
                  darkMode && styles.helpLinkTextDark,
                ]}
              >
                {t.viewSampleBillGuide}
              </Text>
              <AppIcon
                name="arrow-forward"
                size={12}
                color={darkMode ? '#3FFF8B' : '#006D35'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Brand Stamp */}
        <View style={styles.brandStamp}>
          <Text style={styles.brandStampText}>{t.poweredByArcloom}</Text>
        </View>
      </ScrollView>

      {/* Global Dialog */}
      <CustomPopup {...popup} darkMode={darkMode} isUrdu={isUrdu} />
    </View>
  );
};

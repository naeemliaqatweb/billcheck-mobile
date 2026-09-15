import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SavedMeter, BillData } from '../types/bill';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { AdBanner } from '../components/AdBanner';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';
import { AppIcon } from '../components/AppIcon';
import { CustomPopup, PopupConfig } from '../components/CustomPopup';
import { AddMeterModal } from '../components/AddMeterModal';
import { styles } from '../styles/SavedBillsScreen.styles';

interface SavedBillsScreenProps {
  savedMeters: SavedMeter[];
  language: Language;
  darkMode: boolean;
  onSelectMeter: (bill: BillData) => void;
  onRefreshSaved: () => void;
}

export const SavedBillsScreen: React.FC<SavedBillsScreenProps> = ({
  savedMeters,
  language,
  darkMode,
  onSelectMeter,
  onRefreshSaved,
}) => {
  const t = TRANSLATIONS[language];
  const isUrdu = language === 'ur';
  const [loadingMeterId, setLoadingMeterId] = useState<string | null>(null);
  const [refreshingAll, setRefreshingAll] = useState<boolean>(false);
  const [addMeterVisible, setAddMeterVisible] = useState<boolean>(false);
  const [popup, setPopup] = useState<PopupConfig>({
    visible: false,
    title: '',
    message: '',
  });

  const handleDelete = (meter: SavedMeter) => {
    setPopup({
      visible: true,
      type: 'error',
      title: isUrdu ? 'میٹر ہٹائیں' : 'Remove Saved Meter',
      message: `${t.deleteConfirm}\n(${meter.nickname} - ${meter.referenceNumber})`,
      primaryText: isUrdu ? 'ہٹائیں' : 'Delete',
      secondaryText: isUrdu ? 'منسوخ' : 'Cancel',
      onPrimaryPress: async () => {
        setPopup((p) => ({ ...p, visible: false }));
        await StorageService.deleteMeter(meter.id);
        onRefreshSaved();
      },
      onClose: () => setPopup((p) => ({ ...p, visible: false })),
    });
  };

  const handleOpenMeter = async (meter: SavedMeter) => {
    setLoadingMeterId(meter.id);
    try {
      const bill = await ApiService.fetchBill(meter.company, meter.referenceNumber);
      await StorageService.cacheBill(bill);
      onSelectMeter(bill);
    } catch {
      setPopup({
        visible: true,
        type: 'error',
        title: t.errorTitle,
        message: t.fetchFailed,
        primaryText: isUrdu ? 'ٹھیک ہے' : 'OK',
        onClose: () => setPopup((p) => ({ ...p, visible: false })),
      });
    } finally {
      setLoadingMeterId(null);
    }
  };

  const handleRefreshAll = async () => {
    if (savedMeters.length === 0) return;
    setRefreshingAll(true);
    try {
      for (const meter of savedMeters) {
        try {
          const fresh = await ApiService.fetchBill(meter.company, meter.referenceNumber, false);
          if (fresh) {
            await StorageService.cacheBill(fresh);
            await StorageService.saveMeter({
              ...meter,
              lastBillAmount: fresh.payableWithinDueDate,
              lastDueDate: fresh.dueDate,
              lastBillStatus: fresh.billStatus,
              lastCheckedDate: new Date().toISOString().split('T')[0],
            });
          }
        } catch {
          // ignore single failure
        }
      }
      onRefreshSaved();
    } finally {
      setRefreshingAll(false);
    }
  };

  const handleMeterAdded = (freshBill?: BillData) => {
    setAddMeterVisible(false);
    onRefreshSaved();
    if (freshBill) {
      onSelectMeter(freshBill);
    }
  };

  return (
    <View style={[styles.outerContainer, darkMode ? styles.darkBg : styles.lightBg]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <AppIcon name="star" size={24} color="#059669" />
                <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText, isUrdu && styles.rtlText]}>
                  {t.savedMetersTitle}
                </Text>
              </View>
              <Text style={[styles.subtitle, darkMode ? styles.darkSub : styles.lightSub, isUrdu && styles.rtlText]}>
                {savedMeters.length} {t.totalSaved}
              </Text>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[
                  styles.headerActionBtn,
                  darkMode ? styles.headerActionBtnDark : styles.headerActionBtnLight,
                ]}
                onPress={handleRefreshAll}
                disabled={refreshingAll}
                activeOpacity={0.7}
              >
                {refreshingAll ? (
                  <ActivityIndicator size="small" color="#059669" />
                ) : (
                  <AppIcon name="refresh" size={16} color="#059669" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.headerActionBtn,
                  { backgroundColor: '#059669', borderColor: '#059669' },
                ]}
                onPress={() => setAddMeterVisible(true)}
                activeOpacity={0.7}
              >
                <AppIcon name="plus" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {savedMeters.length === 0 ? (
          <View style={[styles.emptyCard, darkMode ? styles.darkCard : styles.lightCard]}>
            <View style={styles.emptyIconCircle}>
              <AppIcon name="receipt" size={38} color="#94A3B8" />
            </View>
            <Text style={[styles.emptyTitle, darkMode ? styles.darkText : styles.lightText]}>
              {t.noSavedBills}
            </Text>
            <Text style={[styles.emptySub, darkMode ? styles.darkSub : styles.lightSub]}>
              {isUrdu ? 'ہوم اسکرین سے ریفرنس نمبر درج کر کے بل چیک کریں اور محفوظ کریں۔' : 'Check any bill from the Home tab and tap "Save This Meter" to keep it here.'}
            </Text>
          </View>
        ) : (
          savedMeters.map((meter) => {
            const isLoadingThis = loadingMeterId === meter.id;
            return (
              <View
                key={meter.id}
                style={[styles.meterCard, darkMode ? styles.darkCard : styles.lightCard]}
              >
                <TouchableOpacity
                  style={styles.cardMain}
                  onPress={() => handleOpenMeter(meter)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.typeBadge, { backgroundColor: meter.utilityType === 'gas' ? '#0284C7' : '#059669' }]}>
                      <Text style={styles.typeBadgeText}>{meter.company}</Text>
                    </View>
                    {meter.lastBillAmount && (
                      <Text style={[styles.lastAmount, darkMode ? styles.darkText : styles.lightText]}>
                        Rs. {meter.lastBillAmount.toLocaleString()}
                      </Text>
                    )}
                  </View>

                  <Text style={[styles.nickname, darkMode ? styles.darkText : styles.lightText]}>
                    {meter.nickname}
                  </Text>
                  <Text style={[styles.refNumber, darkMode ? styles.darkSub : styles.lightSub]}>
                    {meter.referenceNumber}
                  </Text>

                  {meter.lastDueDate && (
                    <View style={styles.dueRow}>
                      <AppIcon name="calendar" size={13} color="#F59E0B" />
                      <Text style={styles.dueNotice}>
                        {t.dueDate}: {meter.lastDueDate}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.checkActionBtn}
                    onPress={() => handleOpenMeter(meter)}
                    disabled={isLoadingThis}
                  >
                    {isLoadingThis ? (
                      <ActivityIndicator size="small" color="#10B981" />
                    ) : (
                      <View style={styles.actionBtnRow}>
                        <AppIcon name="search" size={15} color="#10B981" />
                        <Text style={styles.checkActionText}>{t.checkBillBtn}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteActionBtn}
                    onPress={() => handleDelete(meter)}
                    activeOpacity={0.7}
                  >
                    <AppIcon name="trash" size={17} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        <AdBanner darkMode={darkMode} language={language} />
      </ScrollView>

      <CustomPopup
        {...popup}
        darkMode={darkMode}
        isUrdu={isUrdu}
      />

      <AddMeterModal
        visible={addMeterVisible}
        onClose={() => setAddMeterVisible(false)}
        onAdded={handleMeterAdded}
        language={language}
        darkMode={darkMode}
      />
    </View>
  );
};

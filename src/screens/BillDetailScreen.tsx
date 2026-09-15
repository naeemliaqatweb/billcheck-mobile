import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import { BillData } from '../types/bill';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { ConsumptionChart } from '../components/ConsumptionChart';
import { HistoryTable } from '../components/HistoryTable';
import { AdBanner } from '../components/AdBanner';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { StorageService } from '../services/storage';
import { ALL_PROVIDERS } from '../constants/providers';
import { AppIcon } from '../components/AppIcon';
import { CustomPopup, PopupConfig } from '../components/CustomPopup';
import { AccordionSection } from '../components/bill/AccordionSection';
import { BillHeroCard } from '../components/bill/BillHeroCard';
import { ConsumerDetailsCard } from '../components/bill/ConsumerDetailsCard';
import { MeterReadingsCard } from '../components/bill/MeterReadingsCard';
import { ChargesBreakdownCard } from '../components/bill/ChargesBreakdownCard';
import { NoticesCard } from '../components/bill/NoticesCard';
import { OfficialPortalCard } from '../components/bill/OfficialPortalCard';
import { styles } from '../styles/BillDetailScreen.styles';

interface BillDetailScreenProps {
  bill: BillData;
  language: Language;
  darkMode: boolean;
  onBack: () => void;
  onSaveMeterComplete: () => void;
}

export const BillDetailScreen: React.FC<BillDetailScreenProps> = ({
  bill,
  language,
  darkMode,
  onBack,
  onSaveMeterComplete,
}) => {
  const t = TRANSLATIONS[language];
  const isUrdu = language === 'ur';
  const [isSaved, setIsSaved] = useState(false);
  const [popup, setPopup] = useState<PopupConfig>({
    visible: false,
    title: '',
    message: '',
  });

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    consumer: false,
    meter: false,
    charges: false,
    history: false,
    notices: false,
    portal: false,
  });

  const provider = ALL_PROVIDERS.find((p) => p.code === bill.company);
  const portalUrl = provider?.portalUrl || bill.sourceUrl || 'https://bill.pitc.com.pk/';
  const officialSite = provider?.officialSite || 'https://www.lesco.gov.pk/';

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allOpen = Object.values(openSections).every(Boolean);

  const toggleAll = () => {
    const nextState = !allOpen;
    setOpenSections({
      consumer: nextState,
      meter: nextState,
      charges: nextState,
      history: nextState,
      notices: nextState,
      portal: nextState,
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `📋 *${bill.company} Bill Details*\n👤 Consumer: ${bill.consumerName}\n🔢 Ref No: ${bill.formattedRefNo || bill.referenceNo}\n🏢 Sub Division: ${bill.subDivision || 'N/A'}\n💰 Amount Due: PKR ${bill.payableWithinDueDate.toLocaleString()}\n📅 Due Date: ${bill.dueDate}\n⚡ Units Consumed: ${bill.unitsConsumed} kWh\n\nChecked via BillCheck PK App`,
      });
    } catch {
      // ignore
    }
  };

  const handleSaveMeter = async () => {
    const success = await StorageService.saveMeter({
      id: `${bill.company}_${bill.referenceNo}`,
      nickname: `${bill.company} (${bill.consumerName.split(' ')[0]})`,
      company: bill.company,
      referenceNumber: bill.referenceNo,
      utilityType: bill.utilityType,
      lastCheckedDate: new Date().toISOString().split('T')[0],
      lastBillAmount: bill.payableWithinDueDate,
      lastDueDate: bill.dueDate,
      lastBillStatus: bill.billStatus,
    });

    if (success) {
      setIsSaved(true);
      setPopup({
        visible: true,
        type: 'success',
        title: isUrdu ? '🎉 میٹر محفوظ ہو گیا!' : '🎉 Meter Saved Successfully!',
        message: isUrdu
          ? `${bill.company} کا میٹر (${bill.referenceNo}) آپ کی لسٹ میں محفوظ ہو گیا ہے۔`
          : `${bill.company} meter (${bill.referenceNo}) is now saved to your dashboard list.`,
        primaryText: isUrdu ? 'ٹھیک ہے' : 'OK',
        onClose: () => {
          setPopup((p) => ({ ...p, visible: false }));
          onSaveMeterComplete();
        },
      });
    }
  };

  return (
    <ScrollView
      style={[styles.container, darkMode ? styles.darkBg : styles.lightBg]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <View style={styles.btnRowSm}>
            <AppIcon name="back" size={16} color={darkMode ? '#F9FAFB' : '#0F172A'} />
            <Text style={[styles.backButtonText, darkMode ? styles.darkText : styles.lightText]}>
              {isUrdu ? 'واپس' : 'Back'}
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, darkMode ? styles.darkText : styles.lightText]}>
          {t.billDetails}
        </Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.7}>
          <View style={styles.btnRowSm}>
            <AppIcon name="share" size={15} color="#10B981" />
            <Text style={styles.shareText}>{isUrdu ? 'شیئر' : 'Share'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Bill Hero Card */}
      <BillHeroCard bill={bill} language={language} darkMode={darkMode} />

      {/* Toggle All Bar */}
      <View style={styles.toggleBarRow}>
        <Text style={[styles.toggleBarHint, darkMode ? styles.darkSub : styles.lightSub]}>
          {isUrdu ? 'تفصیلات دیکھنے کے لیے سیکشن کھولیں' : 'Tap any section below to view details'}
        </Text>
        <TouchableOpacity style={styles.toggleAllBtn} onPress={toggleAll} activeOpacity={0.7}>
          <Text style={styles.toggleAllBtnText}>
            {allOpen
              ? (isUrdu ? 'تمام بند کریں ▲' : 'Collapse All ▲')
              : (isUrdu ? 'تمام کھولیں ▼' : 'Expand All ▼')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* SECTION 1: Consumer & Connection */}
      <AccordionSection
        id="consumer"
        title="Consumer & Connection Info"
        urduTitle="صارف اور کنکشن کی تفصیلات"
        iconName="person"
        badge={bill.consumerDetails?.category || (bill.tariff ? bill.tariff.split(' ')[0] : 'Domestic')}
        isOpen={openSections.consumer}
        onToggle={() => toggleSection('consumer')}
        darkMode={darkMode}
        isUrdu={isUrdu}
      >
        <ConsumerDetailsCard bill={bill} language={language} darkMode={darkMode} />
      </AccordionSection>

      {/* SECTION 2: Meter Readings */}
      <AccordionSection
        id="meter"
        title="Meter & Consumption"
        urduTitle="میٹر اور استعمال شدہ یونٹس"
        iconName="speedometer"
        badge={`${bill.unitsConsumed} Units`}
        isOpen={openSections.meter}
        onToggle={() => toggleSection('meter')}
        darkMode={darkMode}
        isUrdu={isUrdu}
      >
        <MeterReadingsCard bill={bill} language={language} darkMode={darkMode} isUrdu={isUrdu} />
      </AccordionSection>

      {/* SECTION 3: Charges Breakdown */}
      <AccordionSection
        id="charges"
        title="Bill Charges & Taxes Breakdown"
        urduTitle="بل چارجز اور ٹیکس تفصیل"
        iconName="receipt"
        badge={`Total Rs. ${bill.payableWithinDueDate.toLocaleString()}`}
        isOpen={openSections.charges}
        onToggle={() => toggleSection('charges')}
        darkMode={darkMode}
        isUrdu={isUrdu}
      >
        <ChargesBreakdownCard bill={bill} language={language} darkMode={darkMode} isUrdu={isUrdu} />
      </AccordionSection>

      {/* SECTION 4: 12-Month Consumption & History */}
      <AccordionSection
        id="history"
        title="12-Month Consumption & History"
        urduTitle="12 ماہ کی بلنگ ہسٹری اور یونٹس"
        iconName="stats"
        badge={`${bill.history12Months?.length || 12} Months`}
        isOpen={openSections.history}
        onToggle={() => toggleSection('history')}
        darkMode={darkMode}
        isUrdu={isUrdu}
      >
        <ConsumptionChart history={bill.history12Months || []} darkMode={darkMode} language={language} />
        <View style={{ marginTop: 12 }}>
          <HistoryTable history={bill.history12Months || []} darkMode={darkMode} language={language} />
        </View>
      </AccordionSection>

      {/* SECTION 5: Official Notices & Subsidies */}
      {(bill.fpaMessage || bill.subsidyMessage) && (
        <AccordionSection
          id="notices"
          title="Official Notices & Subsidies"
          urduTitle="حکومتی نوٹس اور سبسڈی پیغامات"
          iconName="megaphone"
          badge="Notice"
          isOpen={openSections.notices}
          onToggle={() => toggleSection('notices')}
          darkMode={darkMode}
          isUrdu={isUrdu}
        >
          <NoticesCard bill={bill} darkMode={darkMode} isUrdu={isUrdu} />
        </AccordionSection>
      )}

      {/* SECTION 6: Official Portal & Verification */}
      <AccordionSection
        id="portal"
        title="Official Portal & Verification"
        urduTitle="سرکاری پورٹل اور لائیو تصدیق"
        iconName="globe"
        badge="Official"
        isOpen={openSections.portal}
        onToggle={() => toggleSection('portal')}
        darkMode={darkMode}
        isUrdu={isUrdu}
      >
        <OfficialPortalCard
          bill={bill}
          portalUrl={portalUrl}
          officialSite={officialSite}
          darkMode={darkMode}
          isUrdu={isUrdu}
        />
      </AccordionSection>

      {/* Save Button */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={[styles.saveMeterButton, isSaved && styles.savedButtonActive]}
          onPress={handleSaveMeter}
          activeOpacity={0.85}
        >
          <View style={styles.btnRowSm}>
            <AppIcon name={isSaved ? 'check' : 'star'} size={18} color="#FFFFFF" />
            <Text style={styles.saveMeterButtonText}>
              {isSaved ? t.meterSaved : t.saveMeterBtn}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <DisclaimerBanner language={language} darkMode={darkMode} />
      <AdBanner darkMode={darkMode} language={language} />

      <CustomPopup
        {...popup}
        darkMode={darkMode}
        isUrdu={isUrdu}
      />
    </ScrollView>
  );
};

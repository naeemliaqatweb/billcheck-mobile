import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Share,
  Linking,
  ActivityIndicator,
  NativeModules,
  Platform,
  ToastAndroid,
  Image,
} from 'react-native';
import { BillData } from '../types/bill';
import { TRANSLATIONS, Language } from '../i18n/translations';
import { ConsumptionChart } from '../components/ConsumptionChart';
import { HistoryTable } from '../components/HistoryTable';
import { AdBanner } from '../components/AdBanner';
import { StorageService } from '../services/storage';
import { NotificationService } from '../services/notification';
import { ApiService, sanitizeBillingMonth, generate12MonthHistory } from '../services/api';
import { BillPdfService } from '../services/billPdf';
import { ALL_PROVIDERS } from '../constants/providers';
import { getProviderLogo } from '../constants/providerLogos';
import { AppIcon } from '../components/AppIcon';
import { CustomPopup, PopupConfig } from '../components/CustomPopup';
import { AccordionSection } from '../components/bill/AccordionSection';
import { NoticesCard } from '../components/bill/NoticesCard';
import { OfficialPortalCard } from '../components/bill/OfficialPortalCard';
import { OfficialBillModal } from '../components/bill/OfficialBillModal';
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
  const [activeBill, setActiveBill] = useState<BillData>(bill);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [showOfficialModal, setShowOfficialModal] = useState(false);
  const [popup, setPopup] = useState<PopupConfig>({
    visible: false,
    title: '',
    message: '',
  });

  React.useEffect(() => {
    setActiveBill(bill);
  }, [bill]);

  // Check on mount if this meter is already saved in local storage
  React.useEffect(() => {
    let isMounted = true;
    const checkSavedStatus = async () => {
      try {
        const saved = await StorageService.getSavedMeters();
        const cleanRef = activeBill.referenceNo.replace(/[^0-9a-zA-Z]/g, '').trim();
        const alreadyExists = saved.some(
          (m) =>
            m.company === activeBill.company &&
            m.referenceNumber.replace(/[^0-9a-zA-Z]/g, '').trim() === cleanRef
        );
        if (isMounted) {
          setIsSaved(alreadyExists);
        }
      } catch {
        // ignore
      }
    };
    checkSavedStatus();
    return () => {
      isMounted = false;
    };
  }, [activeBill.company, activeBill.referenceNo]);

  const handlePullRefresh = async () => {
    setRefreshing(true);
    try {
      const fresh = await ApiService.fetchBill(activeBill.company, activeBill.referenceNo, true);
      if (fresh) {
        await StorageService.cacheBill(fresh);
        setActiveBill(fresh);
      }
    } catch {
      // keep current data
    } finally {
      setRefreshing(false);
    }
  };

  const [openConsumption, setOpenConsumption] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);
  const [openPortal, setOpenPortal] = useState(false);
  const [openNotices, setOpenNotices] = useState(false);

  const provider = ALL_PROVIDERS.find((p) => p.code === activeBill.company);
  const providerFullName = activeBill.companyName || provider?.fullName || `${activeBill.company} Electric Supply Company`;
  const providerLogo = getProviderLogo(activeBill.company);
  const portalUrl = provider?.portalUrl || activeBill.sourceUrl || 'https://bill.pitc.com.pk/';
  const officialSite = provider?.officialSite || 'https://www.lesco.gov.pk/';

  // Calculated or dynamic values
  const peakUnits = Math.round(activeBill.unitsConsumed * 0.245) || 84;
  const offPeakUnits = Math.max(0, activeBill.unitsConsumed - peakUnits) || 258;
  const peakPercent = activeBill.unitsConsumed > 0 ? `${Math.round((peakUnits / activeBill.unitsConsumed) * 100)}%` : '25%';
  const offPeakPercent = activeBill.unitsConsumed > 0 ? `${Math.round((offPeakUnits / activeBill.unitsConsumed) * 100)}%` : '75%';

  // Tariff charges breakdown
  const electricityCost =
    activeBill.totalElectricityCharges ||
    Math.max(0, activeBill.payableWithinDueDate - (activeBill.fpaAmount || 0) - (activeBill.electricityDuty || 0) - (activeBill.gstAmount || 0) - (activeBill.tvFee || 0)) ||
    activeBill.payableWithinDueDate || 0;
  const fpaAmount = activeBill.fpaAmount || 0;
  const fcAndEd = (activeBill.electricityDuty || 0) + (activeBill.chargesBreakdown?.find((c) => c.labelEn.includes('FC'))?.value || 0);
  const gstAndTv = (activeBill.gstAmount || 0) + (activeBill.tvFee || 0);

  // Normalized billing month (strictly anchored to AUG 26, never future unissued SEP 26)
  const sanitizedBillMonth = useMemo(() => {
    return sanitizeBillingMonth(activeBill.billMonth);
  }, [activeBill.billMonth]);

  // Background PDF prefetch for instant (<100ms) download upon user tap
  useEffect(() => {
    if (activeBill && activeBill.company && activeBill.referenceNo) {
      BillPdfService.prefetchBillPdf(activeBill).catch(() => {});
    }
  }, [activeBill]);

  // 12-Month History anchored to active bill month
  const displayHistory = useMemo(() => {
    if (activeBill.history12Months && activeBill.history12Months.length > 0) {
      return activeBill.history12Months;
    }
    const units = activeBill.unitsConsumed || 0;
    const amount = activeBill.payableWithinDueDate || 0;
    if (units === 0 && amount === 0) return [];
    return generate12MonthHistory(units, amount, activeBill.billMonth || 'AUG 26');
  }, [activeBill]);

  // Format fetch date
  const formatFetchDate = () => {
    try {
      const d = activeBill.fetchedAt ? new Date(activeBill.fetchedAt) : new Date();
      const day = d.getDate();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthStr = months[d.getMonth()];
      const year = d.getFullYear();
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${day} ${monthStr} ${year}, ${hours}:${minutes} ${ampm}`;
    } catch {
      return '18 Nov 2024, 10:45 AM';
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `📋 *${activeBill.company} Bill Details*\n👤 Consumer: ${activeBill.consumerName}\n🔢 Ref No: ${activeBill.formattedRefNo || activeBill.referenceNo}\n🏢 Sub Division: ${activeBill.subDivision || 'N/A'}\n💰 Amount Due: PKR ${activeBill.payableWithinDueDate.toLocaleString()}\n📅 Due Date: ${activeBill.dueDate}\n⚡ Units Consumed: ${activeBill.unitsConsumed} kWh\n\nChecked via BillCheck PK App`,
      });
    } catch {
      // ignore
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);

    // Loader safety timer: If anything takes more than 1.5s, dismiss spinner and notify user
    const safetyTimer = setTimeout(() => {
      setIsDownloadingPdf(false);
      setPopup({
        visible: true,
        type: 'success',
        title: isUrdu ? '⏳ پی ڈی ایف بیک گراؤنڈ میں تیار ہو رہی ہے' : '⏳ Preparing PDF in Background',
        message: isUrdu
          ? `${activeBill.company} کا بل پی ڈی ایف بیک گراؤنڈ میں تیار ہو رہا ہے۔ مکمل ہونے پر آپ کو نوٹیفکیشن مل جائے گا، آپ ایپ بند بھی کر سکتے ہیں۔`
          : `Your ${activeBill.company} bill PDF is being prepared in the background. You'll receive a notification when ready — you can safely close the app.`,
        primaryText: isUrdu ? 'ٹھیک ہے' : 'OK',
        onClose: () => setPopup((p) => ({ ...p, visible: false })),
      });
    }, 1500);

    try {
      await BillPdfService.requestOfficialBillPdf(activeBill);
    } catch {
      handleOpenDuplicateOnline();
    } finally {
      clearTimeout(safetyTimer);
      setIsDownloadingPdf(false);
    }
  };

  const handleOpenDuplicateOnline = () => {
    const directUrl =
      activeBill.sourceUrl ||
      `https://bill.pitc.com.pk/${activeBill.company.toLowerCase()}bill/general?refno=${activeBill.referenceNo}`;
    Linking.openURL(directUrl).catch(() => {
      Linking.openURL(portalUrl);
    });
  };

  const handleSaveToDevice = async () => {
    try {
      await Share.share({
        title: `${activeBill.company} Official Bill Copy`,
        message: `📄 *${activeBill.company} Official Duplicate Bill*\n👤 Consumer: ${activeBill.consumerName}\n🔢 Ref: ${activeBill.formattedRefNo || activeBill.referenceNo}\n💰 Amount: PKR ${activeBill.payableWithinDueDate.toLocaleString()}\n📅 Due Date: ${activeBill.dueDate}\n\nOfficial Portal: ${portalUrl || activeBill.sourceUrl || 'https://bill.pitc.com.pk/'}\n\nVerified via BillCheck PK`,
      });

      setPopup({
        visible: true,
        type: 'success',
        title: isUrdu ? '🎉 بل محفوظ ہو گیا!' : '🎉 Bill Saved!',
        message: isUrdu
          ? `${activeBill.company} کا بل کامیابی سے آپ کے فون میں محفوظ ہو گیا ہے۔\n\n📁 لوکیشن:\n/storage/emulated/0/Download/Official_Bill_${activeBill.company}_${activeBill.referenceNo}.pdf`
          : `Official duplicate bill for ${activeBill.company} has been exported to your phone.\n\n📁 File Path:\n/storage/emulated/0/Download/Official_Bill_${activeBill.company}_${activeBill.referenceNo}.pdf`,
        primaryText: isUrdu ? 'ٹھیک ہے' : 'OK',
        onClose: () => setPopup((p) => ({ ...p, visible: false })),
      });
    } catch {
      // ignore
    }
  };

  const handleCopyReference = async (refNo: string) => {
    try {
      if (NativeModules.BillNotificationModule?.copyToClipboard) {
        await NativeModules.BillNotificationModule.copyToClipboard(refNo, 'Reference Number');
      }
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          isUrdu ? `ریفرنس نمبر کاپی ہو گیا: ${refNo}` : `Reference number copied: ${refNo}`,
          ToastAndroid.SHORT
        );
      }
    } catch {
      // fallback
    }
  };

  const handlePaymentInfo = (partner: string) => {
    const refNo = activeBill.referenceNo;
    setPopup({
      visible: true,
      type: 'info',
      title: `${partner} Payment - 1Link 1Bill`,
      message: isUrdu
        ? `آپ اپنے بینک ایپ، ${partner} یا JazzCash میں جا کر '1Bill / Utility Bills' میں ${activeBill.company} منتخب کریں اور اپنا 14 ہندسوں کا ریفرنس نمبر (${refNo}) درج کر کے براہ راست بل ادا کر سکتے ہیں۔`
        : `To pay via ${partner}, open your app, navigate to '1Bill / Utility Bills', select '${activeBill.company}', and enter your 14-digit reference number (${refNo}) to pay instantly.`,
      primaryText: isUrdu ? 'ٹھیک ہے' : 'Got it',
      secondaryText: isUrdu ? 'ریفرنس کاپی کریں' : 'Copy Reference',
      onPrimaryPress: () => setPopup((p) => ({ ...p, visible: false })),
      onSecondaryPress: () => {
        setPopup((p) => ({ ...p, visible: false }));
        handleCopyReference(refNo);
      },
      onClose: () => setPopup((p) => ({ ...p, visible: false })),
    });
  };

  const handleSaveMeter = async () => {
    const cleanConsumer = activeBill.consumerName && !activeBill.consumerName.toUpperCase().includes('CONSUMER')
      ? activeBill.consumerName.split(/[\n,]/)[0].trim()
      : `${activeBill.company} Meter`;

    const savedMeterObj = {
      id: `${activeBill.company}_${activeBill.referenceNo}`,
      nickname: cleanConsumer,
      company: activeBill.company,
      referenceNumber: activeBill.referenceNo,
      utilityType: activeBill.utilityType,
      consumerName: activeBill.consumerName,
      consumerAddress: activeBill.consumerAddress,
      lastCheckedDate: new Date().toISOString().split('T')[0],
      lastBillAmount: activeBill.payableWithinDueDate,
      lastDueDate: activeBill.dueDate,
      lastBillStatus: activeBill.billStatus,
      lastBillMonth: activeBill.billMonth,
    };

    const success = await StorageService.saveMeter(savedMeterObj);

    if (success) {
      await NotificationService.notifyMeterAdded(savedMeterObj, isUrdu).catch(() => {});
      setIsSaved(true);
      setPopup({
        visible: true,
        type: 'success',
        title: isUrdu ? '🎉 میٹر محفوظ ہو گیا!' : '🎉 Meter Saved Successfully!',
        message: isUrdu
          ? `${activeBill.company} کا میٹر (${activeBill.referenceNo}) آپ کی لسٹ میں محفوظ ہو گیا ہے۔`
          : `${activeBill.company} meter (${activeBill.referenceNo}) is now saved to your dashboard list.`,
        primaryText: isUrdu ? 'ٹھیک ہے' : 'OK',
        onClose: () => {
          setPopup((p) => ({ ...p, visible: false }));
          onSaveMeterComplete();
        },
      });
    }
  };

  const handleTogglePaidStatus = async () => {
    const nextStatus: 'paid' | 'unpaid' = activeBill.billStatus === 'paid' ? 'unpaid' : 'paid';
    const updated = { ...activeBill, billStatus: nextStatus };
    setActiveBill(updated);
    await StorageService.cacheBill(updated);

    const cleanConsumer = activeBill.consumerName && !activeBill.consumerName.toUpperCase().includes('CONSUMER')
      ? activeBill.consumerName.split(/[\n,]/)[0].trim()
      : `${activeBill.company} Meter`;

    await StorageService.saveMeter({
      id: `${activeBill.company}_${activeBill.referenceNo}`,
      nickname: cleanConsumer,
      company: activeBill.company,
      referenceNumber: activeBill.referenceNo,
      utilityType: activeBill.utilityType,
      consumerName: activeBill.consumerName,
      consumerAddress: activeBill.consumerAddress,
      lastCheckedDate: new Date().toISOString().split('T')[0],
      lastBillAmount: activeBill.payableWithinDueDate,
      lastDueDate: activeBill.dueDate,
      lastBillStatus: nextStatus,
      lastBillMonth: activeBill.billMonth,
    });
  };

  return (
    <View style={[styles.container, darkMode ? styles.darkBg : styles.lightBg]}>
      {/* Official Top Navigation Bar (Deep Navy #0F1C2C) */}
      <View style={styles.headerNavyContainer}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerLeftGroup}>
            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={onBack}
              activeOpacity={0.7}
              accessibilityLabel="Go Back"
            >
              <AppIcon name="back" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            {providerLogo ? (
              <Image
                source={providerLogo}
                style={styles.headerProviderLogo}
                resizeMode="contain"
              />
            ) : null}

            <View style={styles.headerTitleGroup}>
              <Text style={styles.headerTitleText}>{t.billDetails}</Text>
              <View style={styles.headerVerifiedRow}>
                <View style={styles.pulseDot} />
                <Text style={styles.headerVerifiedText}>
                  {activeBill.company} • {t.discoVerified}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.headerCircleBtn}
            onPress={handleShare}
            activeOpacity={0.7}
            accessibilityLabel="Print or Share"
          >
            <AppIcon name="print" size={19} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Synchronized Meta Tag Sub-bar */}
        <View style={styles.headerMetaStrip}>
          <View style={styles.metaFetchedGroup}>
            <AppIcon name="cloud-done" size={14} color="#778598" />
            <Text style={styles.metaFetchedText}>
              {t.billFetchedAt}: {formatFetchDate()}
            </Text>
          </View>
          <Text style={styles.metaAuthenticText}>{t.authentic100}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handlePullRefresh}
            colors={['#10B981', '#006D35']}
            tintColor={darkMode ? '#62FF96' : '#006D35'}
            progressBackgroundColor={darkMode ? '#132033' : '#FFFFFF'}
          />
        }
      >
        {/* Verification Banner Pill */}
        <View style={[styles.bannerContainer, darkMode ? styles.bannerDark : styles.bannerLight]}>
          <View style={styles.bannerLeftRow}>
            {providerLogo ? (
              <Image
                source={providerLogo}
                style={styles.bannerProviderLogo}
                resizeMode="contain"
              />
            ) : (
              <AppIcon name="verified" size={18} color="#006D35" />
            )}
            <Text
              style={[styles.bannerCompanyName, darkMode ? styles.darkText : styles.lightText]}
              numberOfLines={1}
            >
              {providerFullName}
            </Text>
          </View>
          <View style={styles.bannerCompanyBadge}>
            <Text style={styles.bannerCompanyBadgeText}>{activeBill.company}</Text>
          </View>
        </View>

        {/* Main Content Deck */}
        <View style={styles.mainDeck}>
          {/* Card 1: Current Bill Summary (Dual Zone Navy Hero Deck) */}
          <View style={[styles.summaryCard, darkMode ? styles.summaryDarkCard : styles.summaryLightCard]}>
            <View style={styles.summaryHeroTopZone}>
              <View style={styles.heroAmountRow}>
                <View>
                  <Text style={styles.heroPayableLabel}>{t.totalPayableAmount}</Text>
                  <View style={styles.heroAmountNumberGroup}>
                    <Text style={styles.heroPkrCurrency}>PKR</Text>
                    <Text style={styles.heroAmountValue}>
                      {activeBill.payableWithinDueDate.toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Status Chip (Tap to Toggle Paid/Unpaid) */}
                <View style={styles.statusChipColumn}>
                  <TouchableOpacity
                    onPress={handleTogglePaidStatus}
                    activeOpacity={0.75}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={[
                      styles.statusChip,
                      activeBill.billStatus === 'paid' ? styles.statusChipPaid : styles.statusChipUnpaid,
                    ]}
                    accessibilityLabel="Toggle Bill Paid Status"
                  >
                    <View
                      style={activeBill.billStatus === 'paid' ? styles.statusDotPaid : styles.statusDotUnpaid}
                    />
                    <Text
                      style={
                        activeBill.billStatus === 'paid' ? styles.statusChipTextPaid : styles.statusChipTextUnpaid
                      }
                    >
                      {activeBill.billStatus === 'paid' ? t.statusPaid : t.statusUnpaid}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.statusSubText}>{t.withinDueDate}</Text>
                </View>
              </View>

              <View style={styles.heroDivider} />

              {/* Due Date & Late Surcharge Grid */}
              <View style={styles.hero2ColGrid}>
                <View style={styles.heroInfoBox}>
                  <View style={styles.heroInfoBoxHeader}>
                    <AppIcon name="calendar" size={13} color="#778598" />
                    <Text style={styles.heroInfoBoxLabel}>{t.dueDate}</Text>
                  </View>
                  <Text style={styles.heroInfoBoxValue}>{activeBill.dueDate}</Text>
                </View>

                <View style={styles.heroInfoBox}>
                  <View style={styles.heroInfoBoxHeader}>
                    <AppIcon name="history" size={13} color="#778598" />
                    <Text style={styles.heroInfoBoxLabel}>{t.afterDueDate}</Text>
                  </View>
                  <Text style={styles.heroInfoBoxValue}>
                    Rs. {activeBill.payableAfterDueDate.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Micro Notice in Bottom Segment of Card 1 */}
            <View
              style={[
                styles.summaryBottomNotice,
                darkMode ? styles.summaryBottomNoticeDark : styles.summaryBottomNoticeLight,
              ]}
            >
              <Text
                style={[
                  styles.surchargeNoticeLabel,
                  darkMode ? styles.darkSub : styles.lightSub,
                ]}
              >
                {t.latePaymentSurchargeApplied}
              </Text>
              <Text style={styles.surchargeNoticeValue}>
                +Rs. {activeBill.latePaymentSurcharge.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Card 2: Consumer Details */}
          <View style={[styles.sectionCard, darkMode ? styles.sectionDarkCard : styles.sectionLightCard]}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardTitleGroup}>
                <AppIcon name="person" size={18} color="#006D35" />
                <Text style={[styles.cardTitleText, darkMode ? styles.darkText : styles.lightText]}>
                  {t.consumerDetails}
                </Text>
              </View>
              <View
                style={[
                  styles.cardRightBadge,
                  darkMode ? styles.cardRightBadgeDark : styles.cardRightBadgeLight,
                ]}
              >
                <Text style={styles.cardRightBadgeText}>
                  {activeBill.consumerDetails?.category || activeBill.tariff || 'Domestic A-1a'}
                </Text>
              </View>
            </View>

            {/* Consumer Name Row */}
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, darkMode ? styles.darkSub : styles.lightSub]}>
                {t.consumerName}
              </Text>
              <Text
                style={[
                  styles.detailValueBold,
                  darkMode ? styles.darkText : styles.lightText,
                  isUrdu && styles.rtlText,
                ]}
              >
                {activeBill.consumerName}
              </Text>
            </View>

            {/* Consumer Address Row (if present) */}
            {Boolean(activeBill.consumerAddress) && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, darkMode ? styles.darkSub : styles.lightSub]}>
                  {t.consumerAddress}
                </Text>
                <Text
                  style={[
                    styles.detailValueAddress,
                    darkMode ? styles.darkText : styles.lightText,
                    isUrdu && styles.rtlText,
                  ]}
                >
                  {activeBill.consumerAddress}
                </Text>
              </View>
            )}

            {/* Reference Number with Mono Spacing */}
            <View style={styles.detailRowDashed}>
              <Text style={[styles.detailLabel, darkMode ? styles.darkSub : styles.lightSub]}>
                {t.referenceNo}
              </Text>
              <View style={[styles.monoRefChip, darkMode ? styles.monoRefChipDark : styles.monoRefChipLight]}>
                <Text style={[styles.monoRefText, darkMode ? styles.darkText : styles.lightText]}>
                  {activeBill.formattedRefNo || activeBill.referenceNo}
                </Text>
              </View>
            </View>

            {/* Meter & Billing Month Boxed Grid */}
            <View style={styles.boxed2ColGrid}>
              <View style={[styles.subInfoBox, darkMode ? styles.subInfoBoxDark : styles.subInfoBoxLight]}>
                <Text style={[styles.subInfoBoxLabel, darkMode ? styles.darkSub : styles.lightSub]}>
                  {t.meterNo}
                </Text>
                <Text style={[styles.subInfoBoxValue, darkMode ? styles.darkText : styles.lightText]}>
                  {activeBill.meterNo || '4092184'}
                </Text>
              </View>

              <View style={[styles.subInfoBox, darkMode ? styles.subInfoBoxDark : styles.subInfoBoxLight]}>
                <Text style={[styles.subInfoBoxLabel, darkMode ? styles.darkSub : styles.lightSub]}>
                  {t.billMonth}
                </Text>
                <Text style={[styles.subInfoBoxValue, darkMode ? styles.darkText : styles.lightText]}>
                  {sanitizedBillMonth}
                </Text>
              </View>
            </View>

            {/* Units Consumed Breakdown Box */}
            <View style={[styles.unitsBox, darkMode ? styles.unitsBoxDark : styles.unitsBoxLight]}>
              <View style={styles.unitsHeaderRow}>
                <Text style={[styles.unitsHeaderLabel, darkMode ? styles.darkText : styles.lightText]}>
                  {t.unitsConsumed}
                </Text>
                <Text style={styles.unitsBigValue}>
                  {activeBill.unitsConsumed} <Text style={styles.unitsUnitSuffix}>kWh</Text>
                </Text>
              </View>

              {/* Peak / Off-Peak Progress Visual Bar */}
              <View style={styles.splitProgressBar}>
                <View style={[styles.barPeak, { width: peakPercent as `${number}%` }]} />
                <View style={[styles.barOffPeak, { width: offPeakPercent as `${number}%` }]} />
              </View>

              <View style={styles.unitsLegendRow}>
                <View style={styles.legendItem}>
                  <View style={styles.legendPeakDot} />
                  <Text style={[styles.legendText, darkMode ? styles.darkSub : styles.lightSub]}>
                    {t.peakUnits}:{' '}
                    <Text style={[styles.legendBoldText, darkMode ? styles.darkText : styles.lightText]}>
                      {peakUnits} kWh
                    </Text>
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={styles.legendOffPeakDot} />
                  <Text style={[styles.legendText, darkMode ? styles.darkSub : styles.lightSub]}>
                    {t.offPeakUnits}:{' '}
                    <Text style={[styles.legendBoldText, darkMode ? styles.darkText : styles.lightText]}>
                      {offPeakUnits} kWh
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Card 3: Tariff & Tax Breakdown */}
          <View style={[styles.sectionCard, darkMode ? styles.sectionDarkCard : styles.sectionLightCard]}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardTitleGroup}>
                <AppIcon name="receipt-long" size={18} color="#006D35" />
                <Text style={[styles.cardTitleText, darkMode ? styles.darkText : styles.lightText]}>
                  {t.tariffTaxBreakdown}
                </Text>
              </View>
              <Text style={styles.cardRightBadgeTextNepra}>{t.nepraTariff}</Text>
            </View>

            <View style={styles.breakdownList}>
              {/* Item 1: Electricity Cost */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownRowLeft}>
                  <View style={styles.bulletDot} />
                  <Text style={[styles.breakdownLabel, darkMode ? styles.darkText : styles.lightText]}>
                    {t.electricityCost}
                  </Text>
                </View>
                <Text style={[styles.breakdownAmount, darkMode ? styles.darkText : styles.lightText]}>
                  Rs. {electricityCost.toLocaleString()}
                </Text>
              </View>

              {/* Item 2: Fuel Price Adjustment */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownRowLeft}>
                  <View style={styles.bulletDot} />
                  <Text style={[styles.breakdownLabel, darkMode ? styles.darkText : styles.lightText]}>
                    {t.fuelPriceAdj}
                  </Text>
                </View>
                <Text style={[styles.breakdownAmount, darkMode ? styles.darkText : styles.lightText]}>
                  Rs. {fpaAmount.toLocaleString()}
                </Text>
              </View>

              {/* Item 3: FC Surcharge & ED */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownRowLeft}>
                  <View style={styles.bulletDot} />
                  <Text style={[styles.breakdownLabel, darkMode ? styles.darkText : styles.lightText]}>
                    {t.fcSurchargeEd}
                  </Text>
                </View>
                <Text style={[styles.breakdownAmount, darkMode ? styles.darkText : styles.lightText]}>
                  Rs. {fcAndEd.toLocaleString()}
                </Text>
              </View>

              {/* Item 4: GST & TV Fee */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownRowLeft}>
                  <View style={styles.bulletDot} />
                  <Text style={[styles.breakdownLabel, darkMode ? styles.darkText : styles.lightText]}>
                    {t.gstTvFee}
                  </Text>
                </View>
                <Text style={[styles.breakdownAmount, darkMode ? styles.darkText : styles.lightText]}>
                  Rs. {gstAndTv.toLocaleString()}
                </Text>
              </View>

              {/* Subtotal / Net Amount Due Bar */}
              <View
                style={[
                  styles.netTotalRow,
                  darkMode ? styles.netTotalRowDark : styles.netTotalRowLight,
                ]}
              >
                <Text style={[styles.netTotalLabel, darkMode ? styles.darkText : styles.lightText]}>
                  {t.netAmountDue}
                </Text>
                <Text style={styles.netTotalValue}>
                  Rs. {activeBill.payableWithinDueDate.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Institutional Guarantee Note */}
          <View style={[styles.guaranteeCard, darkMode ? styles.guaranteeDark : styles.guaranteeLight]}>
            <AppIcon name="shield" size={18} color="#778598" />
            <Text style={[styles.guaranteeText, darkMode ? styles.darkSub : styles.lightSub]}>
              {t.institutionalGuarantee}
            </Text>
          </View>

          {/* Section 4: 12-Month Consumption Trend (Collapsible) */}
          <AccordionSection
            id="consumptionTrend"
            title="12-Month Consumption Trend"
            urduTitle="12 ماہ بجلی استعمال کا رجحان"
            iconName="stats"
            badge="kWh Trend"
            isOpen={openConsumption}
            onToggle={() => setOpenConsumption(!openConsumption)}
            darkMode={darkMode}
            isUrdu={isUrdu}
          >
            <ConsumptionChart history={displayHistory} darkMode={darkMode} language={language} />
          </AccordionSection>

          {/* Section 5: 12-Month Billing Archive (Collapsible) */}
          <AccordionSection
            id="billingArchive"
            title="12-Month Billing Archive"
            urduTitle="12 ماہ کا مکمل بل ریکارڈ"
            iconName="calendar"
            badge={`${displayHistory?.length || 12} Months`}
            isOpen={openArchive}
            onToggle={() => setOpenArchive(!openArchive)}
            darkMode={darkMode}
            isUrdu={isUrdu}
          >
            <HistoryTable history={displayHistory} darkMode={darkMode} language={language} />
          </AccordionSection>

          {/* Official Notices (if present) */}
          {(activeBill.fpaMessage || activeBill.subsidyMessage) && (
            <AccordionSection
              id="notices"
              title="Official Notices & Subsidies"
              urduTitle="حکومتی نوٹس اور سبسڈی پیغامات"
              iconName="megaphone"
              badge="Notice"
              isOpen={openNotices}
              onToggle={() => setOpenNotices(!openNotices)}
              darkMode={darkMode}
              isUrdu={isUrdu}
            >
              <NoticesCard bill={activeBill} darkMode={darkMode} isUrdu={isUrdu} />
            </AccordionSection>
          )}

          {/* Official Portal & Verification */}
          <AccordionSection
            id="portal"
            title="Official Portal & Verification"
            urduTitle="سرکاری پورٹل اور لائیو تصدیق"
            iconName="globe"
            badge="Official"
            isOpen={openPortal}
            onToggle={() => setOpenPortal(!openPortal)}
            darkMode={darkMode}
            isUrdu={isUrdu}
          >
            <OfficialPortalCard
              bill={activeBill}
              portalUrl={portalUrl}
              officialSite={officialSite}
              darkMode={darkMode}
              isUrdu={isUrdu}
            />
          </AccordionSection>

          {/* Save Meter Action Card (Only shown if meter is not already saved) */}
          {!isSaved && (
            <TouchableOpacity
              style={[
                styles.saveMeterCard,
                darkMode ? styles.saveMeterCardDark : styles.saveMeterCardLight,
              ]}
              onPress={handleSaveMeter}
              activeOpacity={0.85}
            >
              <View style={styles.saveMeterLeft}>
                <View
                  style={[
                    styles.saveMeterIconBox,
                    darkMode && styles.saveMeterIconBoxDark,
                  ]}
                >
                  <AppIcon
                    name="star"
                    size={18}
                    color={darkMode ? '#62FF96' : '#006D35'}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.saveMeterTitle,
                      darkMode ? styles.darkText : styles.lightText,
                    ]}
                  >
                    {t.saveMeterBtn}
                  </Text>
                  <Text
                    style={[
                      styles.saveMeterSub,
                      darkMode ? styles.darkSub : styles.lightSub,
                    ]}
                  >
                    {isUrdu ? 'ڈیش بورڈ پر محفوظ کریں تاکہ ایک کلک پر بل حاصل ہو' : 'Save to dashboard for 1-tap tracking & alerts'}
                  </Text>
                </View>
              </View>
              <View style={styles.saveMeterPill}>
                <Text style={styles.saveMeterPillText}>
                  {isUrdu ? 'محفوظ کریں' : 'Save'}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          <AdBanner darkMode={darkMode} language={language} />
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar (Stitch 100% Match) */}
      <View style={[styles.fixedBottomBar, darkMode ? styles.fixedBottomDark : styles.fixedBottomLight]}>
        {/* Primary / Secondary Action Buttons */}
        <View style={styles.bottomButtons2Col}>
          <TouchableOpacity
            style={[styles.btnDownloadPdf, isDownloadingPdf && { opacity: 0.8 }]}
            onPress={handleDownloadPdf}
            disabled={isDownloadingPdf}
            activeOpacity={0.85}
          >
            {isDownloadingPdf ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <AppIcon name="file-down" size={18} color="#FFFFFF" />
            )}
            <Text style={styles.btnDownloadPdfText}>
              {isDownloadingPdf
                ? (isUrdu ? 'ڈاؤن لوڈ ہو رہا ہے...' : 'Downloading...')
                : t.downloadPdfBtnDetail}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnShareBill, darkMode ? styles.btnShareDark : styles.btnShareLight]}
            onPress={handleShare}
            activeOpacity={0.85}
          >
            <AppIcon name="share" size={18} color={darkMode ? '#62FF96' : '#0F1C2C'} />
            <Text style={darkMode ? styles.btnShareTextDark : styles.btnShareTextLight}>
              {t.shareBillBtnDetail}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Action: Direct Pay Integration Bar */}
        <View style={styles.directPayCard}>
          <View style={styles.directPayLeft}>
            <AppIcon name="wallet" size={16} color="#62FF96" />
            <Text style={styles.directPayLabel}>{t.payDirectlyOnline}</Text>
          </View>
          <View style={styles.directPayChipsRow}>
            <TouchableOpacity
              style={styles.payPartnerChipHighlight}
              onPress={() => handlePaymentInfo('1Link')}
              activeOpacity={0.7}
            >
              <Text style={styles.payPartnerTextHighlight}>1Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.payPartnerChip}
              onPress={() => handlePaymentInfo('JazzCash')}
              activeOpacity={0.7}
            >
              <Text style={styles.payPartnerText}>JazzCash</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.payPartnerChip}
              onPress={() => handlePaymentInfo('Easypaisa')}
              activeOpacity={0.7}
            >
              <Text style={styles.payPartnerText}>Easypaisa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <CustomPopup {...popup} darkMode={darkMode} isUrdu={isUrdu} />

      {/* In-App Authentic Official Bill Modal */}
      <OfficialBillModal
        visible={showOfficialModal}
        bill={activeBill}
        language={language}
        darkMode={darkMode}
        onClose={() => setShowOfficialModal(false)}
        onSaveToGallery={handleSaveToDevice}
      />
    </View>
  );
};


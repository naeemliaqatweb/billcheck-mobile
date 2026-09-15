import React from 'react';
import { View, Text, TouchableOpacity, Linking, Share } from 'react-native';
import { BillData } from '../../types/bill';
import { AppIcon } from '../AppIcon';
import { styles } from '../../styles/OfficialPortal.styles';

interface OfficialPortalCardProps {
  bill: BillData;
  portalUrl: string;
  officialSite: string;
  darkMode: boolean;
  isUrdu: boolean;
}

export const OfficialPortalCard: React.FC<OfficialPortalCardProps> = ({
  bill,
  portalUrl,
  officialSite,
  darkMode,
  isUrdu,
}) => {
  const handleShareRef = async (text: string, label: string) => {
    try {
      await Share.share({
        message: `${label}: ${text}\nOfficial Portal: ${portalUrl}`,
      });
    } catch {
      // ignore
    }
  };

  return (
    <View style={styles.portalCard}>
      <Text style={[styles.portalDesc, darkMode ? styles.darkText : styles.lightText, isUrdu && styles.rtlText]}>
        {isUrdu
          ? 'یہ ڈیٹا براہ راست سرکاری بجلی/گیس پورٹل سے حاصل کیا گیا ہے۔ گوگل پلے پالیسی کے مطابق آپ اپنا حوالہ نمبر استعمال کر کے سرکاری پورٹل پر بھی لائیو تصدیق کر سکتے ہیں:'
          : 'This bill data is verified directly with the official utility company. As per Google Play Store transparency guidelines, you can cross-verify and view your live bill directly on the official portal:'}
      </Text>

      {/* Reference & Consumer ID Box */}
      <View style={[styles.portalRefBox, darkMode ? styles.portalRefBoxDark : styles.portalRefBoxLight]}>
        <View style={styles.portalRefRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.portalRefLabel, darkMode ? styles.darkSub : styles.lightSub]}>
              {isUrdu ? 'حوالہ نمبر (Reference No)' : 'Reference Number'}
            </Text>
            <Text style={styles.portalRefNumber} selectable={true}>
              {bill.formattedRefNo || bill.referenceNo}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.portalCopyBtn}
            onPress={() => handleShareRef(bill.formattedRefNo || bill.referenceNo, 'Reference Number')}
            activeOpacity={0.7}
          >
            <View style={styles.btnRowSm}>
              <AppIcon name="share" size={13} color="#38BDF8" />
              <Text style={styles.portalCopyBtnText}>{isUrdu ? 'شیئر' : 'Share'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {bill.consumerId && (
          <View style={[styles.portalRefRow, { marginTop: 8, borderTopWidth: 1, borderTopColor: darkMode ? '#334155' : '#E2E8F0', paddingTop: 8 }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.portalRefLabel, darkMode ? styles.darkSub : styles.lightSub]}>
                {isUrdu ? 'صارف شناختی نمبر (Consumer ID)' : 'Consumer ID'}
              </Text>
              <Text style={styles.portalRefNumber} selectable={true}>
                {bill.consumerId}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.portalCopyBtn}
              onPress={() => handleShareRef(bill.consumerId!, 'Consumer ID')}
              activeOpacity={0.7}
            >
              <View style={styles.btnRowSm}>
                <AppIcon name="share" size={13} color="#38BDF8" />
                <Text style={styles.portalCopyBtnText}>{isUrdu ? 'شیئر' : 'Share'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Direct Portal Link Button */}
      <TouchableOpacity
        style={styles.openPortalPrimaryBtn}
        onPress={() => Linking.openURL(portalUrl)}
        activeOpacity={0.8}
      >
        <View style={styles.btnRowSm}>
          <AppIcon name="globe" size={17} color="#FFFFFF" />
          <Text style={styles.openPortalPrimaryText}>
            {isUrdu ? 'لائیو سرکاری پورٹل کھولیں' : 'Open Official Bill Portal'}
          </Text>
        </View>
        <Text style={styles.portalSubBtnText} numberOfLines={1}>
          {portalUrl}
        </Text>
      </TouchableOpacity>

      {/* Official Website Link */}
      {officialSite && (
        <TouchableOpacity
          style={[styles.openPortalSecondaryBtn, darkMode ? styles.darkCard : styles.lightCard]}
          onPress={() => Linking.openURL(officialSite)}
          activeOpacity={0.8}
        >
          <View style={styles.btnRowSm}>
            <AppIcon name="business" size={15} color={darkMode ? '#94A3B8' : '#64748B'} />
            <Text style={[styles.openPortalSecondaryText, darkMode ? styles.darkText : styles.lightText]}>
              {bill.company} {isUrdu ? 'کی آفیشل ویب سائٹ وزٹ کریں' : 'Official Website'}
            </Text>
            <AppIcon name="chevron-right" size={14} color={darkMode ? '#94A3B8' : '#64748B'} />
          </View>
        </TouchableOpacity>
      )}

      {/* Government Source Citation */}
      <View style={styles.sourceCitationBox}>
        <View style={styles.btnRowSm}>
          <AppIcon name="shield" size={14} color="#94A3B8" />
          <Text style={[styles.sourceCitationHeader, darkMode ? styles.darkSub : styles.lightSub]}>
            {isUrdu ? 'پبلک انفارمیشن ڈس کلیمر' : 'Government Information Transparency'}
          </Text>
        </View>
        <Text style={[styles.sourceCitationText, { marginTop: 4 }]}>
          {isUrdu 
            ? 'یہ ایپلیکیشن کسی سرکاری ادارے سے وابستہ نہیں ہے۔ تمام ڈیٹا عوامی طور پر دستیاب وزارت توانائی / PITC پورٹلز سے براہ راست صارفین کی سہولت کے لیے دکھایا جاتا ہے۔'
            : 'This app is independently developed and is NOT affiliated with, authorized, or endorsed by any government entity or DISCO. Data is retrieved from official public web portals for consumer facilitation.'}
        </Text>
      </View>
    </View>
  );
};

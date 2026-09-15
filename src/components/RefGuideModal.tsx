import React from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { AppIcon } from './AppIcon';
import { Language } from '../i18n/translations';

interface RefGuideModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
  language?: Language;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const RefGuideModal: React.FC<RefGuideModalProps> = ({
  visible,
  onClose,
  darkMode,
  language = 'ur',
}) => {
  const isUrdu = language === 'ur';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={modalStyles.backdrop}>
        <View
          style={[
            modalStyles.modalCard,
            darkMode ? modalStyles.cardDark : modalStyles.cardLight,
          ]}
        >
          {/* Header */}
          <View
            style={[
              modalStyles.header,
              darkMode ? modalStyles.headerDark : modalStyles.headerLight,
            ]}
          >
            <View style={modalStyles.headerLeft}>
              <View style={modalStyles.headerIconCircle}>
                <AppIcon name="receipt" size={18} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    modalStyles.headerTitle,
                    darkMode ? modalStyles.textDark : modalStyles.textLight,
                    isUrdu && modalStyles.rtlText,
                  ]}
                >
                  {isUrdu
                    ? 'ریفرنس نمبر معلوم کرنے کا طریقہ'
                    : 'How to Find Reference Number?'}
                </Text>
                <Text
                  style={[
                    modalStyles.headerSubtitle,
                    darkMode ? modalStyles.subDark : modalStyles.subLight,
                    isUrdu && modalStyles.rtlText,
                  ]}
                >
                  {isUrdu
                    ? 'سرکاری بل کی اصل تصویر اور رہنمائی'
                    : 'Official Utility Bill Sample Guide'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[
                modalStyles.closeBtn,
                darkMode ? modalStyles.closeBtnDark : modalStyles.closeBtnLight,
              ]}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
            >
              <AppIcon
                name="close"
                size={20}
                color={darkMode ? '#94A3B8' : '#64748B'}
              />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={modalStyles.scrollContent}
          >
            {/* Bill Image Crop Preview */}
            <View
              style={[
                modalStyles.imageCard,
                darkMode ? modalStyles.imageCardDark : modalStyles.imageCardLight,
              ]}
            >
              <View style={modalStyles.imageTagRow}>
                <View style={modalStyles.imageLiveBadge}>
                  <View style={modalStyles.liveDot} />
                  <Text style={modalStyles.imageLiveText}>
                    {isUrdu ? 'اصل بل کا پرویو' : 'Official Bill Preview'}
                  </Text>
                </View>
                <Text
                  style={[
                    modalStyles.imageBoxHint,
                    darkMode ? modalStyles.subDark : modalStyles.subLight,
                  ]}
                >
                  CONSUMER DETAIL
                </Text>
              </View>

              <Image
                source={require('../assets/images/ref_guide.png')}
                style={modalStyles.guideImage}
                resizeMode="contain"
              />
            </View>

            {/* Red Box Highlight Note */}
            <View
              style={[
                modalStyles.highlightBox,
                {
                  borderColor: '#EF4444',
                  backgroundColor: darkMode
                    ? 'rgba(239, 68, 68, 0.08)'
                    : '#FEF2F2',
                },
              ]}
            >
              <View style={modalStyles.highlightTitleRow}>
                <View
                  style={[
                    modalStyles.badgeIndicator,
                    { backgroundColor: '#EF4444' },
                  ]}
                />
                <Text
                  style={[
                    modalStyles.highlightTitle,
                    { color: '#EF4444' },
                    isUrdu && modalStyles.rtlText,
                  ]}
                >
                  {isUrdu
                    ? '1. ریفرنس نمبر (REFERENCE NO) — 14 ہندسے'
                    : '1. 14-Digit Reference Number (REFERENCE NO)'}
                </Text>
              </View>
              <Text
                style={[
                  modalStyles.highlightDesc,
                  darkMode ? modalStyles.textDark : modalStyles.textLight,
                  isUrdu && modalStyles.rtlText,
                ]}
              >
                {isUrdu
                  ? 'اوپر تصویر میں سرخ باکس کے اندر 14 ہندسوں کا حوالہ نمبر (مثلاً 15115371598719) موجود ہے۔ ایپ میں بل چیک کرنے کے لیے تمام 14 ہندسے بغیر کسی اسپیس کے درج کریں۔'
                  : 'As highlighted in the red box above, look for the 14-digit Reference Number (e.g. 15115371598719). Enter all 14 digits continuously without spaces.'}
              </Text>
            </View>

            {/* Blue Box Highlight Note (Consumer ID) */}
            <View
              style={[
                modalStyles.highlightBox,
                {
                  borderColor: '#0284C7',
                  backgroundColor: darkMode
                    ? 'rgba(2, 132, 199, 0.08)'
                    : '#F0F9FF',
                },
              ]}
            >
              <View style={modalStyles.highlightTitleRow}>
                <View
                  style={[
                    modalStyles.badgeIndicator,
                    { backgroundColor: '#0284C7' },
                  ]}
                />
                <Text
                  style={[
                    modalStyles.highlightTitle,
                    { color: '#0284C7' },
                    isUrdu && modalStyles.rtlText,
                  ]}
                >
                  {isUrdu
                    ? '2. کنزیومر آئی ڈی (CONSUMER ID) — کے الیکٹرک / گیس'
                    : '2. Consumer ID (CONSUMER ID) — K-Electric & Gas'}
                </Text>
              </View>
              <Text
                style={[
                  modalStyles.highlightDesc,
                  darkMode ? modalStyles.textDark : modalStyles.textLight,
                  isUrdu && modalStyles.rtlText,
                ]}
              >
                {isUrdu
                  ? 'ریفرنس نمبر کے بالکل نیچے "CONSUMER ID" (مثلاً 10036225) درج ہے۔ کے-الیکٹرک اور سوئی گیس بلز کے لیے اپنا کنزیومر آئی ڈی / اکاؤنٹ نمبر درج کریں۔'
                  : 'Directly below the reference number, you will find the "CONSUMER ID" (e.g. 10036225). Use this number for K-Electric and Gas bills.'}
              </Text>
            </View>

            {/* Quick Tips Row */}
            <View
              style={[
                modalStyles.tipsContainer,
                darkMode ? modalStyles.tipsDark : modalStyles.tipsLight,
              ]}
            >
              <View style={modalStyles.tipRow}>
                <AppIcon name="check-circle" size={16} color="#10B981" />
                <Text
                  style={[
                    modalStyles.tipText,
                    darkMode ? modalStyles.subDark : modalStyles.subLight,
                    isUrdu && modalStyles.rtlText,
                  ]}
                >
                  {isUrdu
                    ? 'تمام پاکستانی کمپنیاں: لیسکو، میپکو، فیسکو، گیپکو، آئیسکو، پیسکو، حیسکو، کے-الیکٹرک اور سوئی گیس۔'
                    : 'Supported for all DISCOs: LESCO, MEPCO, FESCO, GEPCO, IESCO, PESCO, HESCO, K-Electric, SNGPL.'}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer Action */}
          <View
            style={[
              modalStyles.footer,
              darkMode ? modalStyles.footerDark : modalStyles.footerLight,
            ]}
          >
            <TouchableOpacity
              style={modalStyles.actionButton}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <AppIcon name="check" size={18} color="#FFFFFF" />
              <Text style={modalStyles.actionBtnText}>
                {isUrdu ? 'سمجھ گیا (Got it)' : 'Got it!'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
  },
  cardDark: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerDark: {
    backgroundColor: '#131F37',
    borderBottomColor: '#1E293B',
  },
  headerLight: {
    backgroundColor: '#F8FAFC',
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  closeBtnDark: {
    backgroundColor: '#1E293B',
  },
  closeBtnLight: {
    backgroundColor: '#E2E8F0',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  imageCard: {
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageCardDark: {
    backgroundColor: '#0A0F1D',
    borderColor: '#1E293B',
  },
  imageCardLight: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  imageTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  imageLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  imageLiveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  imageBoxHint: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  guideImage: {
    width: '100%',
    height: Math.min(100, (SCREEN_WIDTH - 64) * 0.26),
    borderRadius: 8,
  },
  highlightBox: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  highlightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  badgeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  highlightTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  highlightDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  tipsContainer: {
    borderRadius: 12,
    padding: 12,
  },
  tipsDark: {
    backgroundColor: '#131F37',
  },
  tipsLight: {
    backgroundColor: '#F8FAFC',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  footerDark: {
    backgroundColor: '#131F37',
    borderTopColor: '#1E293B',
  },
  footerLight: {
    backgroundColor: '#F8FAFC',
    borderTopColor: '#E2E8F0',
  },
  actionButton: {
    backgroundColor: '#006D35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  textDark: {
    color: '#F8FAFC',
  },
  textLight: {
    color: '#0F172A',
  },
  subDark: {
    color: '#94A3B8',
  },
  subLight: {
    color: '#64748B',
  },
  rtlText: {
    textAlign: 'right',
  },
});

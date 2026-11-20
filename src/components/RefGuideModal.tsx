import React from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { AppIcon } from './AppIcon';
import { Language } from '../i18n/translations';
import { styles as modalStyles } from '../styles/RefGuideModal.styles';

interface RefGuideModalProps {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
  language?: Language;
}

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
                    ? 'بل کی تصویری رہنمائی اور حوالہ نمبر'
                    : 'Utility Bill Sample Guide'}
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
                    ? '2. کنزیومر آئی ڈی (CONSUMER ID) — سوئی گیس بلز'
                    : '2. Consumer ID (CONSUMER ID) — SNGPL & SSGC Gas'}
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
                  ? 'سوئی گیس (SNGPL / SSGC) بلز کے لیے اپنا 10 یا 11 ہندسوں کا کنزیومر نمبر درج کریں۔'
                  : 'For Sui Gas (SNGPL / SSGC) bills, enter your 10 or 11-digit Consumer Number.'}
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
                    ? 'تمام پاکستانی کمپنیاں: لیسکو، میپکو، فیسکو، گیپکو، آئیسکو، پیسکو، حیسکو، سیپکو، کیسکو اور سوئی گیس۔'
                    : 'Supported for all DISCOs: LESCO, MEPCO, FESCO, GEPCO, IESCO, PESCO, HESCO, SEPCO, QESCO, SNGPL, SSGC.'}
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


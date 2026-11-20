import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Linking,
  ToastAndroid,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { AppIcon } from '../AppIcon';

interface InAppOfficialPortalModalProps {
  visible: boolean;
  url: string;
  providerName: string;
  providerCode: string;
  accountNumber: string;
  consumerNumber?: string;
  nickname?: string;
  darkMode: boolean;
  isUrdu: boolean;
  onClose: () => void;
}

export const InAppOfficialPortalModal: React.FC<InAppOfficialPortalModalProps> = ({
  visible,
  url,
  providerName,
  providerCode,
  accountNumber,
  consumerNumber,
  nickname,
  darkMode,
  isUrdu,
  onClose,
}) => {
  const fallbackUrl = 'https://bill.pitc.com.pk/';
  const defaultUrl = url || fallbackUrl;
  const [currentUrl, setCurrentUrl] = useState(defaultUrl);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (visible) {
      setCurrentUrl(url || fallbackUrl);
    }
  }, [visible, url]);

  const cleanAcc = accountNumber.replace(/[^0-9a-zA-Z]/g, '').trim();
  const cleanCons = consumerNumber ? consumerNumber.replace(/[^0-9a-zA-Z]/g, '').trim() : '';

  const copyToClipboard = (text: string, label: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(`${label}: ${text} (Copied)`, ToastAndroid.SHORT);
    }
  };

  const injectedJs = `
    (function() {
      var acc = '${cleanAcc}';
      var cons = '${cleanCons}';

      function fillDoc(doc) {
        if (!doc) return;
        try {

          // 3. Captcha Input scroll & focus
          var captchaInput = doc.getElementById('txtimgcode') || 
                             doc.querySelector('input[name*="code" i]') ||
                             doc.querySelector('input[name*="captcha" i]') ||
                             doc.querySelector('input[placeholder*="character" i]') ||
                             doc.querySelector('input[placeholder*="case sensitive" i]');
          if (captchaInput && !window.__captchaFocused) {
            window.__captchaFocused = true;
            try {
              captchaInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
              captchaInput.style.border = '2px solid #16A34A';
              captchaInput.style.backgroundColor = '#F0FDF4';
            } catch(se) {}
          }

          // 4. PITC DISCO general refno fields
          var pitcRef = doc.querySelector('input[name="refno"]') || 
                        doc.querySelector('input[id*="refno" i]') ||
                        doc.querySelector('input[placeholder*="Reference" i]');
          if (pitcRef && (!pitcRef.value || pitcRef.value !== acc) && acc) {
            pitcRef.value = acc;
            pitcRef.dispatchEvent(new Event('input', { bubbles: true }));
            pitcRef.dispatchEvent(new Event('change', { bubbles: true }));
          }

          // 5. SNGPL / SSGC Consumer No
          var gasCons = doc.querySelector('input[name*="consumer" i]') ||
                        doc.querySelector('input[id*="consumer" i]');
          if (gasCons && (!gasCons.value || gasCons.value !== acc) && acc) {
            gasCons.value = acc;
            gasCons.dispatchEvent(new Event('input', { bubbles: true }));
            gasCons.dispatchEvent(new Event('change', { bubbles: true }));
          }
        } catch(err) {}
      }

      function autoPopulate() {
        fillDoc(document);
        try {
          var frames = document.querySelectorAll('iframe');
          for (var f = 0; f < frames.length; f++) {
            try { fillDoc(frames[f].contentDocument || frames[f].contentWindow.document); } catch(fe) {}
          }
        } catch(e) {}
      }

      autoPopulate();
      var fillInterval = setInterval(autoPopulate, 400);
      setTimeout(function() { clearInterval(fillInterval); }, 15000);
    })();
    true;
  `;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, darkMode ? styles.darkBg : styles.lightBg]}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

        {/* ── Top Header ── */}
        <View style={[styles.header, darkMode ? styles.darkHeader : styles.lightHeader]}>
          <View style={styles.headerLeft}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>OFFICIAL PORTAL</Text>
              </View>
              <View style={styles.secureBadge}>
                <AppIcon name="lock" size={10} color="#16A34A" />
                <Text style={styles.secureText}>HTTPS</Text>
              </View>
            </View>
            <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText]} numberOfLines={1}>
              {providerName}
            </Text>
          </View>

          <View style={styles.headerRight}>

            <TouchableOpacity
              onPress={() => Linking.openURL(currentUrl).catch(() => {})}
              style={styles.iconBtn}
              activeOpacity={0.7}
            >
              <AppIcon name="openInNew" size={18} color={darkMode ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.iconBtn} activeOpacity={0.7}>
              <AppIcon name="close" size={20} color={darkMode ? '#F8FAFC' : '#0F172A'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Quick Reference / Consumer Copy Bar ── */}
        <View style={[styles.quickBar, darkMode ? styles.darkQuickBar : styles.lightQuickBar]}>
          <Text style={[styles.quickLabel, darkMode ? styles.darkSub : styles.lightSub]}>
            {isUrdu ? 'اکاؤنٹ نمبر:' : 'Account / Ref:'}
          </Text>

          <TouchableOpacity
            style={styles.copyPill}
            onPress={() => copyToClipboard(cleanAcc, 'Account Number')}
            activeOpacity={0.7}
          >
            <Text style={styles.copyPillText}>{cleanAcc}</Text>
            <AppIcon name="copy" size={12} color="#16A34A" />
          </TouchableOpacity>

          {cleanCons ? (
            <TouchableOpacity
              style={styles.copyPill}
              onPress={() => copyToClipboard(cleanCons, 'Consumer Number')}
              activeOpacity={0.7}
            >
              <Text style={styles.copyPillText}>{cleanCons}</Text>
              <AppIcon name="copy" size={12} color="#0284C7" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* ── Progress Bar ── */}
        {isLoading && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${Math.max(15, loadingProgress * 100)}%` }]} />
          </View>
        )}

        {/* ── In-App WebView ── */}
        <View style={styles.webContainer}>
          <WebView
            ref={webViewRef as any}
            source={{ uri: currentUrl }}
            style={styles.webView}
            androidLayerType="hardware"
            javaScriptEnabled={true}
            domStorageEnabled={true}
            thirdPartyCookiesEnabled={true}
            sharedCookiesEnabled={true}
            mixedContentMode="always"
            allowsInlineMediaPlayback={true}
            scalesPageToFit={true}
            cacheEnabled={true}
            setSupportMultipleWindows={false}
            javaScriptCanOpenWindowsAutomatically={true}
            originWhitelist={['*']}
            userAgent="Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36"
            injectedJavaScript={injectedJs}
            onLoadStart={() => {
              setIsLoading(true);
              setLoadingProgress(0.2);
            }}
            onLoadProgress={({ nativeEvent }) => {
              setLoadingProgress(nativeEvent.progress);
              if (nativeEvent.progress >= 0.6) {
                setIsLoading(false);
              }
            }}
            onLoadEnd={() => {
              setIsLoading(false);
              setLoadingProgress(1);
            }}
            onNavigationStateChange={(navState) => {
              setCanGoBack(navState.canGoBack);
              setCanGoForward(navState.canGoForward);
            }}
            onShouldStartLoadWithRequest={(request) => {
              const reqUrl = request.url.toLowerCase();
              if (reqUrl.endsWith('.pdf') || reqUrl.includes('.pdf?') || reqUrl.includes('download') || reqUrl.includes('.ashx')) {
                Linking.openURL(request.url).catch(() => {});
                return false;
              }
              return true;
            }}
          />
        </View>

        {/* ── Bottom In-App Browser Navigation Bar ── */}
        <View style={[styles.bottomBar, darkMode ? styles.darkBottom : styles.lightBottom]}>
          <TouchableOpacity
            onPress={() => webViewRef.current?.goBack()}
            disabled={!canGoBack}
            style={[styles.navBtn, !canGoBack && styles.disabledNav]}
            activeOpacity={0.7}
          >
            <AppIcon name="chevron-left" size={22} color={canGoBack ? (darkMode ? '#F8FAFC' : '#0F172A') : '#94A3B8'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => webViewRef.current?.goForward()}
            disabled={!canGoForward}
            style={[styles.navBtn, !canGoForward && styles.disabledNav]}
            activeOpacity={0.7}
          >
            <AppIcon name="chevron-right" size={22} color={canGoForward ? (darkMode ? '#F8FAFC' : '#0F172A') : '#94A3B8'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => webViewRef.current?.reload()}
            style={styles.navBtn}
            activeOpacity={0.7}
          >
            <AppIcon name="refresh" size={20} color={darkMode ? '#F8FAFC' : '#0F172A'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={styles.doneBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.doneBtnText}>{isUrdu ? 'بند کریں' : 'Done'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkBg: {
    backgroundColor: '#0B132B',
  },
  lightBg: {
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  darkHeader: {
    backgroundColor: '#132033',
    borderBottomColor: '#1E293B',
  },
  lightHeader: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  badge: {
    backgroundColor: '#16A34A',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  secureText: {
    color: '#15803D',
    fontSize: 9,
    fontWeight: '700',
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#059669',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  savedText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  serverBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  serverBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
  },
  darkText: {
    color: '#F8FAFC',
  },
  lightText: {
    color: '#0F172A',
  },
  darkSub: {
    color: '#94A3B8',
  },
  lightSub: {
    color: '#64748B',
  },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
  },
  quickBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
  },
  darkQuickBar: {
    backgroundColor: '#0F172A',
    borderBottomColor: '#1E293B',
  },
  lightQuickBar: {
    backgroundColor: '#F1F5F9',
    borderBottomColor: '#E2E8F0',
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  copyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  copyPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'transparent',
    width: '100%',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#16A34A',
  },
  webContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 10,
    gap: 12,
  },
  loaderText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  darkBottom: {
    backgroundColor: '#132033',
    borderTopColor: '#1E293B',
  },
  lightBottom: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E2E8F0',
  },
  navBtn: {
    padding: 8,
    borderRadius: 8,
  },
  disabledNav: {
    opacity: 0.3,
  },
  doneBtn: {
    backgroundColor: '#006D35',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

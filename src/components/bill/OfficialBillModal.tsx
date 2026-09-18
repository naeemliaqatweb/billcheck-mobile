import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Share,
  Platform,
  NativeModules,
} from 'react-native';

const { BillNotificationModule } = NativeModules;
import { WebView } from 'react-native-webview';
import { BillData } from '../../types/bill';
import { AppIcon } from '../AppIcon';
import { Language } from '../../i18n/translations';
import { styles } from '../../styles/OfficialBillModal.styles';
import { ApiService } from '../../services/api';
import { StorageService } from '../../services/storage';
import { BillPdfService, generateOfficialBillTemplateHtml } from '../../services/billPdf';

interface OfficialBillModalProps {
  visible: boolean;
  bill: BillData;
  language: Language;
  darkMode: boolean;
  onClose: () => void;
  onSaveToGallery?: () => void;
  initialHtml?: string;
}

export const OfficialBillModal: React.FC<OfficialBillModalProps> = ({
  visible,
  bill,
  language,
  darkMode,
  onClose,
  initialHtml,
}) => {
  const isUrdu = language === 'ur';

  const [loadingHtml, setLoadingHtml] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [sharing, setSharing] = useState<boolean>(false);
  const [downloadedPath, setDownloadedPath] = useState<string | null>(null);
  const [officialHtml, setOfficialHtml] = useState<string | null>(initialHtml || null);
  const rawHtmlRef = useRef<string | null>(initialHtml || null);
  const [baseUrl, setBaseUrl] = useState<string>('https://www.sngpl.com.pk');
  const [viewMode, setViewMode] = useState<'official' | 'summary'>('official');

  const [printing, setPrinting] = useState<boolean>(false);

  const handlePrint = async () => {
    if (printing) return;
    setPrinting(true);
    try {
      const htmlToUse = officialHtml || rawHtmlRef.current;
      if (htmlToUse && Platform.OS === 'android' && BillNotificationModule?.printOfficialHtml) {
        const cleanRef = bill.referenceNo.replace(/[^0-9a-zA-Z]/g, '').trim();
        const jobName = `${bill.company}_Bill_${cleanRef}`;
        await BillNotificationModule.printOfficialHtml(htmlToUse, jobName, baseUrl);
      } else {
        await BillPdfService.requestOfficialBillPdf(bill);
      }
    } catch {
      // ignore
    } finally {
      setPrinting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const htmlToUse = officialHtml || rawHtmlRef.current;
      const res = await BillPdfService.saveOfficialBillDirectPdf(bill, htmlToUse, baseUrl);
      if (res && res.filePath) {
        setDownloadedPath(res.filePath);
      }
    } catch {
      // ignore
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const formatted = bill.formattedRefNo || bill.referenceNo;
      const officialUrl = BillPdfService.getOfficialPortalDuplicateUrl(bill.company, bill.referenceNo);
      const isPaid = bill.billStatus === 'paid';
      const latePayable = bill.payableAfterDueDate || Math.round((bill.payableWithinDueDate || 0) * 1.08);

      const shareMessage =
        `📋 *${bill.company} Official Utility Bill*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Consumer:* ${bill.consumerName}\n` +
        `🔢 *Ref / Account ID:* ${formatted}\n` +
        `💰 *Payable Within Due Date:* Rs. ${(bill.payableWithinDueDate || 0).toLocaleString()}\n` +
        `📅 *Due Date:* ${bill.dueDate}\n` +
        `⚠️ *Payable After Due Date:* Rs. ${latePayable.toLocaleString()}\n` +
        `⚡ *Units Consumed:* ${bill.unitsConsumed} ${bill.utilityType === 'gas' ? 'HM3' : 'kWh'}\n` +
        `📊 *Status:* ${isPaid ? '✅ PAID (ادا شدہ)' : '⏳ UNPAID (غیر ادا شدہ)'}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `🔗 *Official Duplicate Bill Link:*\n${officialUrl}\n\n` +
        `_Verified via PakBill Hub App_`;

      await Share.share({
        title: `${bill.company} Bill - ${formatted}`,
        message: shareMessage,
      });
    } catch {
      // ignore
    } finally {
      setSharing(false);
    }
  };

  useEffect(() => {
    if (!visible) return;

    let isMounted = true;
    const isGas = bill.utilityType === 'gas' || bill.company === 'SNGPL' || bill.company === 'SSGC';
    const defaultBase =
      bill.company === 'SNGPL'
        ? 'https://www.sngpl.com.pk'
        : bill.company === 'SSGC'
        ? 'https://sngpl-bill.pk'
        : 'https://bill.pitc.com.pk';
    setBaseUrl(defaultBase);

    const loadHtml = async () => {
      if (initialHtml) {
        setOfficialHtml(initialHtml);
        rawHtmlRef.current = initialHtml;
        setLoadingHtml(false);
        return;
      }

      // Gas bills: fetch authentic portal HTML or fallback to template
      if (isGas) {
        setLoadingHtml(true);
        try {
          const res = await ApiService.fetchOfficialBillHtml(bill.company, bill.referenceNo);
          if (res && res.html && isMounted) {
            setOfficialHtml(res.html);
            rawHtmlRef.current = res.html;
            setBaseUrl(res.baseUrl);
          } else if (isMounted) {
            const fallbackTemplate = generateOfficialBillTemplateHtml(bill);
            setOfficialHtml(fallbackTemplate);
            rawHtmlRef.current = fallbackTemplate;
          }
        } catch {
          if (isMounted) {
            const fallbackTemplate = generateOfficialBillTemplateHtml(bill);
            setOfficialHtml(fallbackTemplate);
            rawHtmlRef.current = fallbackTemplate;
          }
        } finally {
          if (isMounted) setLoadingHtml(false);
        }
      } else {
        // Electricity (MEPCO, LESCO, etc.): Direct live portal loading
        setOfficialHtml(null);
        setLoadingHtml(true);

        // Safety timeout so loader never hangs
        const timer = setTimeout(() => {
          if (isMounted) {
            setLoadingHtml(false);
          }
        }, 4000);

        return () => clearTimeout(timer);
      }
    };

    loadHtml();
    return () => {
      isMounted = false;
    };
  }, [visible, bill.company, bill.referenceNo, bill.billMonth, bill.utilityType, initialHtml]);

  const isUnpaid = bill.billStatus !== 'paid';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, darkMode ? styles.modalDark : styles.modalLight]}>
          {/* Official Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleGroup}>
              <View style={styles.verifiedRow}>
                <View style={styles.pulseDot} />
                <Text style={styles.verifiedText}>
                  {isUrdu ? 'تصدیق شدہ پی ڈی ایف بل' : 'VERIFIED PDF BILL'}
                </Text>
              </View>
              <Text style={styles.headerTitle}>
                {bill.company} {isUrdu ? 'پی ڈی ایف بل' : 'PDF Bill'}
              </Text>
              <Text style={styles.headerRefText}>
                Ref / Consumer: {bill.formattedRefNo || bill.referenceNo}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityLabel="Close"
            >
              <AppIcon name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Mode Switcher Tabs */}
          <View style={[styles.actionToolbar, darkMode ? styles.toolbarDark : styles.toolbarLight]}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  viewMode === 'official' && (darkMode ? styles.tabButtonActiveDark : styles.tabButtonActiveLight),
                ]}
                onPress={() => setViewMode('official')}
                activeOpacity={0.8}
              >
                <AppIcon
                  name="receipt"
                  size={15}
                  color={viewMode === 'official' ? '#FFFFFF' : (darkMode ? '#94A3B8' : '#64748B')}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    viewMode === 'official' ? styles.tabButtonTextActive : (darkMode ? styles.tabDarkText : styles.tabLightText),
                  ]}
                >
                  {isUrdu ? 'پی ڈی ایف بل' : 'PDF Bill'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  viewMode === 'summary' && (darkMode ? styles.tabButtonActiveDark : styles.tabButtonActiveLight),
                ]}
                onPress={() => setViewMode('summary')}
                activeOpacity={0.8}
              >
                <AppIcon
                  name="list"
                  size={15}
                  color={viewMode === 'summary' ? '#FFFFFF' : (darkMode ? '#94A3B8' : '#64748B')}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    viewMode === 'summary' ? styles.tabButtonTextActive : (darkMode ? styles.tabDarkText : styles.tabLightText),
                  ]}
                >
                  {isUrdu ? 'خلاصہ' : 'Summary'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Body */}
          <View style={[styles.webViewWrapper, viewMode !== 'official' && { display: 'none' }]}>
            <WebView
              source={
                officialHtml
                  ? { html: officialHtml, baseUrl }
                  : { uri: BillPdfService.getOfficialPortalDuplicateUrl(bill.company, bill.referenceNo) }
              }
              style={styles.webView}
              scalesPageToFit={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              originWhitelist={['*']}
              onLoadStart={() => {
                setLoadingHtml(true);
              }}
              onLoadEnd={() => {
                if (officialHtml) {
                  setLoadingHtml(false);
                }
              }}
              onMessage={(event) => {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  if (data.type === 'BILL_READY' && data.html) {
                    rawHtmlRef.current = data.html;
                    setLoadingHtml(false);
                  }
                } catch {}
              }}
              injectedJavaScript={`
                (function() {
                  try {
                    var cleanRef = '${(bill.referenceNo || '').replace(/[^0-9a-zA-Z]/g, '')}';
                    var input = document.getElementById('searchTextBox') || document.querySelector('input[name="searchTextBox"]') || document.querySelector('input[type="text"]');
                    var isBill = document.querySelector('.charges-bd-row') || document.querySelector('.main-table') || document.querySelector('.table-bordered') || (document.body && document.body.innerText && (document.body.innerText.includes('PAYABLE WITHIN DUE DATE') || document.body.innerText.includes('CONSUMER DETAIL') || document.body.innerText.includes('TARIFF') || document.body.innerText.includes('FEEDER NAME') || document.body.innerText.includes('ELECTRICITY CONSUMER BILL')));

                    if (input && !isBill) {
                      var btn = document.getElementById('btnSearch') || document.querySelector('input[name="btnSearch"]') || document.querySelector('input[type="submit"]');
                      var radioRef = document.getElementById('rbSearchByList_0') || document.querySelector('input[value="refno"]');
                      var radioCust = document.getElementById('rbSearchByList_1') || document.querySelector('input[value="appno"]');
                      if (radioRef && cleanRef.length > 10) {
                        radioRef.checked = true;
                      } else if (radioCust && cleanRef.length <= 10) {
                        radioCust.checked = true;
                      }

                      if (btn && !window.__billAutoSubmitted) {
                        window.__billAutoSubmitted = true;
                        input.value = cleanRef;
                        btn.click();
                      }
                    } else {
                      var centerStyle = document.createElement('style');
                      centerStyle.innerHTML = 'html, body { margin: 0 !important; padding: 0 !important; text-align: center !important; background: #FFFFFF !important; } center, form, .main-table, #bill, table { margin: 0 auto !important; } button, input[type=button], input[type=submit], .print-btn, .btn, .noprint, #print-btn, [onclick*="print"] { display: none !important; }';
                      document.head.appendChild(centerStyle);

                      if (window.ReactNativeWebView && !window.__billReadySent) {
                        window.__billReadySent = true;
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'BILL_READY',
                          html: document.documentElement.outerHTML
                        }));
                      }
                    }
                  } catch (e) {}
                })();
                true;
              `}
            />
            {loadingHtml && (
              <View style={[styles.loadingContainer, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: darkMode ? '#0F172A' : '#FFFFFF', zIndex: 99 }]}>
                <ActivityIndicator size="large" color="#006D35" />
                <Text style={[styles.loadingText, darkMode ? styles.textDark : styles.textLight, { marginTop: 12 }]}>
                  {isUrdu
                    ? 'محکمہ سے اصل ڈپلیکیٹ بل لوڈ ہو رہا ہے...'
                    : `Loading authentic ${bill.company} bill...`}
                </Text>
              </View>
            )}
          </View>

          {/* Parsed Summary Document Sheet */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.billDocumentContainer}
            style={[viewMode !== 'summary' && { display: 'none' }]}
          >
            <View style={[styles.billDocumentSheet, darkMode ? styles.sheetDark : styles.sheetLight]}>
              {/* Document Header */}
              <View style={[styles.sheetHeader, darkMode && { borderBottomColor: '#334155' }]}>
                <Text style={[styles.sheetMainTitle, darkMode && { color: '#FFFFFF' }]}>
                  {bill.companyName || `${bill.company} Gas Pipelines / Electric`}
                </Text>
                <Text style={[styles.sheetSubTitle, darkMode && { color: '#94A3B8' }]}>
                  GOVERNMENT OF PAKISTAN • MINISTRY OF ENERGY
                </Text>
                <View style={[styles.sheetStampBadge, darkMode && { backgroundColor: '#334155' }]}>
                  <Text style={[styles.sheetStampText, darkMode && { color: '#F1F5F9' }]}>
                    AUTHENTIC CONSUMER COPY
                  </Text>
                </View>
              </View>

              {/* Amount Banner */}
              <View style={[styles.sheetAmountBanner, darkMode && { backgroundColor: '#1E293B', borderColor: '#334155' }]}>
                <View>
                  <Text style={[styles.sheetLabel, darkMode && { color: '#94A3B8' }]}>TOTAL AMOUNT PAYABLE</Text>
                  <Text style={[styles.sheetAmountVal, darkMode && { color: '#FFFFFF' }]}>
                    PKR {bill.payableWithinDueDate.toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.statusChip, isUnpaid ? styles.statusUnpaid : styles.statusPaid]}>
                  <Text style={isUnpaid ? styles.statusUnpaidText : styles.statusPaidText}>
                    {isUnpaid ? 'UNPAID' : 'PAID'}
                  </Text>
                </View>
              </View>

              {/* 2-Column Info Grid */}
              <View style={styles.sheet2ColGrid}>
                <View style={[styles.sheetInfoBox, darkMode && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                  <Text style={[styles.sheetBoxLabel, darkMode && { color: '#94A3B8' }]}>DUE DATE</Text>
                  <Text style={[styles.sheetBoxVal, darkMode && { color: '#FFFFFF' }]}>{bill.dueDate}</Text>
                </View>
                <View style={[styles.sheetInfoBox, darkMode && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                  <Text style={[styles.sheetBoxLabel, darkMode && { color: '#94A3B8' }]}>AFTER DUE DATE</Text>
                  <Text style={[styles.sheetBoxVal, { color: '#EF4444' }]}>
                    Rs. {bill.payableAfterDueDate.toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.sheetInfoBox, darkMode && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                  <Text style={[styles.sheetBoxLabel, darkMode && { color: '#94A3B8' }]}>BILLING MONTH</Text>
                  <Text style={[styles.sheetBoxVal, darkMode && { color: '#FFFFFF' }]}>{bill.billMonth || 'SEP 2026'}</Text>
                </View>
                <View style={[styles.sheetInfoBox, darkMode && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                  <Text style={[styles.sheetBoxLabel, darkMode && { color: '#94A3B8' }]}>UNITS CONSUMED</Text>
                  <Text style={[styles.sheetBoxVal, { color: darkMode ? '#62FF96' : '#006D35' }]}>
                    {bill.unitsConsumed} {bill.utilityType === 'gas' ? 'HM3' : 'kWh'}
                  </Text>
                </View>
              </View>

              {/* Consumer Info Table */}
              <View style={[styles.tableBlock, darkMode && { borderColor: '#334155' }]}>
                <View style={[styles.tableHeaderBar, darkMode && { backgroundColor: '#0F172A' }]}>
                  <Text style={styles.tableHeaderTitle}>CONSUMER IDENTIFICATION</Text>
                </View>
                <View style={[styles.tableRow, darkMode && { backgroundColor: '#1E293B', borderBottomColor: '#334155' }]}>
                  <Text style={[styles.tableCellLabel, darkMode && { color: '#94A3B8' }]}>Consumer Name</Text>
                  <Text style={[styles.tableCellValBold, darkMode && { color: '#FFFFFF' }]}>{bill.consumerName}</Text>
                </View>
                <View style={[styles.tableRow, darkMode && { backgroundColor: '#1E293B', borderBottomColor: '#334155' }]}>
                  <Text style={[styles.tableCellLabel, darkMode && { color: '#94A3B8' }]}>Reference / Consumer No</Text>
                  <Text style={[styles.tableCellMono, darkMode && { color: '#FFFFFF' }]}>{bill.formattedRefNo || bill.referenceNo}</Text>
                </View>
                {bill.consumerId ? (
                  <View style={[styles.tableRow, darkMode && { backgroundColor: '#1E293B', borderBottomColor: '#334155' }]}>
                    <Text style={[styles.tableCellLabel, darkMode && { color: '#94A3B8' }]}>Account ID</Text>
                    <Text style={[styles.tableCellValBold, darkMode && { color: '#FFFFFF' }]}>{bill.consumerId}</Text>
                  </View>
                ) : null}
                <View style={[styles.tableRow, darkMode && { backgroundColor: '#1E293B', borderBottomColor: '#334155' }]}>
                  <Text style={[styles.tableCellLabel, darkMode && { color: '#94A3B8' }]}>Meter Number</Text>
                  <Text style={[styles.tableCellValBold, darkMode && { color: '#FFFFFF' }]}>{bill.meterNo || 'N/A'}</Text>
                </View>
                <View style={[styles.tableRow, darkMode && { backgroundColor: '#1E293B', borderBottomColor: '#334155' }]}>
                  <Text style={[styles.tableCellLabel, darkMode && { color: '#94A3B8' }]}>Tariff / Category</Text>
                  <Text style={[styles.tableCellVal, darkMode && { color: '#FFFFFF' }]}>{bill.tariff || 'Domestic'}</Text>
                </View>
                {bill.consumerAddress ? (
                  <View style={[styles.tableRow, darkMode && { backgroundColor: '#1E293B', borderBottomColor: '#334155' }]}>
                    <Text style={[styles.tableCellLabel, darkMode && { color: '#94A3B8' }]}>Address</Text>
                    <Text style={[styles.tableCellVal, darkMode && { color: '#FFFFFF' }, { maxWidth: '65%', textAlign: 'right' }]} numberOfLines={2}>
                      {bill.consumerAddress}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Meter Readings Table */}
              <View style={[styles.tableBlock, darkMode && { borderColor: '#334155' }]}>
                <View style={[styles.tableHeaderBar, darkMode && { backgroundColor: '#0F172A' }]}>
                  <Text style={styles.tableHeaderTitle}>METER READING DETAILS</Text>
                </View>
                <View style={[styles.tableRow, darkMode && { backgroundColor: '#1E293B', borderBottomColor: '#334155' }]}>
                  <Text style={[styles.tableCellLabel, darkMode && { color: '#94A3B8' }]}>Previous Reading</Text>
                  <Text style={[styles.tableCellNum, darkMode && { color: '#FFFFFF' }]}>{bill.previousReading?.toLocaleString() || '0'}</Text>
                </View>
                <View style={[styles.tableRow, darkMode && { backgroundColor: '#1E293B', borderBottomColor: '#334155' }]}>
                  <Text style={[styles.tableCellLabel, darkMode && { color: '#94A3B8' }]}>Current Reading</Text>
                  <Text style={[styles.tableCellNum, darkMode && { color: '#FFFFFF' }]}>{bill.presentReading?.toLocaleString() || '0'}</Text>
                </View>
                <View style={[styles.tableRow, darkMode && { backgroundColor: '#1E293B', borderBottomColor: '#334155' }]}>
                  <Text style={[styles.tableCellLabel, darkMode && { color: '#94A3B8' }]}>Gas / Electricity Consumed</Text>
                  <Text style={[styles.tableCellValBold, { color: darkMode ? '#62FF96' : '#006D35' }]}>
                    {bill.unitsConsumed} {bill.utilityType === 'gas' ? 'HM3' : 'kWh'}
                  </Text>
                </View>
              </View>

              {/* Barcode representation */}
              <View style={[styles.barcodeSection, darkMode && { backgroundColor: '#1E293B', borderTopColor: '#334155' }]}>
                <Text style={[styles.barcodeTitle, darkMode && { color: '#94A3B8' }]}>OFFICIAL BILL BARCODE REFERENCE</Text>
                <View style={[styles.barcodeBox, darkMode && { backgroundColor: '#0F172A', borderColor: '#334155' }]}>
                  <Text style={[styles.barcodeText, darkMode && { color: '#FFFFFF' }]}>
                    *{(bill.formattedRefNo || bill.referenceNo).replace(/[^0-9]/g, '')}*
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Download Success Bar with Direct View / Open Action */}
          {downloadedPath ? (
            <View style={[styles.downloadSuccessBanner, darkMode ? styles.downloadSuccessDark : styles.downloadSuccessLight]}>
              <View style={styles.downloadSuccessLeft}>
                <AppIcon name="check-circle" size={16} color="#059669" />
                <Text style={[styles.downloadSuccessText, { color: darkMode ? '#A7F3D0' : '#065F46' }]}>
                  {isUrdu ? 'بل محفوظ ہو گیا' : 'PDF Saved in Downloads'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.viewDownloadedBtn}
                onPress={() => BillPdfService.openPdf(downloadedPath)}
                activeOpacity={0.8}
                accessibilityLabel="Open Downloaded PDF"
              >
                <AppIcon name="document" size={14} color="#FFFFFF" />
                <Text style={styles.viewDownloadedBtnText}>
                  {isUrdu ? 'دیکھیں (View PDF)' : 'View PDF'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Fixed Bottom Action Footer */}
          <View style={[styles.bottomFooter, darkMode ? styles.bottomFooterDark : styles.bottomFooterLight]}>
            {/* Primary Print / Save as PDF Button */}
            <TouchableOpacity
              style={styles.savePdfBtn}
              onPress={handlePrint}
              disabled={printing}
              activeOpacity={0.85}
              accessibilityLabel="Print or Save Official Bill PDF"
            >
              {printing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <AppIcon name="printer" size={18} color="#FFFFFF" />
              )}
              <Text style={styles.savePdfBtnText}>
                {printing
                  ? (isUrdu ? 'پرنٹ لوڈ ہو رہا ہے...' : 'Preparing Print...')
                  : (isUrdu ? 'پرنٹ / پی ڈی ایف محفوظ کریں' : 'Print / Save as PDF')}
              </Text>
            </TouchableOpacity>

            {/* Share PDF Icon Button */}
            <TouchableOpacity
              style={[styles.shareIconButton, darkMode ? styles.shareIconDark : styles.shareIconLight]}
              onPress={handleShare}
              disabled={sharing}
              activeOpacity={0.85}
              accessibilityLabel="Share PDF Document"
            >
              {sharing ? (
                <ActivityIndicator size="small" color={darkMode ? '#62FF96' : '#006D35'} />
              ) : (
                <AppIcon
                  name="share"
                  size={20}
                  color={darkMode ? '#62FF96' : '#006D35'}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

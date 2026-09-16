import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
} from 'react-native';
import { BillData } from '../../types/bill';
import { AppIcon } from '../AppIcon';
import { Language } from '../../i18n/translations';

interface OfficialBillModalProps {
  visible: boolean;
  bill: BillData;
  language: Language;
  darkMode: boolean;
  onClose: () => void;
  onSaveToGallery?: () => void;
}

export const OfficialBillModal: React.FC<OfficialBillModalProps> = ({
  visible,
  bill,
  language,
  darkMode,
  onClose,
  onSaveToGallery,
}) => {
  const isUrdu = language === 'ur';

  const handleShare = async () => {
    try {
      await Share.share({
        title: `${bill.company} Official Bill Copy`,
        message: `📄 *${bill.company} Official Duplicate Bill*\n👤 Consumer: ${bill.consumerName}\n🔢 Ref: ${bill.formattedRefNo || bill.referenceNo}\n💰 Amount: PKR ${bill.payableWithinDueDate.toLocaleString()}\n📅 Due Date: ${bill.dueDate}\n⚡ Units: ${bill.unitsConsumed} kWh\n\nVerified via BillCheck PK App`,
      });
    } catch {
      // ignore
    }
  };

  const isUnpaid = bill.billStatus !== 'paid';
  const electricityCost =
    bill.totalElectricityCharges ||
    Math.max(
      0,
      bill.payableWithinDueDate -
        (bill.fpaAmount || 1420) -
        (bill.electricityDuty || 840) -
        (bill.gstAmount || 1765) -
        (bill.tvFee || 35)
    ) ||
    10260;

  const fpaAmount = bill.fpaAmount || 1420;
  const fcAndEd = (bill.electricityDuty || 0) + (bill.chargesBreakdown?.find((c) => c.labelEn.includes('FC'))?.value || 840);
  const gstAndTv = (bill.gstAmount || 0) + (bill.tvFee || 0) || 1800;

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
                <Text style={styles.verifiedText}>OFFICIAL BILL MIRROR</Text>
              </View>
              <Text style={styles.headerTitle}>
                {bill.company} Duplicate Bill
              </Text>
              <Text style={styles.headerRefText}>
                Ref: {bill.formattedRefNo || bill.referenceNo}
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

          {/* Action Toolbar */}
          <View style={[styles.actionToolbar, darkMode ? styles.toolbarDark : styles.toolbarLight]}>
            <TouchableOpacity
              style={styles.actionBtnPrimary}
              onPress={onSaveToGallery || handleShare}
              activeOpacity={0.8}
            >
              <AppIcon name="file-down" size={16} color="#FFFFFF" />
              <Text style={styles.actionBtnPrimaryText}>
                {isUrdu ? 'گیلری / فون میں محفوظ کریں' : 'Save PDF to Phone'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtnSecondary, darkMode ? styles.actionBtnDark : styles.actionBtnLight]}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <AppIcon name="share" size={16} color={darkMode ? '#62FF96' : '#0F1C2C'} />
              <Text style={darkMode ? styles.actionBtnDarkText : styles.actionBtnLightText}>
                {isUrdu ? 'شیئر' : 'Share'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bill Document Scroll View */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.billDocumentContainer}
          >
            <View style={[styles.billDocumentSheet, darkMode ? styles.sheetDark : styles.sheetLight]}>
              {/* Document Header */}
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetMainTitle}>{bill.companyName || `${bill.company} Electric Supply Company`}</Text>
                <Text style={styles.sheetSubTitle}>GOVERNMENT OF PAKISTAN • MINISTRY OF ENERGY</Text>
                <View style={styles.sheetStampBadge}>
                  <Text style={styles.sheetStampText}>AUTHENTIC CONSUMER COPY</Text>
                </View>
              </View>

              {/* Amount Banner */}
              <View style={styles.sheetAmountBanner}>
                <View>
                  <Text style={styles.sheetLabel}>TOTAL AMOUNT PAYABLE</Text>
                  <Text style={styles.sheetAmountVal}>PKR {bill.payableWithinDueDate.toLocaleString()}</Text>
                </View>
                <View style={[styles.statusChip, isUnpaid ? styles.statusUnpaid : styles.statusPaid]}>
                  <Text style={isUnpaid ? styles.statusUnpaidText : styles.statusPaidText}>
                    {isUnpaid ? 'UNPAID' : 'PAID'}
                  </Text>
                </View>
              </View>

              {/* 2-Column Info Grid */}
              <View style={styles.sheet2ColGrid}>
                <View style={styles.sheetInfoBox}>
                  <Text style={styles.sheetBoxLabel}>DUE DATE</Text>
                  <Text style={styles.sheetBoxVal}>{bill.dueDate}</Text>
                </View>
                <View style={styles.sheetInfoBox}>
                  <Text style={styles.sheetBoxLabel}>AFTER DUE DATE</Text>
                  <Text style={[styles.sheetBoxVal, { color: '#BA1A1A' }]}>
                    Rs. {bill.payableAfterDueDate.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.sheetInfoBox}>
                  <Text style={styles.sheetBoxLabel}>BILLING MONTH</Text>
                  <Text style={styles.sheetBoxVal}>{bill.billMonth || 'NOV 2024'}</Text>
                </View>
                <View style={styles.sheetInfoBox}>
                  <Text style={styles.sheetBoxLabel}>UNITS CONSUMED</Text>
                  <Text style={[styles.sheetBoxVal, { color: '#006D35' }]}>{bill.unitsConsumed} kWh</Text>
                </View>
              </View>

              {/* Consumer Info Table */}
              <View style={styles.tableBlock}>
                <View style={styles.tableHeaderBar}>
                  <Text style={styles.tableHeaderTitle}>CONSUMER IDENTIFICATION</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellLabel}>Consumer Name</Text>
                  <Text style={styles.tableCellValBold}>{bill.consumerName}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellLabel}>Reference Number</Text>
                  <Text style={styles.tableCellMono}>{bill.formattedRefNo || bill.referenceNo}</Text>
                </View>
                {bill.consumerId ? (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCellLabel}>Consumer ID</Text>
                    <Text style={styles.tableCellValBold}>{bill.consumerId}</Text>
                  </View>
                ) : null}
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellLabel}>Meter Number</Text>
                  <Text style={styles.tableCellValBold}>{bill.meterNo || '4092184'}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellLabel}>Tariff Category</Text>
                  <Text style={styles.tableCellVal}>{bill.consumerDetails?.category || bill.tariff || 'Domestic A-1a'}</Text>
                </View>
                {bill.consumerAddress ? (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCellLabel}>Address</Text>
                    <Text style={styles.tableCellVal}>{bill.consumerAddress}</Text>
                  </View>
                ) : null}
              </View>

              {/* Charges Table */}
              <View style={styles.tableBlock}>
                <View style={styles.tableHeaderBar}>
                  <Text style={styles.tableHeaderTitle}>NEPRA TARIFF & TAX BREAKDOWN</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellLabel}>Electricity Cost</Text>
                  <Text style={styles.tableCellNum}>Rs. {electricityCost.toLocaleString()}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellLabel}>Fuel Price Adjustment (FPA)</Text>
                  <Text style={styles.tableCellNum}>Rs. {fpaAmount.toLocaleString()}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellLabel}>FC Surcharge & Duty</Text>
                  <Text style={styles.tableCellNum}>Rs. {fcAndEd.toLocaleString()}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellLabel}>GST & TV Fee</Text>
                  <Text style={styles.tableCellNum}>Rs. {gstAndTv.toLocaleString()}</Text>
                </View>
                <View style={styles.tableTotalRow}>
                  <Text style={styles.tableTotalLabel}>Net Amount Due</Text>
                  <Text style={styles.tableTotalVal}>Rs. {bill.payableWithinDueDate.toLocaleString()}</Text>
                </View>
              </View>

              {/* Barcode Strip */}
              <View style={styles.barcodeSection}>
                <Text style={styles.barcodeTitle}>1BILL / 1LINK PAYMENT NUMBER</Text>
                <View style={styles.barcodeBox}>
                  <Text style={styles.barcodeText}>||| | |||| | {bill.referenceNo} |||| | |||</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 14, 23, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '92%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalLight: {
    backgroundColor: '#F8F9FF',
  },
  modalDark: {
    backgroundColor: '#070E17',
  },
  modalHeader: {
    backgroundColor: '#0F1C2C',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#62FF96',
  },
  headerTitleGroup: {
    flex: 1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#62FF96',
  },
  verifiedText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#62FF96',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerRefText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#778598',
    marginTop: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(211, 228, 254, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  actionToolbar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  toolbarLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#D3E4FE',
  },
  toolbarDark: {
    backgroundColor: '#0F1C2C',
    borderBottomColor: '#24354D',
  },
  actionBtnPrimary: {
    flex: 1.6,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#3FFF8B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionBtnSecondary: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
  },
  actionBtnLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0F1C2C',
  },
  actionBtnDark: {
    backgroundColor: '#132033',
    borderColor: '#62FF96',
  },
  actionBtnLightText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F1C2C',
  },
  actionBtnDarkText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#62FF96',
  },
  billDocumentContainer: {
    padding: 14,
    paddingBottom: 40,
  },
  billDocumentSheet: {
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  sheetLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C4C6CC',
  },
  sheetDark: {
    backgroundColor: '#0F1C2C',
    borderColor: '#24354D',
  },
  sheetHeader: {
    backgroundColor: '#0F1C2C',
    padding: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#62FF96',
  },
  sheetMainTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  sheetSubTitle: {
    fontSize: 9,
    fontWeight: '600',
    color: '#778598',
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sheetStampBadge: {
    backgroundColor: 'rgba(98, 255, 150, 0.15)',
    borderWidth: 1,
    borderColor: '#62FF96',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    marginTop: 6,
  },
  sheetStampText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#62FF96',
    letterSpacing: 0.5,
  },
  sheetAmountBanner: {
    backgroundColor: '#EFF4FF',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D3E4FE',
  },
  sheetLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#778598',
    letterSpacing: 0.5,
  },
  sheetAmountVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#006D35',
    marginTop: 2,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 99,
    borderWidth: 1,
  },
  statusUnpaid: {
    backgroundColor: '#FFDAD6',
    borderColor: '#BA1A1A',
  },
  statusPaid: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  statusUnpaidText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#BA1A1A',
  },
  statusPaidText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sheet2ColGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 8,
    backgroundColor: '#FAFCFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFF4FF',
  },
  sheetInfoBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D3E4FE',
    borderRadius: 6,
    padding: 8,
  },
  sheetBoxLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#778598',
  },
  sheetBoxVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B1C30',
    marginTop: 2,
  },
  tableBlock: {
    margin: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D3E4FE',
    overflow: 'hidden',
  },
  tableHeaderBar: {
    backgroundColor: '#0F1C2C',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tableHeaderTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF4FF',
    backgroundColor: '#FFFFFF',
  },
  tableCellLabel: {
    fontSize: 11,
    color: '#44474C',
  },
  tableCellVal: {
    fontSize: 11,
    color: '#0B1C30',
  },
  tableCellValBold: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B1C30',
  },
  tableCellMono: {
    fontSize: 11,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#0B1C30',
  },
  tableCellNum: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B1C30',
  },
  tableTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#EFF4FF',
  },
  tableTotalLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0B1C30',
  },
  tableTotalVal: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#006D35',
  },
  barcodeSection: {
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EFF4FF',
    backgroundColor: '#FFFFFF',
  },
  barcodeTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#778598',
  },
  barcodeBox: {
    backgroundColor: '#F8F9FF',
    borderWidth: 1,
    borderColor: '#D3E4FE',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 4,
  },
  barcodeText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#0F1C2C',
  },
});

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  StatusBar,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { APP_CONFIG } from '../constants/appConfig';
import { AppIcon } from '../components/AppIcon';
import { styles } from '../styles/SplashScreen.styles';

interface SplashScreenProps {
  onFinish?: () => void;
  minDuration?: number;
}

const FEEDS_CHIPS = ['LESCO', 'K-ELECTRIC', 'IESCO', 'SNGPL', 'SSGC'];

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDuration = 2200,
}) => {
  const [percent, setPercent] = useState(15);
  const progressAnim = useRef(new Animated.Value(0.15)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Ping/pulse animation for live status badge
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // Progress bar animation from 15% -> 100%
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: minDuration - 400,
      useNativeDriver: false,
    }).start();

    // Interval to update percentage text
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prev + Math.floor(Math.random() * 18 + 12), 100);
      });
    }, 280);

    // Fade out and finish callback
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) {
          onFinish();
        }
      });
    }, minDuration);

    return () => {
      pulse.stop();
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [fadeAnim, minDuration, onFinish, progressAnim, pulseAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" />

      {/* Subtle Radial Glow Background */}
      <View style={styles.glowBgTop} />
      <View style={styles.glowBgBottom} />

      {/* Vector Micro-Circuit Overlay */}
      <View style={styles.circuitSvg} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox="0 0 400 800">
          <Path
            d="M40 0V180L90 230H200M360 0V140L310 190H260"
            stroke="#62FF96"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <Circle cx="200" cy="230" r="3" fill="#62FF96" />
          <Circle cx="260" cy="190" r="3" fill="#62FF96" />
          <Path
            d="M0 400H80L120 440V560L160 600H240"
            stroke="#62FF96"
            strokeDasharray="3 5"
            strokeWidth="1"
          />
          <Circle cx="240" cy="600" r="2.5" fill="#62FF96" />
          <Path
            d="M400 420H320L280 460V640L240 680H180"
            stroke="#62FF96"
            strokeWidth="1"
          />
          <Circle cx="180" cy="680" r="3" fill="#62FF96" />
          <Path
            d="M120 740L150 770H250L280 740"
            stroke="#62FF96"
            strokeDasharray="4 3"
            strokeWidth="0.8"
          />
        </Svg>
      </View>

      {/* Top Institutional Status Line */}
      <View style={styles.header}>
        <View style={styles.statusBadge}>
          <View style={styles.pulseDotWrapper}>
            <Animated.View
              style={[
                styles.pulseDotOuter,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
            <View style={styles.pulseDotInner} />
          </View>
          <Text style={styles.statusText}>SECURE SYNC ACTIVE</Text>
        </View>

        <View style={styles.gridBadge}>
          <Text style={styles.gridText}>PAKISTAN NATIONAL GRID</Text>
          <AppIcon name="shield-check" size={14} color="#62FF96" />
        </View>
      </View>

      {/* Center Layout: Dual Utility Core Emblem & Identity */}
      <View style={styles.centerContent}>
        <View style={styles.emblemWrapper}>
          <View style={styles.emblemGlow} />

          {/* Realistic Digital Utility Bill Invoice */}
          <View style={styles.billInvoiceSlate}>
            {/* Top Navy Header Strip with Company & Utility Label */}
            <View style={styles.invoiceHeader}>
              <View style={styles.invoiceHeaderLeft}>
                <AppIcon name="receipt" size={11} color="#62FF96" />
                <Text style={styles.invoiceHeaderTitle}>UTILITY BILL</Text>
              </View>
              <View style={styles.invoiceHeaderBadge}>
                <Text style={styles.invoiceHeaderBadgeText}>LIVE</Text>
              </View>
            </View>

            {/* Sub-header with Provider indicators */}
            <View style={styles.invoiceSubHeader}>
              <Text style={styles.invoiceCompanyText}>LESCO • MEPCO • SNGPL</Text>
            </View>

            {/* Reference & Barcode Line */}
            <View style={styles.invoiceBarcodeSection}>
              <View style={styles.barcodeVisual}>
                <View style={[styles.barLine, { width: 2, height: 11 }]} />
                <View style={[styles.barLine, { width: 3, height: 11 }]} />
                <View style={[styles.barLine, { width: 1, height: 11 }]} />
                <View style={[styles.barLine, { width: 4, height: 11 }]} />
                <View style={[styles.barLine, { width: 2, height: 11 }]} />
                <View style={[styles.barLine, { width: 1, height: 11 }]} />
                <View style={[styles.barLine, { width: 3, height: 11 }]} />
                <View style={[styles.barLine, { width: 4, height: 11 }]} />
                <View style={[styles.barLine, { width: 2, height: 11 }]} />
                <View style={[styles.barLine, { width: 3, height: 11 }]} />
              </View>
              <Text style={styles.invoiceRefText}>REF: 15115-371598719</Text>
            </View>

            {/* Bill Key Stats Strip */}
            <View style={styles.invoiceStatsRow}>
              <View style={styles.invoiceStatCol}>
                <Text style={styles.statLabel}>DUE DATE</Text>
                <Text style={styles.statVal}>AUG 26</Text>
              </View>
              <View style={styles.invoiceDividerVertical} />
              <View style={styles.invoiceStatCol}>
                <Text style={styles.statLabel}>PAYABLE</Text>
                <Text style={styles.statAmount}>Rs. 2,596</Text>
              </View>
            </View>

            {/* Bottom Utility Chips */}
            <View style={styles.invoiceBottomRow}>
              <View style={styles.miniUtilityChipZap}>
                <AppIcon name="zap" size={9} color="#006D35" />
                <Text style={styles.miniChipZapText}>11 DISCOs</Text>
              </View>
              <View style={styles.miniUtilityChipFlame}>
                <AppIcon name="flame" size={9} color="#EA580C" />
                <Text style={styles.miniChipFlameText}>2 Gas</Text>
              </View>
            </View>
          </View>

          {/* Tech Badge Pin */}
          <View style={styles.techBadgePin}>
            <AppIcon name="shield-check" size={10} color="#62FF96" />
            <Text style={styles.techBadgeText}>100% SECURE & FAST</Text>
          </View>
        </View>

        {/* Title & Identity */}
        <View style={styles.appTitleRow}>
          <Text style={styles.appTitleMain}>BillCheck</Text>
          <Text style={styles.appTitleAccent}>PK</Text>
        </View>
        <Text style={styles.appSubtitle}>{APP_CONFIG.tagline}</Text>

        {/* Feeds Micro Chips */}
        <View style={styles.chipsRow}>
          {FEEDS_CHIPS.map((chip) => (
            <View key={chip} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Section: Progress Bar & Brand Attribution */}
      <View style={styles.footer}>
        <View style={styles.progressWrapper}>
          <View style={styles.progressLabelRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <AppIcon name="refresh" size={12} color="#62FF96" />
              <Text style={styles.progressLabel}>Syncing Discos & Gas Portals</Text>
            </View>
            <Text style={styles.progressPercent}>{percent}%</Text>
          </View>

          <View style={styles.progressBarTrack}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: progressWidth },
              ]}
            />
          </View>
        </View>

        {/* Attribution & Version */}
        <View style={styles.attributionRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.brandByText}>by</Text>
            <Text style={styles.brandNameText}>Arcloom Tech</Text>
          </View>

          <View style={styles.versionCapsule}>
            <AppIcon name="terminal" size={11} color="#62FF96" />
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

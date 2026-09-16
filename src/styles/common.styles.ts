import { StyleSheet } from 'react-native';

export const COLORS = {
  // Brand Palette: Navy Blue & Emerald Green
  primary: '#10B981',        // Emerald Green (Brand Accent)
  primaryLight: '#3FFF8B',   // Electric Neon Green (Dark Mode Glow)
  primaryDark: '#006D35',    // Deep Pakistan Green (Light Mode Text & Badges)
  emeraldGlow: '#62FF96',    // Mint Green for accents & icons
  
  navyMidnight: '#070E18',   // Deepest Midnight Navy (Dark Canvas)
  navyDeep: '#0C2B4E',       // Signature Header & TopBar Rich Navy
  navyCard: '#122D4D',       // Elevated Card Dark Navy
  navySurface: '#1B3B60',    // Interactive Surface Dark Navy
  navyBorder: '#284E77',     // Dark Border Navy
  
  navyTextLight: '#0A1C30',  // Authoritative Navy Text (Light Mode)
  navySubLight: '#334E68',   // Muted Navy Subtitle (Light Mode)
  navyIceBg: '#F0F5FA',      // Soft Ice-Navy Canvas (Light Mode)
  navyLightBorder: '#D5E2EE', // Crisp Navy-Tinted Border (Light Mode)

  secondary: '#0284C7',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#6366F1',

  // Dark Theme Tokens (Deep Royal Navy & Glowing Emerald)
  darkBg: '#070E18',
  darkCard: '#122D4D',
  darkBorder: '#284E77',
  darkText: '#F8FAFC',
  darkSub: '#CBD5E1',
  darkInput: '#0C2B4E',
  darkInputBorder: '#284E77',

  // Light Theme Tokens (Crisp White, Ice-Navy, Deep Navy & Emerald)
  lightBg: '#F0F5FA',
  lightCard: '#FFFFFF',
  lightBorder: '#D5E2EE',
  lightText: '#0A1C30',
  lightSub: '#334E68',
  lightInput: '#F8FAFC',
  lightInputBorder: '#CBD5E1',
};

export const commonStyles = StyleSheet.create({
  rtlText: {
    textAlign: 'right',
  },
  rtlInput: {
    textAlign: 'right',
  },
  fontMono: {
    fontFamily: 'monospace',
  },
});

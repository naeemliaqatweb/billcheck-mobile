import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#10B981',
  primaryDark: '#059669',
  secondary: '#0284C7',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#6366F1',

  darkBg: '#030712',
  darkCard: '#111827',
  darkBorder: '#1F2937',
  darkText: '#F9FAFB',
  darkSub: '#9CA3AF',
  darkInput: '#030712',
  darkInputBorder: '#374151',

  lightBg: '#F8FAFC',
  lightCard: '#FFFFFF',
  lightBorder: '#E2E8F0',
  lightText: '#0F172A',
  lightSub: '#64748B',
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

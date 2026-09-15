import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  darkBg: {
    backgroundColor: '#030712',
  },
  lightBg: {
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  darkText: {
    color: '#F9FAFB',
  },
  lightText: {
    color: '#0F172A',
  },
  darkSub: {
    color: '#9CA3AF',
  },
  lightSub: {
    color: '#64748B',
  },
  darkCard: {
    backgroundColor: '#111827',
    borderColor: '#1F2937',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  settingSub: {
    fontSize: 12,
    marginTop: 2,
  },
  langToggleRow: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    overflow: 'hidden',
  },
  langChoice: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  langChoiceActive: {
    backgroundColor: '#10B981',
  },
  langChoiceText: {
    fontSize: 13,
    fontWeight: '700',
  },
  langActiveText: {
    color: '#FFFFFF',
  },
  legalCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  legalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  legalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  legalBody: {
    fontSize: 12,
    lineHeight: 18,
  },
  badgeContainer: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  complianceBadgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  complianceBadgeText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    marginVertical: 12,
  },
  rtlText: {
    textAlign: 'right',
  },
});

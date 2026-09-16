import {
  ELECTRICITY_PROVIDERS,
  GAS_PROVIDERS,
  ALL_PROVIDERS,
  ProviderInfo,
} from '../src/constants/providers';
import { getProviderLogo, hasLocalLogo } from '../src/constants/providerLogos';

describe('Utility Providers & Logos Test Suite', () => {
  describe('Electricity Providers', () => {
    it('should have all 11 major Pakistani electricity companies configured', () => {
      const expectedCodes = [
        'LESCO',
        'MEPCO',
        'IESCO',
        'FESCO',
        'GEPCO',
        'PESCO',
        'HESCO',
        'SEPCO',
        'QESCO',
        'TESCO',
        'KELECTRIC',
      ];
      expect(ELECTRICITY_PROVIDERS.length).toBe(11);
      const codes = ELECTRICITY_PROVIDERS.map((p) => p.code);
      expectedCodes.forEach((expected) => {
        expect(codes).toContain(expected);
      });
    });

    it('each electricity provider should have valid metadata, URLs and refLength', () => {
      ELECTRICITY_PROVIDERS.forEach((provider: ProviderInfo) => {
        expect(provider.code).toBeTruthy();
        expect(provider.name).toBeTruthy();
        expect(provider.fullName).toBeTruthy();
        expect(provider.type).toBe('electricity');
        expect(provider.region).toBeTruthy();
        expect(provider.portalUrl).toMatch(/^https?:\/\//);
        expect(provider.officialSite).toMatch(/^https?:\/\//);

        if (provider.code === 'KELECTRIC') {
          expect(provider.refLength).toBe(13);
        } else {
          expect(provider.refLength).toBe(14);
        }
      });
    });
  });

  describe('Gas Providers', () => {
    it('should have both Sui gas companies (SNGPL and SSGC)', () => {
      const codes = GAS_PROVIDERS.map((p) => p.code);
      expect(codes).toContain('SNGPL');
      expect(codes).toContain('SSGC');
      expect(GAS_PROVIDERS.length).toBe(2);
    });

    it('each gas provider should have valid metadata, refLength and portals', () => {
      GAS_PROVIDERS.forEach((provider: ProviderInfo) => {
        expect(provider.code).toBeTruthy();
        expect(provider.name).toBeTruthy();
        expect(provider.fullName).toBeTruthy();
        expect(provider.type).toBe('gas');
        expect(provider.region).toBeTruthy();
        expect(provider.portalUrl).toMatch(/^https?:\/\//);
        expect(provider.officialSite).toMatch(/^https?:\/\//);

        if (provider.code === 'SNGPL') {
          expect(provider.refLength).toBe(11);
        } else if (provider.code === 'SSGC') {
          expect(provider.refLength).toBe(10);
        }
      });
    });
  });

  describe('ALL_PROVIDERS Combined List', () => {
    it('should contain all electricity and gas providers with unique codes', () => {
      expect(ALL_PROVIDERS.length).toBe(ELECTRICITY_PROVIDERS.length + GAS_PROVIDERS.length);
      const codes = ALL_PROVIDERS.map((p) => p.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(ALL_PROVIDERS.length);
    });
  });

  describe('Provider Logos Resolver', () => {
    it('should resolve provider logos for all companies without throwing', () => {
      ALL_PROVIDERS.forEach((provider) => {
        const logo = getProviderLogo(provider.code);
        expect(logo).toBeTruthy();
      });
    });

    it('hasLocalLogo returns true for standard providers and false for unknown', () => {
      expect(hasLocalLogo('LESCO')).toBe(true);
      expect(hasLocalLogo('MEPCO')).toBe(true);
      expect(hasLocalLogo('SNGPL')).toBe(true);
      expect(hasLocalLogo('UNKNOWN_COMPANY')).toBe(false);
    });

    it('should return null for non-existent company codes', () => {
      const fallbackLogo = getProviderLogo('NON_EXISTENT_XYZ');
      expect(fallbackLogo).toBeNull();
    });
  });
});

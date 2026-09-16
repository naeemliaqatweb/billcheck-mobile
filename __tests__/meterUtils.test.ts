import { getMeterDisplayName, getMeterShortName } from '../src/utils/meterUtils';

describe('Meter Utils Test Suite', () => {
  describe('getMeterDisplayName', () => {
    it('returns custom nickname with company when nickname is provided', () => {
      const name = getMeterDisplayName({
        nickname: 'Home Ground Floor',
        company: 'LESCO',
      });
      expect(name).toBe('Home Ground Floor (LESCO)');
    });

    it('returns Urdu nickname with company', () => {
      const name = getMeterDisplayName({
        nickname: 'گھر کا میٹر',
        company: 'MEPCO',
      });
      expect(name).toBe('گھر کا میٹر (MEPCO)');
    });

    it('falls back to official consumer name if nickname is missing or generic', () => {
      const name = getMeterDisplayName({
        nickname: '',
        company: 'IESCO',
        consumerName: 'Dr. Ahmad Khan, House 42, St 5',
      });
      expect(name).toBe('Dr. Ahmad Khan (IESCO)');
    });

    it('falls back to company meter name if both nickname and consumerName are generic', () => {
      const name = getMeterDisplayName({
        nickname: 'LESCO METER',
        company: 'LESCO',
        consumerName: 'REGISTERED CONSUMER',
      });
      expect(name).toBe('LESCO Meter');
    });
  });

  describe('getMeterShortName', () => {
    it('returns short name without company suffix for custom nickname', () => {
      const short = getMeterShortName({
        nickname: 'Office First Floor',
        company: 'GEPCO',
      });
      expect(short).toBe('Office First Floor');
    });

    it('extracts first line of consumer name when nickname is generic', () => {
      const short = getMeterShortName({
        company: 'FESCO',
        consumerName: 'Tariq Mehmood\nStreet 2, Faisalabad',
      });
      expect(short).toBe('Tariq Mehmood');
    });
  });
});

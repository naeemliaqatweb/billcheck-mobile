import { SavedMeter } from '../types/bill';

/**
 * Resolves the clean display name for a meter across chips, lists, and selectors:
 * 1. If user provided a custom nickname (e.g. "Home", "Office", "Shop", "گھر"),
 *    returns `${nickname} (${company})`.
 * 2. If no custom nickname (or nickname is default/empty/generic), but consumerName is available from bill (e.g. "Muhammad Ali"),
 *    returns `${consumerName} (${company})`.
 * 3. Fallback: `${company} Meter`.
 */
export function getMeterDisplayName(meter: {
  nickname?: string | null;
  company: string;
  consumerName?: string | null;
  referenceNumber?: string;
}): string {
  const comp = (meter.company || '').toUpperCase().trim();
  const rawNick = (meter.nickname || '').trim();
  const rawConsumer = (meter.consumerName || '').trim();

  // Strip company prefixes/suffixes if embedded like "LESCO (Ali)" or "MEPCO - Home"
  const cleanNick = rawNick
    .replace(new RegExp(`^${comp}\\s*[\\(-–:]*\\s*`, 'i'), '')
    .replace(/[\\)]+$/, '')
    .trim();

  const isGenericNick =
    !cleanNick ||
    cleanNick.toUpperCase() === comp ||
    cleanNick.toUpperCase() === `${comp} METER` ||
    cleanNick.toUpperCase() === 'METER' ||
    cleanNick.toUpperCase() === 'ELECTRICITY METER' ||
    cleanNick.toUpperCase() === 'GAS METER' ||
    cleanNick.toUpperCase() === 'HOME GAS';

  const isGenericConsumer =
    !rawConsumer ||
    rawConsumer.toUpperCase() === 'REGISTERED CONSUMER' ||
    rawConsumer.toUpperCase() === comp ||
    rawConsumer.toUpperCase() === `${comp} CONSUMER`;

  // 1. If user provided a specific custom nickname
  if (!isGenericNick && cleanNick) {
    return `${cleanNick} (${comp})`;
  }

  // 2. If official consumer name is known from bill
  if (!isGenericConsumer && rawConsumer) {
    const cleanName = rawConsumer.split(/[\n,]/)[0].trim();
    return `${cleanName} (${comp})`;
  }

  // 3. Fallback
  return `${comp} Meter`;
}

/**
 * Returns just the short title/name without company suffix
 * (Useful for cards that already display the company badge separately)
 */
export function getMeterShortName(meter: {
  nickname?: string | null;
  company: string;
  consumerName?: string | null;
}): string {
  const comp = (meter.company || '').toUpperCase().trim();
  const rawNick = (meter.nickname || '').trim();
  const rawConsumer = (meter.consumerName || '').trim();

  const cleanNick = rawNick
    .replace(new RegExp(`^${comp}\\s*[\\(-–:]*\\s*`, 'i'), '')
    .replace(/[\\)]+$/, '')
    .trim();

  const isGenericNick =
    !cleanNick ||
    cleanNick.toUpperCase() === comp ||
    cleanNick.toUpperCase() === `${comp} METER` ||
    cleanNick.toUpperCase() === 'METER' ||
    cleanNick.toUpperCase() === 'ELECTRICITY METER' ||
    cleanNick.toUpperCase() === 'GAS METER';

  const isGenericConsumer =
    !rawConsumer ||
    rawConsumer.toUpperCase() === 'REGISTERED CONSUMER' ||
    rawConsumer.toUpperCase() === comp ||
    rawConsumer.toUpperCase() === `${comp} CONSUMER`;

  if (!isGenericNick && cleanNick) {
    return cleanNick;
  }

  if (!isGenericConsumer && rawConsumer) {
    return rawConsumer.split(/[\n,]/)[0].trim();
  }

  return isGenericNick ? (rawNick || `${comp} Meter`) : `${comp} Meter`;
}

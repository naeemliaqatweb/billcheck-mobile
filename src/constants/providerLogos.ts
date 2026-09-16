import { ImageSourcePropType } from 'react-native';

export const PROVIDER_LOGOS: Record<string, ImageSourcePropType> = {
  LESCO: require('../assets/images/logos/lesco.png'),
  GEPCO: require('../assets/images/logos/gepco.png'),
  FESCO: require('../assets/images/logos/fesco.png'),
  IESCO: require('../assets/images/logos/iesco.png'),
  MEPCO: require('../assets/images/logos/mepco.png'),
  PESCO: require('../assets/images/logos/pesco.png'),
  HAZECO: require('../assets/images/logos/hazeco.png'),
  HESCO: require('../assets/images/logos/hesco.png'),
  SEPCO: require('../assets/images/logos/sepco.png'),
  QESCO: require('../assets/images/logos/qesco.png'),
  TESCO: require('../assets/images/logos/tesco.png'),
  PITC: require('../assets/images/logos/pitc.png'),
  KELECTRIC: require('../assets/images/logos/kelectric.png'),
  KE: require('../assets/images/logos/ke.png'),
  SNGPL: require('../assets/images/logos/sngpl.png'),
  SSGC: require('../assets/images/logos/ssgc.png'),
};

export const getProviderLogo = (code?: string): ImageSourcePropType | null => {
  if (!code) return null;
  const key = code.trim().toUpperCase();
  return PROVIDER_LOGOS[key] || null;
};

export const hasLocalLogo = (code?: string): boolean => {
  if (!code) return false;
  return !!PROVIDER_LOGOS[code.trim().toUpperCase()];
};


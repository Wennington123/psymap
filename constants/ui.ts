import { Platform, TextStyle, ViewStyle } from 'react-native';
import { ThemeColors } from './colors';

export const radii = {
  card: 20,
  input: 16,
  btn: 30,
  chip: 999,
};

export const fonts = {
  regular: 'Nunito_400Regular',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
};

export type FontWeight = keyof typeof fonts;

/** Fonte de display por tema: pixel usa Pixelify, demais usam Nunito. */
export function displayFont(colors: ThemeColors, weight: FontWeight = 'bold'): string {
  if (colors.style === 'pixel') {
    return weight === 'regular' || weight === 'semibold' ? 'PixelifySans_400Regular' : 'PixelifySans_700Bold';
  }
  return fonts[weight];
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export function shadow(): { elevation: number } | {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: { width: number; height: number };
} {
  if (Platform.OS === 'android') {
    return { elevation: 3 };
  }
  return {
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  };
}

export function card(colors: ThemeColors): ViewStyle {
  if (colors.style === 'pixel') {
    return {
      backgroundColor: colors.surface,
      borderRadius: colors.radius ?? 6,
      borderWidth: 2,
      borderColor: colors.border,
    };
  }
  return {
    backgroundColor: colors.surface,
    borderRadius: colors.radius ?? radii.card,
    borderWidth: 1,
    borderColor: colors.border + '33',
    ...shadow(),
  };
}

export const sectionTitle: TextStyle = {
  fontSize: 14,
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: 1.2,
};

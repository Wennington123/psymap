import { Platform, TextStyle, ViewStyle } from 'react-native';
import { ThemeColors } from './colors';

export const radii = {
  card: 16,
  input: 14,
  btn: 28,
  chip: 999,
};

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
  return {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    ...shadow(),
  };
}

export const sectionTitle: TextStyle = {
  fontSize: 14,
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: 1.2,
};

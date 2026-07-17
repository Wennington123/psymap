export const ChartPalette = {
  dark: ['#e94560', '#f77f00', '#fcbf49', '#06d6a0', '#118ab2', '#9b5de5', '#f15bb5', '#073b4c'] as const,
  light: ['#4a6fa5', '#e07050', '#d4a843', '#3a9a7c', '#5b8cb8', '#8b5ea8', '#c75b8a', '#3a5a7c'] as const,
  dracula: ['#ff79c6', '#ffb86c', '#f1fa8c', '#50fa7b', '#8be9fd', '#bd93f9', '#ff5555', '#6272a4'] as const,
  sunset: ['#ff6b6b', '#ff9e64', '#ffd56b', '#f7a072', '#c85671', '#ff8fab', '#ffb347', '#e07a5f'] as const,
  ocean: ['#48cae4', '#00b4d8', '#90e0ef', '#0096c7', '#48cae4', '#00b4d8', '#ade8f4', '#023e8a'] as const,
  forest: ['#95d5b2', '#74c69d', '#52b788', '#40916c', '#2d6a4f', '#b7e4c7', '#d8f3dc', '#1b4332'] as const,
  kittens: ['#ff6b6b', '#ff9e64', '#ffd56b', '#f7a072', '#c85671', '#ff8fab', '#ffb347', '#e07a5f'] as const,
};

export type EmojiSource = string | number; // string = Unicode emoji, number = require() image

export interface EmojiPack {
  joy: EmojiSource;
  trust: EmojiSource;
  fear: EmojiSource;
  surprise: EmojiSource;
  sadness: EmojiSource;
  disgust: EmojiSource;
  anger: EmojiSource;
  anticipation: EmojiSource;
}

export const EmojiPacks: Record<string, EmojiPack> = {
  default: {
    joy: '😊',
    trust: '🤝',
    fear: '😨',
    surprise: '😲',
    sadness: '😢',
    disgust: '🤢',
    anger: '😠',
    anticipation: '🤔',
  },
  sunset: {
    joy: '🌅',
    trust: '🤝',
    fear: '😨',
    surprise: '😲',
    sadness: '😢',
    disgust: '🤢',
    anger: '😠',
    anticipation: '🤔',
  },
  ocean: {
    joy: '😊',
    trust: '🤝',
    fear: '😨',
    surprise: '😲',
    sadness: '😢',
    disgust: '🤢',
    anger: '😠',
    anticipation: '🤔',
  },
  forest: {
    joy: '🐸',
    trust: '🦊',
    fear: '🐇',
    surprise: '🦉',
    sadness: '🐢',
    disgust: '🐍',
    anger: '🐗',
    anticipation: '🦝',
  },
  kittens: {
    joy: '😺',
    trust: '😸',
    fear: '🙀',
    surprise: '😹',
    sadness: '😿',
    disgust: '😾',
    anger: '😼',
    anticipation: '😽',
  },
};

export interface ThemeDefinition {
  name: 'dark' | 'light' | 'dracula' | 'sunset' | 'ocean' | 'forest' | 'kittens';
  background: string;
  surface: string;
  surfaceAlt: string;
  surfaceAltText: string;
  border: string;
  borderMuted: string;
  borderAlt: string;
  text: string;
  textSecondary: string;
  textDim: string;
  textOnAccent: string;
  accent: string;
  overlay: string;
  chartAxis: string;
  chartPalette: readonly string[];
  statusBar: 'light-content' | 'dark-content';
  emojiPack: EmojiPack;
  premium: boolean;
  priceBRL?: number;
  sku?: string;
  donationCode?: string;
}

export const Themes: Record<string, ThemeDefinition> = {
  dark: {
    name: 'dark',
    background: '#1a1a2e',
    surface: '#16213e',
    surfaceAlt: '#f5f5f9',
    surfaceAltText: '#1a1a2e',
    border: '#0f3460',
    borderMuted: '#444',
    borderAlt: '#e0e0e8',
    text: '#e0e0e0',
    textSecondary: '#888',
    textDim: '#666',
    textOnAccent: '#fff',
    accent: '#e94560',
    overlay: 'rgba(0,0,0,0.66)',
    chartAxis: '#2a2a4e',
    chartPalette: ChartPalette.dark,
    statusBar: 'light-content',
    emojiPack: EmojiPacks.default,
    premium: false,
  },
  light: {
    name: 'light',
    background: '#f0f2f5',
    surface: '#ffffff',
    surfaceAlt: '#1a1a2e',
    surfaceAltText: '#e0e0e0',
    border: '#d0d5dd',
    borderMuted: '#c0c5cc',
    borderAlt: '#e0e0e8',
    text: '#1a1a2e',
    textSecondary: '#5a6070',
    textDim: '#8b909a',
    textOnAccent: '#ffffff',
    accent: '#4a6fa5',
    overlay: 'rgba(0,0,0,0.4)',
    chartAxis: '#c8cdd4',
    chartPalette: ChartPalette.light,
    statusBar: 'dark-content',
    emojiPack: EmojiPacks.default,
    premium: false,
  },
  dracula: {
    name: 'dracula',
    background: '#282a36',
    surface: '#44475a',
    surfaceAlt: '#f8f8f2',
    surfaceAltText: '#282a36',
    border: '#6272a4',
    borderMuted: '#44475a',
    borderAlt: '#6272a480',
    text: '#f8f8f2',
    textSecondary: '#6272a4',
    textDim: '#bd93f9',
    textOnAccent: '#282a36',
    accent: '#ff79c6',
    overlay: 'rgba(0,0,0,0.66)',
    chartAxis: '#6272a460',
    chartPalette: ChartPalette.dracula,
    statusBar: 'light-content',
    emojiPack: EmojiPacks.default,
    premium: false,
  },
  sunset: {
    name: 'sunset',
    background: '#2b1b3d',
    surface: '#3d2459',
    surfaceAlt: '#ffd56b',
    surfaceAltText: '#2b1b3d',
    border: '#6d4a8f',
    borderMuted: '#4a2f63',
    borderAlt: '#ffb34780',
    text: '#fdeef5',
    textSecondary: '#e0a3c4',
    textDim: '#b07a9c',
    textOnAccent: '#2b1b3d',
    accent: '#ff8fab',
    overlay: 'rgba(20,10,30,0.7)',
    chartAxis: '#6d4a8f60',
    chartPalette: ChartPalette.sunset,
    statusBar: 'light-content',
    emojiPack: EmojiPacks.sunset,
    premium: true,
    priceBRL: 4.9,
    sku: 'theme_sunset',
    donationCode: 'SUNSET-PSYMAP',
  },
  ocean: {
    name: 'ocean',
    background: '#03045e',
    surface: '#023e8a',
    surfaceAlt: '#ade8f4',
    surfaceAltText: '#03045e',
    border: '#0077b6',
    borderMuted: '#01548a',
    borderAlt: '#90e0ef80',
    text: '#caf0f8',
    textSecondary: '#90e0ef',
    textDim: '#48cae4',
    textOnAccent: '#03045e',
    accent: '#00b4d8',
    overlay: 'rgba(2,20,50,0.7)',
    chartAxis: '#0077b660',
    chartPalette: ChartPalette.ocean,
    statusBar: 'light-content',
    emojiPack: EmojiPacks.ocean,
    premium: true,
    priceBRL: 3.9,
    sku: 'theme_ocean',
    donationCode: 'OCEAN-PSYMAP',
  },
  forest: {
    name: 'forest',
    background: '#081c15',
    surface: '#1b4332',
    surfaceAlt: '#d8f3dc',
    surfaceAltText: '#081c15',
    border: '#2d6a4f',
    borderMuted: '#1b4332',
    borderAlt: '#95d5b280',
    text: '#d8f3dc',
    textSecondary: '#95d5b2',
    textDim: '#74c69d',
    textOnAccent: '#081c15',
    accent: '#52b788',
    overlay: 'rgba(5,20,12,0.7)',
    chartAxis: '#2d6a4f60',
    chartPalette: ChartPalette.forest,
    statusBar: 'light-content',
    emojiPack: EmojiPacks.forest,
    premium: true,
    priceBRL: 4.9,
    sku: 'theme_forest',
    donationCode: 'FOREST-PSYMAP',
  },
  kittens: {
    name: 'kittens',
    background: '#2d1b3d',
    surface: '#3d2459',
    surfaceAlt: '#ffd56b',
    surfaceAltText: '#2d1b3d',
    border: '#6d4a8f',
    borderMuted: '#4a2f63',
    borderAlt: '#ffb34780',
    text: '#fdeef5',
    textSecondary: '#e0a3c4',
    textDim: '#b07a9c',
    textOnAccent: '#2d1b3d',
    accent: '#ff8fab',
    overlay: 'rgba(20,10,30,0.7)',
    chartAxis: '#6d4a8f60',
    chartPalette: ['#ff6b6b', '#ff9e64', '#ffd56b', '#f7a072', '#c85671', '#ff8fab', '#ffb347', '#e07a5f'],
    statusBar: 'light-content',
    emojiPack: EmojiPacks.kittens,
    premium: true,
    priceBRL: 4.9,
    sku: 'theme_kittens',
    donationCode: 'KITTENS-PSYMAP',
  },
};

export type ThemeColors = typeof Themes.dark;
export type ThemeName = keyof typeof Themes;

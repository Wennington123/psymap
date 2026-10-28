export const ChartPalette = {
  light: ['#4a6fa5', '#e07050', '#d4a843', '#3a9a7c', '#5b8cb8', '#8b5ea8', '#c75b8a', '#3a5a7c'] as const,
  dark: ['#e94560', '#f77f00', '#fcbf49', '#06d6a0', '#118ab2', '#9b5de5', '#f15bb5', '#073b4c'] as const,
  dracula: ['#ff79c6', '#ffb86c', '#f1fa8c', '#50fa7b', '#8be9fd', '#bd93f9', '#ff5555', '#6272a4'] as const,
  nord: ['#bf616a', '#d08770', '#ebcb8b', '#a3be8c', '#88c0d0', '#b48ead', '#5e81ac', '#81a1c1'] as const,
  gruvbox: ['#fb4934', '#fe8019', '#fabd2f', '#b8bb26', '#8ec07c', '#83a598', '#d3869b', '#d5c4a1'] as const,
  catppuccin: ['#f38ba8', '#fab387', '#f9e2af', '#a6e3a1', '#94e2d5', '#89b4fa', '#cba6f7', '#f5c2e7'] as const,
  pixel: ['#e4572e', '#f3a712', '#a8c256', '#2e86ab', '#7b4b94', '#d1495b', '#4f772d', '#5c4b51'] as const,
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
    joy: require('../assets/emoji/joy.png'),
    trust: require('../assets/emoji/trust.png'),
    fear: require('../assets/emoji/fear.png'),
    surprise: require('../assets/emoji/surprise.png'),
    sadness: require('../assets/emoji/sadness.png'),
    disgust: require('../assets/emoji/disgust.png'),
    anger: require('../assets/emoji/anger.png'),
    anticipation: require('../assets/emoji/anticipation.png'),
  },
  flat: {
    joy: require('../assets/emoji-flat/joy.png'),
    trust: require('../assets/emoji-flat/trust.png'),
    fear: require('../assets/emoji-flat/fear.png'),
    surprise: require('../assets/emoji-flat/surprise.png'),
    sadness: require('../assets/emoji-flat/sadness.png'),
    disgust: require('../assets/emoji-flat/disgust.png'),
    anger: require('../assets/emoji-flat/anger.png'),
    anticipation: require('../assets/emoji-flat/anticipation.png'),
  },
};

export type ThemeStyle = 'modern' | 'pixel';

export interface ThemeDefinition {
  name: 'light' | 'dark' | 'dracula' | 'nord' | 'gruvbox' | 'catppuccin' | 'pixel';
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
  style?: ThemeStyle;
  radius?: number;
  /** Badge do sistema de gamificação que desbloqueia o tema (undefined = sempre disponível) */
  requiredBadge?: string;
}

export const Themes: Record<string, ThemeDefinition> = {
  light: {
    name: 'light',
    background: '#f4f6fb',
    surface: '#ffffff',
    surfaceAlt: '#1b1f2a',
    surfaceAltText: '#f4f6fb',
    border: '#dfe3ec',
    borderMuted: '#c8cdd8',
    borderAlt: '#e8ebf1',
    text: '#1b1f2a',
    textSecondary: '#5b6474',
    textDim: '#8b93a3',
    textOnAccent: '#ffffff',
    accent: '#3f6fe0',
    overlay: 'rgba(20,24,40,0.45)',
    chartAxis: '#d5dae4',
    chartPalette: ChartPalette.light,
    statusBar: 'dark-content',
    emojiPack: EmojiPacks.default,
  },
  dark: {
    name: 'dark',
    background: '#121826',
    surface: '#1d2740',
    surfaceAlt: '#f5f5f9',
    surfaceAltText: '#1a1a2e',
    border: '#2c3b5e',
    borderMuted: '#4a5670',
    borderAlt: '#e0e0e8',
    text: '#e8ecf5',
    textSecondary: '#a3adc2',
    textDim: '#7c8699',
    textOnAccent: '#fff',
    accent: '#e94560',
    overlay: 'rgba(0,0,0,0.66)',
    chartAxis: '#2a3a5e',
    chartPalette: ChartPalette.dark,
    statusBar: 'light-content',
    emojiPack: EmojiPacks.default,
  },
  dracula: {
    name: 'dracula',
    background: '#21222c',
    surface: '#343746',
    surfaceAlt: '#f8f8f2',
    surfaceAltText: '#282a36',
    border: '#6272a4',
    borderMuted: '#4b4f63',
    borderAlt: '#6272a480',
    text: '#f8f8f2',
    textSecondary: '#b3bcd9',
    textDim: '#8b94b3',
    textOnAccent: '#282a36',
    accent: '#ff79c6',
    overlay: 'rgba(0,0,0,0.66)',
    chartAxis: '#6272a460',
    chartPalette: ChartPalette.dracula,
    statusBar: 'light-content',
    emojiPack: EmojiPacks.default,
  },
  nord: {
    name: 'nord',
    background: '#2e3440',
    surface: '#3b4252',
    surfaceAlt: '#eceff4',
    surfaceAltText: '#2e3440',
    border: '#4c566a',
    borderMuted: '#434c5e',
    borderAlt: '#4c566a80',
    text: '#eceff4',
    textSecondary: '#d8dee9',
    textDim: '#81a1c1',
    textOnAccent: '#2e3440',
    accent: '#88c0d0',
    overlay: 'rgba(20,25,35,0.7)',
    chartAxis: '#4c566a60',
    chartPalette: ChartPalette.nord,
    statusBar: 'light-content',
    emojiPack: EmojiPacks.default,
    requiredBadge: 'streak-7',
  },
  gruvbox: {
    name: 'gruvbox',
    background: '#282828',
    surface: '#3c3836',
    surfaceAlt: '#ebdbb2',
    surfaceAltText: '#282828',
    border: '#504945',
    borderMuted: '#3c3836',
    borderAlt: '#665c5480',
    text: '#ebdbb2',
    textSecondary: '#d5c4a1',
    textDim: '#a89984',
    textOnAccent: '#282828',
    accent: '#fabd2f',
    overlay: 'rgba(20,20,20,0.7)',
    chartAxis: '#50494560',
    chartPalette: ChartPalette.gruvbox,
    statusBar: 'light-content',
    emojiPack: EmojiPacks.default,
    requiredBadge: 'entries-50',
  },
  catppuccin: {
    name: 'catppuccin',
    background: '#1e1e2e',
    surface: '#313244',
    surfaceAlt: '#cdd6f4',
    surfaceAltText: '#1e1e2e',
    border: '#45475a',
    borderMuted: '#585b70',
    borderAlt: '#585b7080',
    text: '#cdd6f4',
    textSecondary: '#bac2de',
    textDim: '#9399b2',
    textOnAccent: '#1e1e2e',
    accent: '#cba6f7',
    overlay: 'rgba(17,17,27,0.7)',
    chartAxis: '#45475a60',
    chartPalette: ChartPalette.catppuccin,
    statusBar: 'light-content',
    emojiPack: EmojiPacks.default,
    requiredBadge: 'level-5',
  },
  pixel: {
    name: 'pixel',
    background: '#f2e8d5',
    surface: '#fff7e6',
    surfaceAlt: '#2b2a26',
    surfaceAltText: '#f2e8d5',
    border: '#2b2a26',
    borderMuted: '#c9bda3',
    borderAlt: '#2b2a2633',
    text: '#2b2a26',
    textSecondary: '#57534a',
    textDim: '#7a7466',
    textOnAccent: '#fff7e6',
    accent: '#e4572e',
    overlay: 'rgba(43,42,38,0.55)',
    chartAxis: '#2b2a2633',
    chartPalette: ChartPalette.pixel,
    statusBar: 'dark-content',
    emojiPack: EmojiPacks.flat,
    style: 'pixel',
    radius: 6,
    requiredBadge: 'streak-30',
  },
};

export type ThemeColors = typeof Themes.light;
export type ThemeName = keyof typeof Themes;

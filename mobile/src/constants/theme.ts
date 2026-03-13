// On My Deen — Design Tokens
// Deep teals + warm golds inspired by Islamic geometric art

export const colors = {
  // Backgrounds
  bgPrimary: '#0f1a1f',
  bgSecondary: '#162028',
  bgCard: '#1d2d35',
  bgInput: '#1a2830',

  // Borders
  border: '#2a3f4a',
  borderFocus: '#2a9d8f',

  // Text
  textPrimary: '#e8dcc8',
  textSecondary: '#9aada8',
  textMuted: '#5a7070',

  // Brand
  accentTeal: '#2a9d8f',
  accentTealLight: '#3ebfb0',
  accentGold: '#c9a84c',
  accentGoldLight: '#e6c06a',

  // Message bubbles
  userBubble: '#1e3a45',
  userBubbleBorder: '#2a4a5a',
  noorBubble: '#1d2d35',

  // Source badges
  sourceQuran: '#2a7a5c',
  sourceQuranText: '#a8ffda',
  sourceHadith: '#2a5a7a',
  sourceHadithText: '#a8d8ff',
  sourceConsensus: '#5a3a7a',
  sourceConsensusText: '#d8a8ff',
  sourceOpinion: '#7a5a2a',
  sourceOpinionText: '#ffd8a8',

  white: '#ffffff',
  black: '#000000',
  error: '#ff6b6b',
};

export const typography = {
  fontSizeXs: 11,
  fontSizeSm: 13,
  fontSizeMd: 15,
  fontSizeLg: 17,
  fontSizeXl: 20,
  fontSizeXxl: 28,

  fontWeightLight: '300' as const,
  fontWeightRegular: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemibold: '600' as const,
  fontWeightBold: '700' as const,

  lineHeightTight: 1.3,
  lineHeightNormal: 1.6,
  lineHeightRelaxed: 1.8,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 999,
};

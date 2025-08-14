/**
 * FarmTrack Premium Design System
 * Multimillion-dollar app quality design system
 */

// Premium Color Palette
const emerald = {
  50: '#ECFDF5',
  100: '#D1FAE5',
  200: '#A7F3D0',
  300: '#6EE7B7',
  400: '#34D399',
  500: '#10B981', // Primary
  600: '#059669',
  700: '#047857',
  800: '#065F46',
  900: '#064E3B',
};

const slate = {
  50: '#F8FAFC',
  100: '#F1F5F9',
  200: '#E2E8F0',
  300: '#CBD5E1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
};

const amber = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#F59E0B', // Accent
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
};

export const Colors = {
  light: {
    // Primary Brand Colors
    primary: emerald[500],
    primaryLight: emerald[400],
    primaryDark: emerald[600],
    primarySurface: emerald[50],
    
    // Accent Colors
    accent: amber[500],
    accentLight: amber[400],
    accentDark: amber[600],
    accentSurface: amber[50],
    
    // Secondary Colors
    secondary: '#6366F1',
    secondaryLight: '#818CF8',
    secondaryDark: '#4F46E5',
    secondarySurface: '#EEF2FF',
    
    // Text Hierarchy
    text: slate[900],
    textSecondary: slate[600],
    textMuted: slate[500],
    textDisabled: slate[400],
    textInverse: '#FFFFFF',
    
    // Background System
    background: '#FFFFFF',
    backgroundSecondary: slate[50],
    backgroundMuted: slate[100],
    backgroundElevated: '#FFFFFF',
    
    // Surface Colors
    surface: '#FFFFFF',
    surfaceSecondary: slate[50],
    surfaceMuted: slate[100],
    
    // Border System
    border: slate[200],
    borderLight: slate[100],
    borderFocus: emerald[500],
    borderError: '#EF4444',
    
    // Interactive States
    interactive: emerald[500],
    interactiveHover: emerald[600],
    interactivePressed: emerald[700],
    interactiveDisabled: slate[300],
    
    // Status Colors
    success: '#10B981',
    successLight: '#34D399',
    successSurface: '#ECFDF5',
    
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    warningSurface: '#FFFBEB',
    
    error: '#EF4444',
    errorLight: '#F87171',
    errorSurface: '#FEF2F2',
    
    info: '#3B82F6',
    infoLight: '#60A5FA',
    infoSurface: '#EFF6FF',
    
    // Card & Shadow
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',
    shadow: 'rgba(15, 23, 42, 0.08)',
    shadowStrong: 'rgba(15, 23, 42, 0.15)',
    
    // Tab Navigation
    tint: emerald[500],
    tabBackground: '#FFFFFF',
    tabBorder: slate[200],
    tabIconDefault: slate[400],
    tabIconSelected: emerald[500],
    tabTextDefault: slate[600],
    tabTextSelected: emerald[600],
  },
  dark: {
    // Primary Brand Colors
    primary: emerald[400],
    primaryLight: emerald[300],
    primaryDark: emerald[500],
    primarySurface: emerald[900],
    
    // Accent Colors
    accent: amber[400],
    accentLight: amber[300],
    accentDark: amber[500],
    accentSurface: amber[900],
    
    // Secondary Colors
    secondary: '#818CF8',
    secondaryLight: '#A5B4FC',
    secondaryDark: '#6366F1',
    secondarySurface: '#1E1B4B',
    
    // Text Hierarchy
    text: slate[50],
    textSecondary: slate[300],
    textMuted: slate[400],
    textDisabled: slate[500],
    textInverse: slate[900],
    
    // Background System
    background: slate[900],
    backgroundSecondary: slate[800],
    backgroundMuted: slate[700],
    backgroundElevated: slate[800],
    
    // Surface Colors
    surface: slate[800],
    surfaceSecondary: slate[700],
    surfaceMuted: slate[600],
    
    // Border System
    border: slate[600],
    borderLight: slate[700],
    borderFocus: emerald[400],
    borderError: '#F87171',
    
    // Interactive States
    interactive: emerald[400],
    interactiveHover: emerald[300],
    interactivePressed: emerald[500],
    interactiveDisabled: slate[600],
    
    // Status Colors
    success: '#34D399',
    successLight: '#6EE7B7',
    successSurface: '#064E3B',
    
    warning: '#FBBF24',
    warningLight: '#FCD34D',
    warningSurface: '#78350F',
    
    error: '#F87171',
    errorLight: '#FCA5A5',
    errorSurface: '#7F1D1D',
    
    info: '#60A5FA',
    infoLight: '#93C5FD',
    infoSurface: '#1E3A8A',
    
    // Card & Shadow
    card: slate[800],
    cardElevated: slate[700],
    shadow: 'rgba(0, 0, 0, 0.25)',
    shadowStrong: 'rgba(0, 0, 0, 0.4)',
    
    // Tab Navigation
    tint: emerald[400],
    tabBackground: slate[900],
    tabBorder: slate[700],
    tabIconDefault: slate[400],
    tabIconSelected: emerald[400],
    tabTextDefault: slate[400],
    tabTextSelected: emerald[400],
  },
};

// Premium Typography System
export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
    '7xl': 72,
  },
  weights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  families: {
    primary: 'SF Pro Display',
    secondary: 'SF Pro Text',
    mono: 'SF Mono',
  },
  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
};

// Premium Spacing System
export const Spacing = {
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  // Legacy support
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
};

// Touch targets - minimum 44px for accessibility and glove use
export const TouchTargets = {
  minimum: 44,
  comfortable: 56,
  large: 72,
};

// Premium Border Radius System
export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
  full: 9999,
};

// Premium Shadow System
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 16,
  },
};

// Premium Gradient System
export const Gradients = {
  primary: [emerald[400], emerald[600]],
  primaryLight: [emerald[300], emerald[500]],
  accent: [amber[400], amber[600]],
  accentLight: [amber[300], amber[500]],
  hero: [emerald[500], '#3B82F6', '#8B5CF6'],
  heroLight: [emerald[400], '#60A5FA', '#A78BFA'],
  success: ['#34D399', '#10B981'],
  warning: ['#FBBF24', '#F59E0B'],
  error: ['#F87171', '#EF4444'],
  info: ['#60A5FA', '#3B82F6'],
  surface: ['#FFFFFF', slate[50]],
  surfaceDark: [slate[800], slate[900]],
  glass: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
};

// Weather & Context Colors
export const WeatherColors = {
  sunny: amber[300],
  cloudy: slate[400],
  rainy: '#3B82F6',
  stormy: '#6366F1',
  partlyCloudy: amber[500],
  hot: '#EF4444',
  cold: '#06B6D4',
};

// Animation Durations
export const AnimationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 750,
};

// Breakpoints for responsive design
export const Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// Z-Index Scale
export const ZIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

export default Colors;

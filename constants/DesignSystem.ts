/**
 * FarmTrack Premium Design System
 * Multimillion-dollar app quality design specifications
 */

import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Premium Color System
export const DesignTokens = {
  colors: {
    // Primary Brand
    primary: {
      50: '#F0FDF4',
      100: '#DCFCE7', 
      500: '#22C55E',
      600: '#16A34A',
      900: '#14532D',
    },
    // Neutral Grays
    neutral: {
      0: '#FFFFFF',
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    // Semantic Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // Typography Scale
  typography: {
    fontFamily: {
      primary: 'SF Pro Display',
      secondary: 'SF Pro Text',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // Spacing System (8pt grid)
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
  },
  
  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 8,
    },
  },
  
  // Layout
  layout: {
    screenWidth,
    screenHeight,
    containerPadding: 20,
    cardPadding: 20,
    sectionSpacing: 32,
  },
};

// Component Specifications
export const ComponentSpecs = {
  button: {
    height: {
      sm: 36,
      md: 44,
      lg: 52,
    },
    borderRadius: DesignTokens.borderRadius.xl,
    paddingHorizontal: {
      sm: 16,
      md: 24,
      lg: 32,
    },
  },
  
  input: {
    height: 52,
    borderRadius: DesignTokens.borderRadius.xl,
    paddingHorizontal: 16,
  },
  
  card: {
    borderRadius: DesignTokens.borderRadius['2xl'],
    padding: DesignTokens.spacing[6],
    shadow: DesignTokens.shadows.md,
  },
};

export default DesignTokens;
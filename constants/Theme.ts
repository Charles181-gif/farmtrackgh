/**
 * FarmTrack Design System
 * Comprehensive theme configuration for consistent UI/UX
 */

export const Theme = {
  // Animation durations
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Shadow presets
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
  
  // Layout constants
  layout: {
    headerHeight: 60,
    tabBarHeight: 80,
    fabSize: 56,
    avatarSizes: {
      sm: 32,
      md: 48,
      lg: 64,
      xl: 96,
    },
  },
  
  // Touch targets (accessibility)
  touchTarget: {
    minHeight: 44,
    minWidth: 44,
  },
};

// Haptic feedback patterns
export const HapticPatterns = {
  light: 'light',
  medium: 'medium',
  heavy: 'heavy',
  success: 'notificationSuccess',
  warning: 'notificationWarning',
  error: 'notificationError',
} as const;
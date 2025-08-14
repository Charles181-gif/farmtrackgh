import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../../constants/Colors';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  style?: ViewStyle;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function Card({ children, variant = 'default', style, className, padding = 'lg' }: CardProps) {
  const getCardStyle = () => {
    const baseStyle = [styles.card, styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`]];
    
    if (variant === 'elevated') {
      baseStyle.push(styles.elevated);
    } else if (variant === 'outlined') {
      baseStyle.push(styles.outlined);
    } else if (variant === 'glass') {
      baseStyle.push(styles.glass);
    } else {
      baseStyle.push(styles.default);
    }
    
    return baseStyle;
  };

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.xl,
  },
  default: {
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  elevated: {
    ...Shadows.lg,
    backgroundColor: Colors.light.cardElevated,
  },
  outlined: {
    borderWidth: 2,
    borderColor: Colors.light.border,
    backgroundColor: 'transparent',
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Shadows.sm,
  },
  // Padding variants
  paddingNone: {
    padding: 0,
  },
  paddingSm: {
    padding: Spacing[3],
  },
  paddingMd: {
    padding: Spacing[4],
  },
  paddingLg: {
    padding: Spacing[6],
  },
  paddingXl: {
    padding: Spacing[8],
  },
});
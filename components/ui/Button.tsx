import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DesignTokens, ComponentSpecs } from '../../constants/DesignSystem';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  icon,
  fullWidth = false,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    if (variant === 'primary') {
      baseStyle.push(styles.primary);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondary, styles[size]);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outline, styles[size]);
    } else if (variant === 'ghost') {
      baseStyle.push(styles.ghost, styles[size]);
    }
    
    if (disabled && variant !== 'primary') {
      baseStyle.push(styles.disabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    if (variant === 'primary') {
      baseStyle.push(styles.primaryText);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryText);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outlineText);
    } else if (variant === 'ghost') {
      baseStyle.push(styles.ghostText);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabledText);
    }
    
    return baseStyle;
  };

  const renderContent = () => (
    <View style={styles.contentContainer}>
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' || variant === 'secondary' ? DesignTokens.colors.neutral[0] : DesignTokens.colors.primary[500]} 
          size="small"
        />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </View>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        style={[getButtonStyle(), style, fullWidth && styles.fullWidth]}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={disabled ? [DesignTokens.colors.neutral[300], DesignTokens.colors.neutral[300]] : [DesignTokens.colors.primary[500], DesignTokens.colors.primary[600]]}
          style={[styles.gradientContainer, styles[size]]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style, fullWidth && styles.fullWidth]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: ComponentSpecs.button.borderRadius,
    overflow: 'hidden',
  },
  
  fullWidth: {
    width: '100%',
  },
  
  gradientContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ComponentSpecs.button.borderRadius,
  },
  
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  iconContainer: {
    marginRight: DesignTokens.spacing[2],
  },
  
  // Sizes
  small: {
    height: ComponentSpecs.button.height.sm,
    paddingHorizontal: ComponentSpecs.button.paddingHorizontal.sm,
  },
  medium: {
    height: ComponentSpecs.button.height.md,
    paddingHorizontal: ComponentSpecs.button.paddingHorizontal.md,
  },
  large: {
    height: ComponentSpecs.button.height.lg,
    paddingHorizontal: ComponentSpecs.button.paddingHorizontal.lg,
  },
  
  // Variants
  primary: {
    ...DesignTokens.shadows.md,
  },
  secondary: {
    backgroundColor: DesignTokens.colors.neutral[800],
    ...DesignTokens.shadows.sm,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: DesignTokens.colors.primary[500],
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: DesignTokens.colors.neutral[200],
    borderColor: DesignTokens.colors.neutral[300],
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Text styles
  text: {
    fontFamily: DesignTokens.typography.fontFamily.primary,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  smallText: {
    fontSize: DesignTokens.typography.fontSize.sm,
  },
  mediumText: {
    fontSize: DesignTokens.typography.fontSize.base,
  },
  largeText: {
    fontSize: DesignTokens.typography.fontSize.lg,
  },
  
  // Text colors
  primaryText: {
    color: DesignTokens.colors.neutral[0],
  },
  secondaryText: {
    color: DesignTokens.colors.neutral[0],
  },
  outlineText: {
    color: DesignTokens.colors.primary[500],
  },
  ghostText: {
    color: DesignTokens.colors.primary[500],
  },
  disabledText: {
    color: DesignTokens.colors.neutral[500],
  },
});
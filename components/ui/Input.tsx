import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { DesignTokens, ComponentSpecs } from '../../constants/DesignSystem';
import { IconSymbol } from './IconSymbol';

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e?: any) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  icon?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  className?: string;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  showPasswordToggle = false,
  icon,
  error,
  multiline = false,
  numberOfLines = 1,
  className,
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError,
      ]}>
        {icon && (
          <View style={styles.iconContainer}>
            <IconSymbol 
              name={icon} 
              size={20} 
              color={isFocused ? DesignTokens.colors.primary[500] : DesignTokens.colors.neutral[400]} 
            />
          </View>
        )}
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon, multiline && styles.multilineInput]}
          placeholder={placeholder}
          placeholderTextColor={DesignTokens.colors.neutral[400]}
          value={value}
          onChangeText={onChangeText}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.passwordToggle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol
              name={isPasswordVisible ? 'eye.slash' : 'eye'}
              size={20}
              color={isFocused ? DesignTokens.colors.primary[500] : DesignTokens.colors.neutral[400]}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Animated.View entering={FadeInDown}>
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: DesignTokens.spacing[5],
  },
  label: {
    fontSize: DesignTokens.typography.fontSize.sm,
    fontWeight: '500' as const,
    color: DesignTokens.colors.neutral[700],
    marginBottom: DesignTokens.spacing[2],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.colors.neutral[0],
    borderRadius: ComponentSpecs.input.borderRadius,
    borderWidth: 1,
    borderColor: DesignTokens.colors.neutral[200],
    paddingHorizontal: ComponentSpecs.input.paddingHorizontal,
    height: ComponentSpecs.input.height,
    ...DesignTokens.shadows.sm,
  },
  inputContainerFocused: {
    borderColor: DesignTokens.colors.primary[500],
    borderWidth: 2,
    ...DesignTokens.shadows.md,
  },
  inputContainerError: {
    borderColor: DesignTokens.colors.error,
    borderWidth: 2,
  },
  iconContainer: {
    marginRight: DesignTokens.spacing[3],
  },
  input: {
    flex: 1,
    fontSize: DesignTokens.typography.fontSize.base,
    color: DesignTokens.colors.neutral[900],
    fontFamily: DesignTokens.typography.fontFamily.secondary,
  },
  inputWithIcon: {
    marginLeft: 0,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: DesignTokens.spacing[3],
  },
  passwordToggle: {
    padding: DesignTokens.spacing[2],
    marginLeft: DesignTokens.spacing[2],
  },
  errorText: {
    fontSize: DesignTokens.typography.fontSize.sm,
    color: DesignTokens.colors.error,
    marginTop: DesignTokens.spacing[2],
    fontWeight: '500' as const,
  },
});
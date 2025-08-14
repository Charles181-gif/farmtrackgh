import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, TouchTargets } from '../constants/Colors';
import * as Haptics from 'expo-haptics';

interface QuickActionButtonProps {
  title: string;
  icon: string;
  onPress: () => void;
  color?: string;
  subtitle?: string;
  badge?: string;
}

export default function QuickActionButton({ title, icon, onPress, color = Colors.light.primary, subtitle, badge }: QuickActionButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: color }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {badge && (
        <Text style={[styles.badge, { backgroundColor: color }]}>{badge}</Text>
      )}
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color }]}>{title}</Text>
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '48%',
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    minHeight: TouchTargets.large,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    textAlign: 'center',
  },
  icon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
    fontFamily: Typography.families.primary,
  },
  subtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.light.textMuted,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
});
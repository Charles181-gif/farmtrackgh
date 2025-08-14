import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';
import { IconSymbol } from './IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: object;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionTitle,
  onAction,
  style
}: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: colors.surface }
        ]}>
          <IconSymbol 
            name={icon} 
            size={48} 
            color={colors.textMuted} 
          />
        </View>
        
        <Text style={[
          styles.title,
          { color: colors.text }
        ]}>
          {title}
        </Text>
        
        <Text style={[
          styles.description,
          { color: colors.textMuted }
        ]}>
          {description}
        </Text>
        
        {actionTitle && onAction && (
          <Button
            title={actionTitle}
            onPress={onAction}
            variant="primary"
            size="lg"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
});
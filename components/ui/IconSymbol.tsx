import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface IconSymbolProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

const iconMap: { [key: string]: string } = {
  // Weather icons
  'sun.max.fill': '☀️',
  'cloud.fill': '☁️',
  'cloud.sun.fill': '⛅',
  'cloud.rain.fill': '🌧️',
  'cloud.heavyrain.fill': '🌧️',
  'cloud.bolt.rain.fill': '⛈️',
  'cloud.fog.fill': '🌫️',
  'drop.fill': '💧',
  'wind': '💨',
  
  // Navigation icons
  'house.fill': '🏠',
  'list.bullet': '📋',
  'chart.bar.fill': '📊',
  'magnifyingglass': '🔍',
  'person.fill': '👤',
  
  // Action icons
  'plus': '+',
  'checkmark': '✓',
  'xmark': '✕',
  'arrow.clockwise': '↻',
  'location.fill': '📍',
  'lightbulb.fill': '💡',
  'eye': '👁️',
  'eye.slash': '🙈',
  'person': '👤',
  'mail': '📧',
  'lock-closed': '🔒',
  'person.badge.plus': '👤',
  'globe': '🌍',
  
  // Farm icons
  'leaf.fill': '🌱',
  'drop': '💧',
  'sun.max': '☀️',
  'calendar': '📅',
  'clock': '🕐',
  'bell.fill': '🔔',
};

export function IconSymbol({ name, size = 24, color = '#000', style }: IconSymbolProps) {
  const icon = iconMap[name] || '❓';
  
  return (
    <Text style={[styles.icon, { fontSize: size, color }, style]}>
      {icon}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});
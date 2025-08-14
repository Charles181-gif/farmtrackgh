import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, TouchTargets, BorderRadius } from '../../constants/Colors';
import * as Haptics from 'expo-haptics';

interface FABProps {
  onPress: () => void;
  icon?: string;
  label?: string;
  style?: any;
}

export const FAB: React.FC<FABProps> = ({ onPress, icon = '+', label, style }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.fab, style]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>{icon}</Text>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: TouchTargets.large,
    height: TouchTargets.large,
    backgroundColor: Colors.light.accent,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 2,
  },
});
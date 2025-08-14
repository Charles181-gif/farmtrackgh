import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'large', 
  color = '#3B82F6' 
}) => (
  <Animated.View 
    entering={FadeIn}
    className="flex-1 justify-center items-center"
  >
    <ActivityIndicator size={size} color={color} />
  </Animated.View>
);
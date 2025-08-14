import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  runOnJS 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = 'info',
  visible,
  onHide,
  duration = 3000,
}: ToastProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (visible) {
      // Show toast
      translateY.value = withSpring(0);
      opacity.value = withSpring(1);
      
      // Haptic feedback
      switch (type) {
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        default:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      // Auto hide
      translateY.value = withDelay(duration, withSpring(-100, {}, () => {
        opacity.value = withSpring(0, {}, () => {
          runOnJS(onHide)();
        });
      }));
    }
  }, [visible, duration, type, onHide]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
        };
      case 'error':
        return {
          bg: 'bg-red-500',
          icon: 'close-circle' as keyof typeof Ionicons.glyphMap,
        };
      case 'warning':
        return {
          bg: 'bg-orange-500',
          icon: 'warning' as keyof typeof Ionicons.glyphMap,
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-500',
          icon: 'information-circle' as keyof typeof Ionicons.glyphMap,
        };
    }
  };

  const typeStyles = getTypeStyles();

  if (!visible) return null;

  return (
    <Animated.View
      style={[animatedStyle]}
      className={`absolute top-12 left-4 right-4 z-50 ${typeStyles.bg} rounded-lg p-4 flex-row items-center shadow-lg`}
    >
      <Ionicons name={typeStyles.icon} size={24} color="white" />
      <Text className="text-white font-medium text-base ml-3 flex-1">
        {message}
      </Text>
    </Animated.View>
  );
}
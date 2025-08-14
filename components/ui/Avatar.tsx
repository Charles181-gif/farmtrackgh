import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface AvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onPress?: () => void;
  className?: string;
}

export default function Avatar({
  name = 'User',
  size = 'md',
  onPress,
  className = '',
}: AvatarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.95);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1);
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { container: 'w-8 h-8', text: 'text-sm', icon: 16 };
      case 'md':
        return { container: 'w-12 h-12', text: 'text-base', icon: 20 };
      case 'lg':
        return { container: 'w-16 h-16', text: 'text-xl', icon: 24 };
      case 'xl':
        return { container: 'w-24 h-24', text: 'text-3xl', icon: 32 };
      default:
        return { container: 'w-12 h-12', text: 'text-base', icon: 20 };
    }
  };

  const sizeStyles = getSizeStyles();
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const AvatarContent = () => (
    <View className={`${sizeStyles.container} rounded-full ${className}`}>
      <View className={`${sizeStyles.container} rounded-full bg-green-500 items-center justify-center`}>
        <Text className={`${sizeStyles.text} font-bold text-white`}>
          {initials}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <AnimatedTouchableOpacity
        style={animatedStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <AvatarContent />
      </AnimatedTouchableOpacity>
    );
  }

  return <AvatarContent />;
}
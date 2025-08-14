import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate
} from 'react-native-reanimated';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export default function SkeletonLoader({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  className = '' 
}: SkeletonLoaderProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(opacity.value, [0.3, 1], [0.3, 0.7]),
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width,
          height,
          borderRadius,
        },
      ]}
      className={`bg-gray-300 dark:bg-gray-600 ${className}`}
    />
  );
}

// Preset skeleton components
export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <View className="space-y-2">
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonLoader
        key={index}
        height={16}
        width={index === lines - 1 ? '70%' : '100%'}
      />
    ))}
  </View>
);

export const SkeletonCard = () => (
  <View className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow-sm">
    <View className="flex-row items-center mb-3">
      <SkeletonLoader width={40} height={40} borderRadius={20} />
      <View className="ml-3 flex-1">
        <SkeletonLoader height={16} width="60%" className="mb-2" />
        <SkeletonLoader height={12} width="40%" />
      </View>
    </View>
    <SkeletonText lines={2} />
  </View>
);
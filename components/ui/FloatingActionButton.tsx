import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from './IconSymbol';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  style?: object;
}

export default function FloatingActionButton({
  onPress,
  icon = 'plus',
  size = 'md',
  position = 'bottom-right',
  style,
}: FloatingActionButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(
      rotation.value,
      [0, 1],
      [0, 45],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { scale: scale.value },
        { rotateZ: `${rotateZ}deg` }
      ],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
    rotation.value = withSpring(1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    rotation.value = withSpring(0);
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { width: 48, height: 48, iconSize: 20 };
      case 'md':
        return { width: 56, height: 56, iconSize: 24 };
      case 'lg':
        return { width: 64, height: 64, iconSize: 28 };
      default:
        return { width: 56, height: 56, iconSize: 24 };
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-left':
        return { bottom: 24, left: 24 };
      case 'bottom-center':
        return { bottom: 24, alignSelf: 'center' };
      case 'bottom-right':
      default:
        return { bottom: 24, right: 24 };
    }
  };

  const sizeStyles = getSizeStyles();
  const positionStyles = getPositionStyles();

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.container,
        animatedStyle,
        positionStyles,
        sizeStyles,
        { backgroundColor: colors.primary },
        style
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <IconSymbol name={icon} size={sizeStyles.iconSize} color="white" />
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
});
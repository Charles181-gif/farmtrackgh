import React from 'react';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInRight, 
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
  SlideInUp,
  SlideOutDown
} from 'react-native-reanimated';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide-right' | 'slide-left' | 'slide-up';
  duration?: number;
}

export default function PageTransition({ 
  children, 
  type = 'fade',
  duration = 300 
}: PageTransitionProps) {
  const getEnteringAnimation = () => {
    switch (type) {
      case 'slide-right':
        return SlideInRight.duration(duration);
      case 'slide-left':
        return SlideInLeft.duration(duration);
      case 'slide-up':
        return SlideInUp.duration(duration);
      case 'fade':
      default:
        return FadeIn.duration(duration);
    }
  };

  const getExitingAnimation = () => {
    switch (type) {
      case 'slide-right':
        return SlideOutLeft.duration(duration);
      case 'slide-left':
        return SlideOutRight.duration(duration);
      case 'slide-up':
        return SlideOutDown.duration(duration);
      case 'fade':
      default:
        return FadeOut.duration(duration);
    }
  };

  return (
    <Animated.View 
      entering={getEnteringAnimation()}
      exiting={getExitingAnimation()}
      className="flex-1"
    >
      {children}
    </Animated.View>
  );
}
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  runOnJS,
  withSequence,
  withDelay
} from 'react-native-reanimated';

interface PageFlipContainerProps {
  children: React.ReactNode;
  trigger: any; // Change this to trigger animation
}

export const PageFlipContainer = ({ children, trigger }: PageFlipContainerProps) => {
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Initial entrance or trigger
    rotation.value = -25;
    opacity.value = 0;
    
    rotation.value = withTiming(0, { 
      duration: 800, 
      easing: Easing.bezier(0.1, 0.5, 0.5, 1) 
    });
    opacity.value = withTiming(1, { duration: 500 });

  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      shadowColor: '#000',
      shadowOffset: { width: rotation.value, height: 2 },
      shadowOpacity: Math.abs(rotation.value / 40),
      shadowRadius: 10,
      transform: [
        { perspective: 1200 },
        { rotateY: `${rotation.value}deg` },
        { skewY: `${rotation.value / 10}deg` },
        { translateX: rotation.value * 1.5 }
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

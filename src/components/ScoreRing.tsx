import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Fonts } from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ScoreRingProps {
  score: number;
  grade: string;
  color: string;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({
  score,
  grade,
  color,
  size = 120,
  strokeWidth = 12,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const animationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animationAnim, {
      toValue: score / 100,
      duration: 1500,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [score, animationAnim]);

  const strokeDashoffset = animationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg style={StyleSheet.absoluteFill}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.ink + '22'}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Foreground progress indicator */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <View style={styles.content}>
        <Text style={[styles.score, { color }]}>{score}</Text>
        <Text style={styles.outOf}>/ 100</Text>
      </View>

      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.grade}>{grade}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontFamily: Fonts.extraBold,
    fontSize: 42,
    lineHeight: 48,
  },
  outOf: {
    fontFamily: Fonts.handwritten,
    fontSize: 14,
    color: Colors.ink,
    marginTop: -4,
  },
  badge: {
    position: 'absolute',
    bottom: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.parchment,
  },
  grade: {
    fontFamily: Fonts.handwritten,
    fontSize: 18,
    color: Colors.white,
  },
});

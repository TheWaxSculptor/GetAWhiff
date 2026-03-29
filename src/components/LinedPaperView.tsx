import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '../theme';

export const LinedPaperView = ({ children, style }: { children: React.ReactNode; style?: ViewProps['style'] }) => (
  <View style={[styles.container, style]}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.parchment,
    padding: 16,
    // Simple lined effect using a repeating background image could be added later
  },
});

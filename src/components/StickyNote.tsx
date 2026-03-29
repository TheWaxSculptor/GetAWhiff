import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '../theme';

export const StickyNote = ({ children, style }: { children: React.ReactNode; style?: ViewProps['style'] }) => (
  <View style={[styles.container, style]}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.stickyGreen,
    padding: 12,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.ink,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

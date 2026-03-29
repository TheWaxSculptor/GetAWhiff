import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { Fonts, Colors } from '../theme';

export const HandwrittenText = (props: TextProps) => (
  <Text {...props} style={[styles.text, props.style]}>{props.children}</Text>
);

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.handwritten,
    color: Colors.ink,
  },
});

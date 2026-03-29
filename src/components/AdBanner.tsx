import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors, Fonts } from '../theme';

export function AdBanner() {
  // Mock Ad Banner until react-native-google-mobile-ads is fully wired up with publisher IDs
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ADVERTISEMENT</Text>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: Colors.bgCardLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  text: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  placeholder: {
    width: 320,
    height: 50,
    backgroundColor: Colors.surface,
    borderRadius: 4,
  },
});

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Colors, Fonts } from '../theme';

export const NotebookHeader = ({ title }: { title: string }) => (
  <SafeAreaView style={styles.safe}>
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: {
    backgroundColor: Colors.parchment,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ink,
  },
  title: {
    fontFamily: Fonts.handwritten,
    fontSize: 24,
    color: Colors.ink,
  },
});

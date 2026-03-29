import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { IngredientFlag } from '../engine/scorer';

interface IngredientChipProps {
  flag: IngredientFlag;
}

export function IngredientChip({ flag }: IngredientChipProps) {
  const getTheme = () => {
    switch (flag.risk) {
      case 'avoid':
        return { bg: Colors.avoidBg, border: Colors.avoid, text: Colors.avoidFg };
      case 'caution':
        return { bg: Colors.cautionBg, border: Colors.caution, text: Colors.cautionFg };
      case 'safe':
      default:
        return { bg: Colors.safeBg, border: Colors.safe, text: Colors.safeFg };
    }
  };

  const theme = getTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg, borderColor: theme.border }]}>
      <Text style={[styles.name, { color: theme.text }]}>{flag.name}</Text>
      {flag.concern && (
        <Text style={styles.concern} numberOfLines={2}>
          {flag.concern}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  name: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    marginBottom: 2,
  },
  concern: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
  },
});

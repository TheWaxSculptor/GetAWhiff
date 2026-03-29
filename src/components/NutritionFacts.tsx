import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { NutritionalFacts } from '../engine/scorer';

interface Props {
  data: NutritionalFacts;
}

export function NutritionFactsLabel({ data }: Props) {
  const renderRow = (label: string, value: number | null, unit: string = 'g', isBold: boolean = false, indent: boolean = false, subLabel?: string) => {
    if (value === null || value === undefined) return null;
    return (
      <View style={[styles.row, indent && styles.indentRow]}>
        <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
          <Text style={[styles.rowLabel, isBold && styles.boldText]}>{label} </Text>
          {subLabel && <Text style={styles.subLabelText}>{subLabel}</Text>}
        </View>
        <Text style={[styles.rowValue, isBold && styles.boldText]}>
          {value.toFixed(1).replace(/\.0$/, '')}{unit}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Nutrition Facts</Text>
        <View style={styles.thinDivider} />
        <Text style={styles.servingInfo}>Serving size 100g</Text>
        <View style={styles.thickDivider} />
        
        <View style={styles.caloriesHeader}>
          <Text style={styles.caloriesLabel}>Amount per serving</Text>
          <View style={styles.caloriesValueRow}>
            <Text style={styles.caloriesText}>Calories</Text>
            <Text style={styles.caloriesNum}>{data.calories ? Math.round(data.calories) : '--'}</Text>
          </View>
        </View>
        
        <View style={styles.mediumDivider} />

        <View style={styles.dvHeader}>
          <Text style={styles.dvHeaderText}>% Daily Value*</Text>
        </View>

        {/* Macros */}
        {renderRow('Total Fat', data.totalFat, 'g', true)}
        {renderRow('Saturated Fat', data.saturatedFat, 'g', false, true)}
        {renderRow('Trans Fat', data.transFat, 'g', false, true)}
        <View style={styles.thinDivider} />
        
        {renderRow('Cholesterol', data.cholesterol, 'mg', true)}
        <View style={styles.thinDivider} />
        
        {renderRow('Sodium', data.sodium, 'mg', true)}
        <View style={styles.thinDivider} />
        
        {renderRow('Total Carbohydrate', data.totalCarbs, 'g', true)}
        {renderRow('Dietary Fiber', data.dietaryFiber, 'g', false, true)}
        {renderRow('Total Sugars', data.sugars, 'g', false, true)}
        <View style={styles.thinDivider} />
        
        {renderRow('Protein', data.protein, 'g', true)}
        
        {/* Micros */}
        {(data.calcium !== null || data.iron !== null || data.potassium !== null) && (
          <>
            <View style={styles.thickDivider} />
            {renderRow('Vitamin D', 0, 'mcg', false)}
            <View style={styles.thinDivider} />
            {renderRow('Calcium', data.calcium, 'mg', false)}
            <View style={styles.thinDivider} />
            {renderRow('Iron', data.iron, 'mg', false)}
            <View style={styles.thinDivider} />
            {renderRow('Potassium', data.potassium, 'mg', false)}
          </>
        )}
        
        <View style={styles.mediumDivider} />
        <Text style={styles.footerNote}>* The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    padding: 1,
    backgroundColor: '#000',
    borderRadius: 2,
    marginTop: Spacing.md,
  },
  container: {
    backgroundColor: '#fff',
    padding: 8,
  },
  title: {
    fontFamily: Fonts.extraBold,
    fontSize: 34,
    color: '#000',
    lineHeight: 34,
    marginBottom: 2,
  },
  servingInfo: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: '#000',
    marginVertical: 2,
  },
  thickDivider: {
    height: 10,
    backgroundColor: '#000',
    marginVertical: 4,
  },
  mediumDivider: {
    height: 5,
    backgroundColor: '#000',
    marginVertical: 4,
  },
  thinDivider: {
    height: 1,
    backgroundColor: '#000',
    marginVertical: 1,
  },
  caloriesHeader: {
    marginTop: 2,
  },
  caloriesLabel: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: '#000',
  },
  caloriesValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  caloriesText: {
    fontFamily: Fonts.extraBold,
    fontSize: 28,
    color: '#000',
  },
  caloriesNum: {
    fontFamily: Fonts.extraBold,
    fontSize: 38,
    color: '#000',
    lineHeight: 38,
  },
  dvHeader: {
    alignItems: 'flex-end',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  dvHeaderText: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  indentRow: {
    paddingLeft: 12,
  },
  rowLabel: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#000',
  },
  subLabelText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#000',
  },
  boldText: {
    fontFamily: Fonts.bold,
  },
  rowValue: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#000',
  },
  footerNote: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#000',
    lineHeight: 12,
    marginTop: 6,
  }
});

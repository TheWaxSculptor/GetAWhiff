import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { fetchProductByBarcode, OpenFoodFactsProduct } from '../api/productApi';
import { analyzeProduct, ProductScore } from '../engine/scorer';
import { addToHistory } from '../hooks/useScanHistory';
import { ScoreRing } from '../components/ScoreRing';
import { IngredientChip } from '../components/IngredientChip';
import { NutritionFactsLabel } from '../components/NutritionFacts';
import { AdBanner } from '../components/AdBanner';

type ParamList = { ProductDetail: { barcode: string, imageUri?: string } };

export default function ProductDetailScreen() {
  const route = useRoute<RouteProp<ParamList, 'ProductDetail'>>();
  const navigation = useNavigation();
  const { barcode } = route.params;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<OpenFoodFactsProduct | null>(null);
  const [scoreData, setScoreData] = useState<ProductScore | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProduct();
  }, [barcode]);

  const loadProduct = async () => {
    console.log("ProductDetail loading for barcode:", barcode);
    setLoading(true);
    setError(null);
    try {
      // Use the barcode to fetch product
      const data = await fetchProductByBarcode(barcode, route.params?.imageUri || undefined);
      
      if (data && data.product) {
        setProduct(data);
        const analyzed = analyzeProduct(data);
        setScoreData(analyzed);

        // Save to history
        addToHistory({
          barcode,
          productName: data.product.product_name || 'Unknown Product',
          brand: data.product.brands || 'Unknown Brand',
          imageUrl: data.product.image_url || '',
          score: analyzed.score,
          grade: analyzed.grade,
          scannedAt: new Date().toISOString(),
        });
      } else {
        console.warn("No data returned for barcode:", barcode);
        setError("We couldn't find this product. Try searching or scanning again.");
      }
    } catch (err) {
      console.error("ProductDetail load error:", err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Analyzing ingredients...</Text>
      </View>
    );
  }

  if (error || !scoreData || !product) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.backButton} onPress={() => navigation.goBack()}>
          Go Back
        </Text>
      </View>
    );
  }

  const { product_name, brands, image_url, ingredients_text } = product.product;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View
          style={[
            styles.header, 
            scoreData.grade === 'A' || scoreData.grade === 'B' ? styles.goodBg : styles.badBg
          ]}
        >
          <View style={styles.headerContent}>
            {image_url ? (
              <Image source={{ uri: image_url }} style={styles.productImage} resizeMode="contain" />
            ) : (
              <View style={[styles.productImage, styles.imagePlaceholder]}>
                <Ionicons name="basket-outline" size={40} color={Colors.ink} />
              </View>
            )}
            <View style={styles.headerText}>
              <Text style={styles.brandName}>{brands?.split(',')[0] || 'Unknown Brand'}</Text>
              <Text style={styles.productName}>{product_name}</Text>
              <View style={styles.statusRow}>
                 <Ionicons 
                   name={scoreData.grade === 'A' || scoreData.grade === 'B' ? "happy" : "sad"} 
                   size={24} 
                   color={scoreData.grade === 'A' || scoreData.grade === 'B' ? Colors.safe : Colors.avoid} 
                 />
                 <Text style={[styles.statusText, { color: scoreData.grade === 'A' || scoreData.grade === 'B' ? Colors.safe : Colors.avoid }]}>
                    {scoreData.grade === 'A' || scoreData.grade === 'B' ? 'A Healthy Choice' : 'Proceed with Caution'}
                 </Text>
              </View>
            </View>
          </View>

          {/* Score section */}
          <View style={styles.scoreSection}>
            <ScoreRing
              score={scoreData.score}
              grade={scoreData.grade}
              color={scoreData.gradeColor}
            />
            <Text style={styles.summaryText}>{scoreData.summary}</Text>
          </View>
        </View>

        {/* Risk Breakdown */}
        <View style={[styles.section, (scoreData.grade !== 'A' && scoreData.grade !== 'B') && styles.badBg]}>
          <Text style={styles.sectionTitle}>Detected Risks</Text>
          {scoreData.flags.length === 0 && scoreData.nutrimentFlags.length === 0 ? (
            <View style={styles.allClear}>
              <Ionicons name="happy" size={24} color={Colors.white} />
              <Text style={styles.allClearText}>This product is clean!</Text>
            </View>
          ) : (
            <View>
              {scoreData.flags.map((flag, idx) => (
                <IngredientChip key={`f-${idx}`} flag={flag} />
              ))}
              {scoreData.nutrimentFlags.map((flag, idx) => (
                <IngredientChip key={`n-${idx}`} flag={flag} />
              ))}
            </View>
          )}
        </View>

        {/* Raw Ingredients */}
        {ingredients_text && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients List</Text>
            <Text style={styles.rawIngredientsText}>{ingredients_text}</Text>
          </View>
        )}

        {/* Nutrition Facts */}
        {scoreData.nutrition && (
          <View style={[styles.section, { paddingTop: 0 }, (scoreData.grade !== 'A' && scoreData.grade !== 'B') && styles.badBg]}>
            <NutritionFactsLabel data={scoreData.nutrition} />
          </View>
        )}
      </ScrollView>

      {/* Ad placement pinned to bottom */}
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.parchment },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.parchment,
    padding: Spacing.xl,
  },
  scroll: { paddingBottom: Spacing.xxl },
  loadingText: {
    fontFamily: Fonts.handwritten,
    color: Colors.ink,
    marginTop: Spacing.md,
  },
  errorText: {
    fontFamily: Fonts.handwritten,
    color: Colors.ink,
    textAlign: 'center',
    fontSize: 16,
    marginVertical: Spacing.md,
  },
  backButton: {
    fontFamily: Fonts.handwritten,
    color: Colors.white,
    backgroundColor: Colors.highlightBrown,
    padding: Spacing.md,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    borderBottomWidth: 1,
    borderColor: Colors.ink,
    backgroundColor: Colors.parchment,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  productImage: {
    width: 80,
    height: 100,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.ink,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  headerText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  brandName: {
    fontFamily: Fonts.handwritten,
    fontSize: 14,
    color: Colors.ink,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  productName: {
    fontFamily: Fonts.handwritten,
    fontSize: 22,
    color: Colors.ink,
    marginTop: 4,
  },
  scoreSection: {
    alignItems: 'center',
  },
  summaryText: {
    fontFamily: Fonts.handwritten,
    fontSize: 16,
    color: Colors.ink,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Fonts.handwritten,
    fontSize: 18,
    color: Colors.ink,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ink,
    paddingBottom: 4,
  },
  allClear: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.stickyGreen,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.ink,
  },
  allClearText: {
    fontFamily: Fonts.handwritten,
    color: Colors.ink,
    marginLeft: Spacing.sm,
  },
  goodBg: {
    backgroundColor: Colors.parchment,
  },
  badBg: {
    backgroundColor: '#fff0f0', // Slight red tinge
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  statusText: {
    fontFamily: Fonts.handwritten,
    fontSize: 16,
    fontWeight: 'bold',
  },
  rawIngredientsText: {
    fontFamily: Fonts.handwritten,
    fontSize: 14,
    lineHeight: 22,
    color: Colors.ink,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.ink,
  },
});

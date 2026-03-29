import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { NotebookHeader } from '../components/NotebookHeader';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { searchProducts, SearchResult } from '../api/productApi';

type RootStackParamList = {
  ProductDetail: { barcode: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetail'>;

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 2) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async (q: string) => {
    setLoading(true);
    const data = await searchProducts(q);
    setResults(data);
    setLoading(false);
  };

  const renderItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { barcode: item.code })}
    >
      <View style={styles.cardImageContainer}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <Ionicons name="basket-outline" size={24} color={Colors.textMuted} />
        )}
      </View>
      <View style={styles.cardText}>
        <Text style={styles.brandName} numberOfLines={1}>{item.brands}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.product_name}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <NotebookHeader title="Product Search" />
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Search products..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.code}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
        />
      ) : query.length > 2 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      ) : (
        <View style={styles.centerContainer}>
          <Ionicons name="nutrition-outline" size={64} color={Colors.surface} />
          <Text style={styles.emptyText}>Type to find foods {"\n"}& cosmetics</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.parchment },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.parchment,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ink,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.ink,
  },
  input: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontFamily: Fonts.handwritten,
    fontSize: 16,
    color: Colors.ink,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.xxl,
  },
  emptyText: {
    fontFamily: Fonts.handwritten,
    color: Colors.ink,
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  list: {
    padding: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.ink,
  },
  cardImageContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.ink,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: Radius.sm,
  },
  cardText: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.sm,
  },
  brandName: {
    fontFamily: Fonts.handwritten,
    fontSize: 11,
    color: Colors.ink,
    textTransform: 'uppercase',
  },
  productName: {
    fontFamily: Fonts.handwritten,
    fontSize: 14,
    color: Colors.ink,
    marginTop: 2,
  },
});

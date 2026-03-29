import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { fetchStrains, StrainInfo, StrainType } from '../api/strainApi';
import { AdBanner } from '../components/AdBanner';
import { getFavorites, isFavorite, addFavorite, removeFavorite } from '../api/favoritesStorage';
import { NotebookHeader } from '../components/NotebookHeader';
import { PageFlipContainer } from '../components/PageFlipContainer';

type RootStackParamList = {
  StrainDetail: { strainId: string };
  PPFDMeter: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'StrainDetail'>;

const TYPES: (StrainType | 'All' | 'Favorites')[] = ['All', 'Favorites', 'Indica', 'Sativa', 'Hybrid'];

export default function StrainsTabScreen() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<StrainType | 'All' | 'Favorites'>('All');
  const [strains, setStrains] = useState<StrainInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStrains();
    }, 400); // debounce input
    return () => clearTimeout(timer);
  }, [query, selectedType]);

  const loadStrains = async () => {
    setLoading(true);

    if (selectedType === 'Favorites') {
      const data = await getFavorites();
      setStrains(data);
      setFavoriteIds(new Set(data.map(f => f.id)));
    } else {
      const typeFilter = selectedType === 'All' ? undefined : selectedType;
      const data = await fetchStrains(query, typeFilter);
      setStrains(data);
      // Sync favorite status
      const favs = await getFavorites();
      setFavoriteIds(new Set(favs.map(f => f.id)));
    }
    setLoading(false);
  };

  const toggleFavorite = async (strain: StrainInfo) => {
    const isFav = favoriteIds.has(strain.id);
    if (isFav) {
      await removeFavorite(strain.id);
      setFavoriteIds(prev => {
        const next = new Set(prev);
        next.delete(strain.id);
        return next;
      });
      if (selectedType === 'Favorites') {
        setStrains(prev => prev.filter(s => s.id !== strain.id));
      }
    } else {
      await addFavorite(strain);
      setFavoriteIds(prev => new Set(prev).add(strain.id));
    }
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === 'Easy') return Colors.safe;
    if (diff === 'Moderate') return Colors.caution;
    return Colors.avoid;
  };

  const renderItem = ({ item }: { item: StrainInfo }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('StrainDetail', { strainId: item.id })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.strainName} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item)} style={{ padding: 4 }}>
            <Ionicons 
              name={favoriteIds.has(item.id) ? "heart" : "heart-outline"} 
              size={22} 
              color={favoriteIds.has(item.id) ? Colors.avoid : Colors.textMuted} 
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.thcText}>THC: {item.thcContent}</Text>
        
        <View style={styles.chipRow}>
           <View style={[styles.chip, { backgroundColor: getDifficultyColor(item.difficulty) + '33' }]}>
             <Text style={[styles.chipText, { color: getDifficultyColor(item.difficulty) }]}>{item.difficulty}</Text>
           </View>
           <View style={[styles.chip, { backgroundColor: Colors.primary + '33' }]}>
             <Ionicons name="time-outline" size={12} color={Colors.primaryLight} style={{marginRight: 4}} />
             <Text style={[styles.chipText, { color: Colors.primaryLight }]}>{item.growthTime}</Text>
           </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <NotebookHeader title="The Bud Bible" />
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: Spacing.md }}>
          <TouchableOpacity onPress={() => navigation.navigate('PPFDMeter' as any)} style={{ padding: 4, backgroundColor: Colors.stickyGreen, borderRadius: 12, borderWidth: 1, borderColor: Colors.ink }}>
            <Ionicons name="sunny" size={26} color={Colors.ink} />
          </TouchableOpacity>
        </View>
        
        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Search strains..."
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

        {/* Filters */}
        <View style={styles.filterRow}>
          {TYPES.map(t => (
            <TouchableOpacity 
              key={t}
              style={[styles.filterChip, selectedType === t && styles.filterChipActive]}
              onPress={() => setSelectedType(t)}
            >
              <Text style={[styles.filterText, selectedType === t && styles.filterTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <PageFlipContainer trigger={selectedType}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : strains.length > 0 ? (
          <FlatList
            data={strains}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          <View style={styles.centerContainer}>
            <Ionicons name="leaf-outline" size={64} color={Colors.surface} />
            <Text style={styles.emptyText}>No strains found</Text>
          </View>
        )}
      </PageFlipContainer>

      <AdBanner />
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
  headerTitle: {
    fontFamily: Fonts.handwritten,
    fontSize: 28,
    color: Colors.ink,
    marginBottom: Spacing.md,
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
    marginBottom: Spacing.sm,
  },
  input: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontFamily: Fonts.handwritten,
    fontSize: 16,
    color: Colors.ink,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.ink,
    backgroundColor: Colors.white,
  },
  filterChipActive: {
    backgroundColor: Colors.highlightBrown,
    borderColor: Colors.ink,
  },
  filterText: {
    fontFamily: Fonts.handwritten,
    color: Colors.ink,
    fontSize: 13,
  },
  filterTextActive: {
    color: Colors.white,
    fontFamily: Fonts.handwritten,
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
    marginTop: Spacing.md,
  },
  list: {
    padding: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.ink,
    overflow: 'hidden',
  },
  cardImage: {
    width: 100,
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  strainName: {
    flex: 1,
    fontFamily: Fonts.handwritten,
    fontSize: 18,
    color: Colors.ink,
  },
  strainType: {
    fontFamily: Fonts.handwritten,
    fontSize: 12,
    color: Colors.ink,
    textTransform: 'uppercase',
  },
  thcText: {
    fontFamily: Fonts.handwritten,
    fontSize: 14,
    color: Colors.ink,
    marginBottom: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.ink,
  },
  chipText: {
    fontFamily: Fonts.handwritten,
    fontSize: 11,
    color: Colors.ink,
  }
});

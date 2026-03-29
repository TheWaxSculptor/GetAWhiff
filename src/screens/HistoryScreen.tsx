import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { HistoryItem, getHistory, clearHistory } from '../hooks/useScanHistory';
import { getGrowPlants, GrowPlant, deleteGrowPlant } from '../api/journalStorage';
import { NotebookHeader } from '../components/NotebookHeader';
import { AdBanner } from '../components/AdBanner';

type RootStackParamList = {
  StrainDetail: { strainId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'StrainDetail'>;

export default function HistoryScreen() {
  const [plants, setPlants] = useState<GrowPlant[]>([]);
  const navigation = useNavigation<NavigationProp>();

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const load = async () => {
    const data = await getGrowPlants();
    setPlants(data);
  };

  const handleDelete = async (id: string) => {
    await deleteGrowPlant(id);
    load();
  };

  const renderItem = ({ item }: { item: GrowPlant }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('StrainDetail', { strainId: item.strainId })}
    >
      <View style={styles.cardIconContainer}>
        <Ionicons name="leaf" size={32} color={Colors.stickyGreen} />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.brandName} numberOfLines={1}>{item.status}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.strainName}</Text>
        <Text style={styles.timeText}>Started: {new Date(item.startedAt).toLocaleDateString()}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={20} color={Colors.avoid} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <NotebookHeader title="Grow Journal" />
      
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>{plants.length} Active Plants</Text>
      </View>

      {plants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="journal-outline" size={64} color={Colors.ink} />
          <Text style={styles.emptyText}>Journal is Empty</Text>
          <Text style={styles.emptySubtext}>Add a strain to your journal to start tracking its growth, health, and yields.</Text>
        </View>
      ) : (
        <FlatList
          data={plants}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Persistent Ad Banner */}
      <AdBanner />
    </View>
  );
}

function getGradeColor(grade: string) {
  const colors: any = { A: '#00E676', B: '#69F0AE', C: '#FFCA28', D: '#FF7043', F: '#F44336' };
  return colors[grade] || Colors.textSecondary;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.parchment },
  summaryBar: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ink,
    alignItems: 'center',
  },
  summaryText: {
    fontFamily: Fonts.handwritten,
    fontSize: 14,
    color: Colors.ink,
  },
  list: {
    padding: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.ink,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: Colors.parchment,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.ink,
  },
  cardText: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  brandName: {
    fontFamily: Fonts.handwritten,
    fontSize: 12,
    color: Colors.ink,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  productName: {
    fontFamily: Fonts.handwritten,
    fontSize: 18,
    color: Colors.ink,
    marginTop: 2,
  },
  timeText: {
    fontFamily: Fonts.handwritten,
    fontSize: 12,
    color: Colors.ink,
    marginTop: 4,
  },
  deleteBtn: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontFamily: Fonts.handwritten,
    fontSize: 24,
    color: Colors.ink,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontFamily: Fonts.handwritten,
    fontSize: 16,
    color: Colors.ink,
    textAlign: 'center',
    marginTop: Spacing.sm,
    opacity: 0.8,
  },
});

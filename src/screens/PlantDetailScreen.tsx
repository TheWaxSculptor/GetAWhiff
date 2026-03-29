import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { getPlantById, PlantCareInfo } from '../api/plantApi';
import { AdBanner } from '../components/AdBanner';

type ParamList = { PlantDetail: { plantId: string } };

export default function PlantDetailScreen() {
  const route = useRoute<RouteProp<ParamList, 'PlantDetail'>>();
  const navigation = useNavigation();
  const { plantId } = route.params;

  const [loading, setLoading] = useState(true);
  const [plant, setPlant] = useState<PlantCareInfo | null>(null);

  useEffect(() => {
    loadPlant();
  }, [plantId]);

  const loadPlant = async () => {
    setLoading(true);
    const data = await getPlantById(plantId);
    setPlant(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.accentGreen} />
        <Text style={styles.loadingText}>Fetching plant details...</Text>
      </View>
    );
  }

  if (!plant) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="leaf-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.errorText}>Could not find plant details.</Text>
        <Text style={styles.backButton} onPress={() => navigation.goBack()}>Go Back</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: plant.imageUrl }} style={styles.plantImage} />
          <View style={styles.imageOverlay} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.scientificName}>{plant.scientificName}</Text>
            <Text style={styles.plantName}>{plant.name}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>{plant.description}</Text>

          <Text style={styles.sectionTitle}>Essential Care Guide</Text>
          
          <View style={styles.careGrid}>
            <CareCard 
              icon="water-outline" 
              title="Watering" 
              value={plant.careTiers.watering} 
              color="#4FC3F7" 
            />
            <CareCard 
              icon="sunny-outline" 
              title="Sunlight" 
              value={plant.careTiers.sunlight} 
              color="#FFD54F" 
            />
            <CareCard 
              icon="thermometer-outline" 
              title="Temperature" 
              value={plant.careTiers.temperature} 
              color="#FF7043" 
            />
             <CareCard 
              icon="water" 
              title="Humidity" 
              value={plant.careTiers.humidity} 
              color="#81D4FA" 
            />
             <CareCard 
              icon="leaf-outline" 
              title="Soil Type" 
              value={plant.careTiers.soil} 
              color="#A1887F" 
            />
            <CareCard 
              icon="paw-outline" 
              title="Pet Toxicity" 
              value={plant.careTiers.petToxicity} 
              color={plant.careTiers.petToxicity === 'Toxic' ? Colors.avoid : Colors.safe} 
            />
          </View>
        </View>
      </ScrollView>
      <AdBanner />
    </View>
  );
}

function CareCard({ icon, title, value, color }: { icon: any, title: string, value: string, color: string }) {
  return (
    <View style={styles.careCard}>
      <View style={[styles.iconBox, { backgroundColor: color + '22' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View style={styles.careText}>
        <Text style={styles.careTitle}>{title}</Text>
        <Text style={styles.careValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.parchment },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.parchment },
  loadingText: { fontFamily: Fonts.handwritten, color: Colors.ink, marginTop: Spacing.md },
  errorText: { fontFamily: Fonts.handwritten, color: Colors.ink, fontSize: 16, marginVertical: Spacing.md },
  backButton: { fontFamily: Fonts.handwritten, color: Colors.white, backgroundColor: Colors.highlightBrown, padding: Spacing.md, borderRadius: Radius.md, overflow: 'hidden' },
  scroll: { paddingBottom: Spacing.xxl },
  imageContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  plantImage: {
    ...StyleSheet.absoluteFillObject,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 13, 26, 0.4)',
  },
  headerTextContainer: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  scientificName: {
    fontFamily: Fonts.handwritten,
    fontSize: 14,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  plantName: {
    fontFamily: Fonts.handwritten,
    fontSize: 32,
    color: Colors.white,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  content: {
    padding: Spacing.lg,
    marginTop: -20,
    backgroundColor: Colors.parchment,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: Colors.ink,
  },
  description: {
    fontFamily: Fonts.handwritten,
    fontSize: 16,
    color: Colors.ink,
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: Fonts.handwritten,
    fontSize: 20,
    color: Colors.ink,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ink,
    paddingBottom: 4,
  },
  careGrid: {
    gap: Spacing.md,
  },
  careCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.ink,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.ink,
  },
  careText: {
    marginLeft: Spacing.md,
  },
  careTitle: {
    fontFamily: Fonts.handwritten,
    fontSize: 14,
    color: Colors.ink,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  careValue: {
    fontFamily: Fonts.handwritten,
    fontSize: 18,
    color: Colors.ink,
    marginTop: 2,
  },
});

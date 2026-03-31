import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { getStrainById, StrainInfo } from '../api/strainApi';
import { AdBanner } from '../components/AdBanner';
import { isFavorite, addFavorite, removeFavorite } from '../api/favoritesStorage';
import { getJournalEntries, addJournalEntry, JournalEntry, addGrowPlant, getGrowPlants } from '../api/journalStorage';

type ParamList = { Detail: { strainId: string } };

export default function StrainDetailScreen() {
  const route = useRoute<RouteProp<ParamList, 'Detail'>>();
  const navigation = useNavigation();
  const { strainId } = route.params;

  const [loading, setLoading] = useState(true);
  const [strain, setStrain] = useState<StrainInfo | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [newNote, setNewNote] = useState('');
  const [plantId, setPlantId] = useState<string | null>(null);
  const [health, setHealth] = useState<'Excellent' | 'Good' | 'Fair' | 'Poor'>('Excellent');
  const [height, setHeight] = useState('');

  useEffect(() => {
    loadStrain();
  }, [strainId]);

  const loadStrain = async () => {
    setLoading(true);
    const data = await getStrainById(strainId);
    if (data) {
      setStrain(data);
      const fav = await isFavorite(data.id);
      setIsFav(fav);
      
      const plants = await getGrowPlants();
      const activePlant = plants.find(p => p.strainId === data.id && p.status === 'Growing');
      if (activePlant) {
        setPlantId(activePlant.id);
        const notes = await getJournalEntries(activePlant.id);
        setJournal(notes);
      }
    }
    setLoading(false);
  };

  const toggleFav = async () => {
    if (!strain) return;
    if (isFav) {
      await removeFavorite(strain.id);
    } else {
      await addFavorite(strain);
    }
    setIsFav(!isFav);
  };

  const startGrow = async () => {
    if (!strain) return;
    const plant = await addGrowPlant(strain.id, strain.name);
    setPlantId(plant.id);
    Alert.alert("Success", "Added to your Active Grow Journal!");
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !plantId) return;
    await addJournalEntry(plantId, { 
      content: newNote.trim(),
      healthStatus: health,
      height: height || undefined,
    });
    setNewNote('');
    setHeight('');
    const notes = await getJournalEntries(plantId);
    setJournal(notes);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.stickyGreen} />
      </View>
    );
  }

  if (!strain) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.ink} />
        <Text style={styles.errorText}>Strain not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Image source={{ uri: strain.imageUrl }} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <View style={styles.badges}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeText}>{strain.type}</Text>
              </View>
              <View style={styles.thcBadge}>
                <Text style={styles.thcText}>THC: {strain.thcContent}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={styles.title}>{strain.name}</Text>
              <TouchableOpacity onPress={toggleFav} style={styles.favBtn}>
                <Ionicons name={isFav ? "heart" : "heart-outline"} size={32} color={isFav ? Colors.avoid : Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>{strain.description}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Difficulty</Text>
              <Text style={styles.statValue}>{strain.difficulty}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Flower Time</Text>
              <Text style={styles.statValue}>{strain.growthTime}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Yield</Text>
              <Text style={styles.statValue}>{strain.expectedYield}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Lineage & Family Tree</Text>
          <View style={styles.lineageBox}>
            <View style={styles.lineageRow}>
              <Ionicons name="git-branch-outline" size={18} color={Colors.ink} />
              <Text style={styles.lineageLabel}>Parents:</Text>
              <Text style={styles.lineageValue}>{strain.lineage.parents.join(' x ')}</Text>
            </View>
            {strain.lineage.origin && (
              <View style={styles.lineageRow}>
                <Ionicons name="location-outline" size={18} color={Colors.ink} />
                <Text style={styles.lineageLabel}>Origin:</Text>
                <Text style={styles.lineageValue}>{strain.lineage.origin}</Text>
              </View>
            )}
            {strain.lineage.heritage && (
              <View style={styles.lineageRow}>
                <Ionicons name="bookmarks-outline" size={18} color={Colors.ink} />
                <Text style={styles.lineageLabel}>Heritage:</Text>
                <Text style={styles.lineageValue}>{strain.lineage.heritage}</Text>
              </View>
            )}
            {strain.breeder && (
              <View style={styles.lineageRow}>
                <Ionicons name="flask-outline" size={18} color={Colors.ink} />
                <Text style={styles.lineageLabel}>Breeder:</Text>
                <Text style={styles.lineageValue}>{strain.breeder}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Check Health</Text>
          <TouchableOpacity 
            style={styles.healthBtn}
            onPress={() => navigation.navigate('ScanTab' as any)}
          >
            <Ionicons name="medical" size={24} color={Colors.white} />
            <Text style={styles.healthBtnText}>Start Health Diagnosis</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {plantId ? (
            <>
              <Text style={styles.sectionTitle}>Grow Journal</Text>
              <View style={styles.journalBox}>
                <View style={styles.inputRow}>
                   <View style={{flex: 1}}>
                     <Text style={styles.inputLabel}>Height (cm)</Text>
                     <TextInput 
                       style={styles.miniInput} 
                       value={height} 
                       onChangeText={setHeight}
                       placeholder="e.g. 45"
                       keyboardType="numeric"
                     />
                   </View>
                   <View style={{flex: 1, marginLeft: 10}}>
                     <Text style={styles.inputLabel}>Health</Text>
                     <View style={styles.statusRow}>
                        {(['Excellent', 'Good', 'Fair', 'Poor'] as const).map(s => (
                           <TouchableOpacity key={s} onPress={() => setHealth(s)}>
                             <Ionicons 
                               name={health === s ? "radio-button-on" : "radio-button-off"} 
                               size={16} 
                               color={Colors.ink} 
                             />
                           </TouchableOpacity>
                        ))}
                     </View>
                   </View>
                </View>

                <TextInput
                  style={styles.journalInput}
                  placeholder="Daily progress notes..."
                  placeholderTextColor={Colors.ink + '77'}
                  value={newNote}
                  onChangeText={setNewNote}
                  multiline
                />
                <TouchableOpacity style={styles.saveNoteBtn} onPress={handleAddNote}>
                  <Text style={styles.saveNoteBtnText}>Log Progress</Text>
                </TouchableOpacity>
              </View>

              {journal.map(entry => (
                 <View key={entry.id} style={styles.journalEntry}>
                   <View style={styles.journalEntryHeader}>
                     <Text style={styles.journalDate}>{new Date(entry.createdAt).toLocaleDateString()}</Text>
                     <View style={styles.entryStats}>
                        {entry.height && <Text style={styles.entryStatText}>{entry.height}cm</Text>}
                        <Text style={styles.entryStatText}>{entry.healthStatus}</Text>
                     </View>
                   </View>
                   <Text style={styles.journalContent}>{entry.content}</Text>
                 </View>
              ))}
            </>
          ) : (
            <TouchableOpacity style={styles.startGrowBtn} onPress={startGrow}>
              <Ionicons name="add-circle" size={24} color={Colors.white} />
              <Text style={styles.startGrowBtnText}>Add To Grow Journal</Text>
            </TouchableOpacity>
          )}

        </View>
      </ScrollView>

      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.parchment },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.parchment },
  scrollContent: { paddingBottom: Spacing.xl },
  hero: { height: 300, width: '100%', position: 'relative' },
  heroImage: { ...StyleSheet.absoluteFillObject },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', padding: Spacing.lg, justifyContent: 'flex-end' },
  badges: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  typeBadge: { backgroundColor: Colors.stickyGreen, paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full },
  thcBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  typeText: { fontFamily: Fonts.handwritten, color: Colors.white, fontSize: 12 },
  thcText: { fontFamily: Fonts.handwritten, color: Colors.white, fontSize: 12 },
  title: { fontFamily: Fonts.handwritten, fontSize: 32, color: Colors.white, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 },
  content: { padding: Spacing.lg },
  description: { fontFamily: Fonts.handwritten, fontSize: 16, color: Colors.ink, lineHeight: 24, marginBottom: Spacing.lg },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg },
  statBox: { flex: 1, alignItems: 'center', backgroundColor: Colors.white, padding: Spacing.md, marginHorizontal: 4, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.ink },
  statLabel: { fontFamily: Fonts.handwritten, fontSize: 12, color: Colors.ink, opacity: 0.6, marginBottom: 4 },
  statValue: { fontFamily: Fonts.handwritten, fontSize: 16, color: Colors.ink, fontWeight: 'bold' },
  sectionTitle: { fontFamily: Fonts.handwritten, fontSize: 24, color: Colors.ink, marginBottom: Spacing.md },
  divider: { height: 1, backgroundColor: Colors.ink, opacity: 0.1, marginVertical: Spacing.lg },
  lineageBox: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.ink,
    borderStyle: 'dashed',
  },
  lineageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  lineageLabel: {
    fontFamily: Fonts.handwritten,
    fontSize: 14,
    color: Colors.ink,
    opacity: 0.7,
    width: 70,
  },
  lineageValue: {
    fontFamily: Fonts.handwritten,
    fontSize: 16,
    color: Colors.ink,
    flex: 1,
  },
  errorText: { fontFamily: Fonts.handwritten, fontSize: 18, color: Colors.ink, marginTop: Spacing.md },
  
  favBtn: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  healthBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.avoid,
    padding: Spacing.md,
    borderRadius: Radius.md,
    gap: 12,
  },
  healthBtnText: {
    fontFamily: Fonts.handwritten,
    fontSize: 18,
    color: Colors.white,
  },
  journalBox: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.ink,
    marginBottom: Spacing.lg,
  },
  journalInput: {
    fontFamily: Fonts.handwritten,
    fontSize: 16,
    color: Colors.ink,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveNoteBtn: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.highlightBrown,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    marginTop: 8,
  },
  saveNoteBtnText: {
    fontFamily: Fonts.handwritten,
    color: Colors.white,
    fontSize: 14,
  },
  journalEntry: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.ink,
    marginBottom: Spacing.md,
  },
  journalDate: {
    fontFamily: Fonts.handwritten,
    fontSize: 12,
    color: Colors.ink,
    opacity: 0.6,
    marginBottom: 4,
  },
  journalContent: {
    fontFamily: Fonts.handwritten,
    fontSize: 15,
    color: Colors.ink,
    lineHeight: 20,
  },
  startGrowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.stickyGreen,
    padding: Spacing.md,
    borderRadius: Radius.md,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.ink,
  },
  startGrowBtnText: {
    fontFamily: Fonts.handwritten,
    fontSize: 18,
    color: Colors.white,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  inputLabel: {
    fontFamily: Fonts.handwritten,
    fontSize: 12,
    color: Colors.ink,
    marginBottom: 2,
  },
  miniInput: {
    backgroundColor: Colors.parchment,
    borderWidth: 1,
    borderColor: Colors.ink,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontFamily: Fonts.handwritten,
    fontSize: 14,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingVertical: 4,
  },
  journalEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 4,
  },
  entryStats: {
    flexDirection: 'row',
    gap: 10,
  },
  entryStatText: {
    fontFamily: Fonts.handwritten,
    fontSize: 11,
    color: Colors.highlightBrown,
    fontWeight: 'bold',
  }
});

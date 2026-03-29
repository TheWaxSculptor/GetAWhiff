import AsyncStorage from '@react-native-async-storage/async-storage';

const JOURNAL_KEY = '@wakeup_whiff_journal';

export interface JournalEntry {
  id: string;
  strainId: string;
  content: string; // text notes
  createdAt: string;
  imageUri?: string; // optional photo
  healthStatus?: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  weight?: string; // harvest weight or current estimated
  height?: string; // current plant height
}

export interface GrowPlant {
  id: string;
  strainId: string;
  strainName: string;
  startedAt: string;
  status: 'Growing' | 'Harvested' | 'Archived';
  notes?: string;
}

const GROW_PLANTS_KEY = '@wakeup_whiff_grow_plants';

export async function getGrowPlants(): Promise<GrowPlant[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(GROW_PLANTS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
}

export async function addGrowPlant(strainId: string, strainName: string): Promise<GrowPlant> {
  const plants = await getGrowPlants();
  const newPlant: GrowPlant = {
    id: Math.random().toString(36).substr(2, 9),
    strainId,
    strainName,
    startedAt: new Date().toISOString(),
    status: 'Growing',
  };
  await AsyncStorage.setItem(GROW_PLANTS_KEY, JSON.stringify([...plants, newPlant]));
  return newPlant;
}

export async function deleteGrowPlant(id: string): Promise<void> {
  const plants = await getGrowPlants();
  await AsyncStorage.setItem(GROW_PLANTS_KEY, JSON.stringify(plants.filter(p => p.id !== id)));
}

export async function getJournalEntries(plantId?: string): Promise<JournalEntry[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(JOURNAL_KEY);
    const entries: JournalEntry[] = jsonValue != null ? JSON.parse(jsonValue) : [];
    if (plantId) {
      return entries.filter(e => e.strainId === plantId);
    }
    return entries;
  } catch (e) {
    console.warn('Failed to fetch journal', e);
    return [];
  }
}

export async function addJournalEntry(plantId: string, entry: Omit<JournalEntry, 'id' | 'createdAt' | 'strainId'>): Promise<void> {
  try {
    const entries = await getJournalEntries();
    const newEntry: JournalEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      strainId: plantId,
      createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify([...entries, newEntry]));
  } catch (e) {
    console.warn('Failed to add journal entry', e);
  }
}

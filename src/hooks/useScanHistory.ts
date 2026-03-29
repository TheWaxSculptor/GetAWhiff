import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@getawhiff:scan_history';
const MAX_HISTORY = 50;

export interface HistoryItem {
  barcode: string;
  productName: string;
  brand: string;
  imageUrl: string;
  score: number;
  grade: string;
  scannedAt: string;
}

export async function addToHistory(item: HistoryItem): Promise<void> {
  try {
    const existing = await getHistory();
    // Remove duplicate barcodes, keep newest
    const filtered = existing.filter(h => h.barcode !== item.barcode);
    const updated = [item, ...filtered].slice(0, MAX_HISTORY);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save history:', e);
  }
}

export async function getHistory(): Promise<HistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.warn('Failed to clear history:', e);
  }
}

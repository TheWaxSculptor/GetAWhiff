import AsyncStorage from '@react-native-async-storage/async-storage';
import { StrainInfo } from './strainApi';

const FAVORITES_KEY = '@wakeup_whiff_favorites';

export async function getFavorites(): Promise<StrainInfo[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.warn('Failed to fetch favorites', e);
    return [];
  }
}

export async function addFavorite(strain: StrainInfo): Promise<void> {
  try {
    const favorites = await getFavorites();
    if (!favorites.find(f => f.id === strain.id)) {
      const newFavorites = [...favorites, strain];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    }
  } catch (e) {
    console.warn('Failed to add favorite', e);
  }
}

export async function removeFavorite(id: string): Promise<void> {
  try {
    const favorites = await getFavorites();
    const newFavorites = favorites.filter(f => f.id !== id);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  } catch (e) {
    console.warn('Failed to remove favorite', e);
  }
}

export async function isFavorite(id: string): Promise<boolean> {
  const favorites = await getFavorites();
  return !!favorites.find(f => f.id === id);
}

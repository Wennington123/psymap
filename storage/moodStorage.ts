import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodEntry } from '../types';

const ENTRIES_KEY = '@psymap:moodEntries';
const THEME_KEY = 'psymap-theme';

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([ENTRIES_KEY, THEME_KEY]);
}

export async function getEntries(): Promise<MoodEntry[]> {
  const raw = await AsyncStorage.getItem(ENTRIES_KEY);
  if (!raw) return [];
  return JSON.parse(raw);
}

export async function addEntry(entry: MoodEntry): Promise<void> {
  const entries = await getEntries();
  entries.push(entry);
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export async function deleteEntry(id: string): Promise<void> {
  const entries = await getEntries();
  const filtered = entries.filter(e => e.id !== id);
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(filtered));
}

export async function exportAllData(): Promise<string> {
  const entries = await getEntries();
  const data = {
    exportedAt: new Date().toISOString(),
    app: 'PsyMap',
    version: '1.0.0',
    entries,
  };
  return JSON.stringify(data, null, 2);
}

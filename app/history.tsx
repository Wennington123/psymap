import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SectionList,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import MoodLogItem from '../components/MoodLogItem';
import { getEntries, deleteEntry } from '../storage/moodStorage';
import { MoodEntry } from '../types';

interface Section {
  title: string;
  data: MoodEntry[];
}

export default function HistoryScreen() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  async function loadHistory() {
    const entries = await getEntries();
    entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const grouped = new Map<string, MoodEntry[]>();
    entries.forEach((entry) => {
      const date = new Date(entry.timestamp);
      const key = date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      const existing = grouped.get(key) || [];
      existing.push(entry);
      grouped.set(key, existing);
    });

    const result: Section[] = [];
    grouped.forEach((data, title) => {
      result.push({ title, data });
    });
    setSections(result);
  }

  function handleDelete(id: string, label: string) {
    Alert.alert('Remover registro', `Apagar "${label}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          await deleteEntry(id);
          loadHistory();
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      {sections.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📝</Text>
          <Text style={styles.emptyText}>Nenhum registro ainda</Text>
          <Text style={styles.emptyHint}>Volte à tela inicial e registre sua primeira emoção</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onLongPress={() => handleDelete(item.id, item.emotion.label)}
              activeOpacity={0.8}
            >
              <MoodLogItem entry={item} />
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
          stickySectionHeadersEnabled
          ListHeaderComponent={
            <View style={styles.topBar}>
              <Text style={styles.totalText}>
                {sections.reduce((sum, s) => sum + s.data.length, 0)} registros
              </Text>
              <TouchableOpacity onPress={() => router.push('/statistics' as any)} style={styles.statsBtn}>
                <Text style={styles.statsBtnText}>📊</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  totalText: {
    fontSize: 14,
    color: '#666',
  },
  statsBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  statsBtnText: {
    fontSize: 18,
  },
  sectionHeader: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e94560',
    textTransform: 'capitalize',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
    textAlign: 'center',
  },
});

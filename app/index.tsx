import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import EmotionWheel from '../components/EmotionWheel';
import IntensityPicker from '../components/IntensityPicker';
import CustomEmotionInput from '../components/CustomEmotionInput';
import NoteInput from '../components/NoteInput';
import {
  addEntry,
  addCustomEmotion,
  getCustomEmotions,
  getEntries,
} from '../storage/moodStorage';
import { Emotion, MoodEntry } from '../types';

export default function HomeScreen() {
  const router = useRouter();

  const [step, setStep] = useState<'wheel' | 'intensity' | 'note'>('wheel');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');
  const [customEmotions, setCustomEmotions] = useState<Emotion[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [totalEntries, setTotalEntries] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    const [custom, entries] = await Promise.all([getCustomEmotions(), getEntries()]);
    setCustomEmotions(custom);
    setTotalEntries(entries.length);
  }

  function handleSelectEmotion(emotion: Emotion) {
    setSelectedEmotion(emotion);
    setIntensity(3);
    setNote('');
    setStep('intensity');
  }

  async function handleSaveCustom(emotion: Emotion) {
    await addCustomEmotion(emotion);
    setCustomEmotions(prev => [...prev, emotion]);
  }

  async function handleRegister() {
    if (!selectedEmotion) return;
    const entry: MoodEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      emotion: selectedEmotion,
      intensity,
      note: note.trim() || undefined,
      timestamp: new Date().toISOString(),
    };
    await addEntry(entry);
    setTotalEntries(prev => prev + 1);
    setStep('wheel');
    setSelectedEmotion(null);
    setNote('');
    Alert.alert('Registrado!', `${selectedEmotion.emoji} ${selectedEmotion.label} — intensidade ${intensity}/5`);
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {step === 'wheel' && (
        <>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>PsyMap</Text>
            <Text style={styles.subtitle}>Mapeie suas emoções</Text>
          </View>

          <EmotionWheel
            onSelect={handleSelectEmotion}
            onAddCustom={() => setShowCustomInput(true)}
            customEmotions={customEmotions}
          />

          <CustomEmotionInput
            visible={showCustomInput}
            onClose={() => setShowCustomInput(false)}
            onSave={handleSaveCustom}
          />

          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.historyBtn}
              onPress={() => router.push('/history')}
            >
              <Text style={styles.historyBtnText}>
                📋 Histórico ({totalEntries})
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {step === 'intensity' && selectedEmotion && (
        <View style={styles.stepContainer}>
          <Text style={styles.selectedEmoji}>{selectedEmotion.emoji}</Text>
          <Text style={styles.selectedLabel}>{selectedEmotion.label}</Text>

          <IntensityPicker value={intensity} onChange={setIntensity} />

          <View style={styles.stepButtons}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setStep('wheel')}
            >
              <Text style={styles.backBtnText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => setStep('note')}
            >
              <Text style={styles.nextBtnText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 'note' && (
        <View style={styles.stepContainer}>
          <Text style={styles.selectedEmoji}>{selectedEmotion?.emoji}</Text>
          <Text style={styles.selectedLabel}>
            {selectedEmotion?.label} — {intensity}/5
          </Text>

          <NoteInput value={note} onChange={setNote} visible={true} />

          <View style={styles.stepButtons}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setStep('intensity')}
            >
              <Text style={styles.backBtnText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
              <Text style={styles.registerBtnText}>Registrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#e94560',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  stepContainer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  selectedEmoji: {
    fontSize: 60,
    marginBottom: 8,
  },
  selectedLabel: {
    fontSize: 22,
    fontWeight: '600',
    color: '#e0e0e0',
    marginBottom: 24,
  },
  stepButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  backBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  backBtnText: {
    color: '#888',
    fontSize: 16,
  },
  nextBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#e94560',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    backgroundColor: '#e94560',
  },
  registerBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomActions: {
    alignItems: 'center',
    marginTop: 32,
  },
  historyBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  historyBtnText: {
    color: '#e0e0e0',
    fontSize: 16,
  },
});

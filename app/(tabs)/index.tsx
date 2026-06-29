import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import EmotionWheel from '../../components/EmotionWheel';
import IntensityPicker from '../../components/IntensityPicker';
import CustomEmotionInput from '../../components/CustomEmotionInput';
import NoteInput from '../../components/NoteInput';
import {
  addEntry,
  addCustomEmotion,
  getCustomEmotions,
} from '../../storage/moodStorage';
import { Emotion, MoodEntry } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

export default function HomeScreen() {
  const { colors } = useTheme();

  const [step, setStep] = useState<'wheel' | 'intensity' | 'note'>('wheel');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');
  const [customEmotions, setCustomEmotions] = useState<Emotion[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    const custom = await getCustomEmotions();
    setCustomEmotions(custom);
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
    setStep('wheel');
    setSelectedEmotion(null);
    setNote('');
    Alert.alert('Registrado!', `${selectedEmotion.emoji} ${selectedEmotion.label} — intensidade ${intensity}/5`);
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      keyboardShouldPersistTaps="handled"
    >
      {step === 'wheel' && (
        <>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/icon.png')} style={styles.logoImage} resizeMode="contain" />
            <Text style={[styles.logoText, { color: colors.accent }]}>PsyMap</Text>
            <Text style={[styles.subtitle, { color: colors.textDim }]}>Mapeie suas emoções</Text>
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


        </>
      )}

      {step === 'intensity' && selectedEmotion && (
        <View style={styles.stepContainer}>
          <Text style={styles.selectedEmoji}>{selectedEmotion.emoji}</Text>
          <Text style={[styles.selectedLabel, { color: colors.text }]}>{selectedEmotion.label}</Text>

          <IntensityPicker value={intensity} onChange={setIntensity} />

          <View style={styles.stepButtons}>
            <TouchableOpacity
              style={[styles.backBtn, { borderColor: colors.borderMuted }]}
              onPress={() => setStep('wheel')}
            >
              <Text style={[styles.backBtnText, { color: colors.textSecondary }]}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: colors.accent }]}
              onPress={() => setStep('note')}
            >
              <Text style={[styles.nextBtnText, { color: colors.textOnAccent }]}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 'note' && (
        <View style={styles.stepContainer}>
          <Text style={styles.selectedEmoji}>{selectedEmotion?.emoji}</Text>
          <Text style={[styles.selectedLabel, { color: colors.text }]}>
            {selectedEmotion?.label} — {intensity}/5
          </Text>

          <NoteInput value={note} onChange={setNote} visible={true} />

          <View style={styles.stepButtons}>
            <TouchableOpacity
              style={[styles.backBtn, { borderColor: colors.borderMuted }]}
              onPress={() => setStep('intensity')}
            >
              <Text style={[styles.backBtnText, { color: colors.textSecondary }]}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.registerBtn, { backgroundColor: colors.accent }]} onPress={handleRegister}>
              <Text style={[styles.registerBtnText, { color: colors.textOnAccent }]}>Registrar</Text>
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
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
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
  },
  backBtnText: {
    fontSize: 16,
  },
  nextBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  registerBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  registerBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
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
  getEntries,
} from '../../storage/moodStorage';
import { Emotion, MoodEntry } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../hooks/useGamification';
import { computeStreak } from '../../lib/gamification';
import { awardEntry } from '../../storage/gamification';
import { syncXpDelta } from '../../lib/firebaseRanking';
import { card, radii, spacing, shadow } from '../../constants/ui';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const gamification = useGamification();

  const [step, setStep] = useState<'wheel' | 'intensity' | 'note'>('wheel');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');
  const [customEmotions, setCustomEmotions] = useState<Emotion[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
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

    const prevEntries = await getEntries();
    await addEntry(entry);

    const award = await awardEntry(prevEntries, entry);

    let gamiMessage = '';
    if (award.delta > 0) {
      gamiMessage = `\n+${award.delta} XP`;
    }
    if (award.newBadges.length > 0) {
      gamiMessage += `\nNova conquista desbloqueada! 🎉`;
    }

    if (user && award.delta > 0) {
      const streakAfter = computeStreak([...prevEntries, entry]);
      syncXpDelta(user, award.delta, streakAfter).catch(() => {});
    }

    await gamification.refresh();

    setStep('wheel');
    setSelectedEmotion(null);
    setNote('');
    Alert.alert('Registrado!', `${selectedEmotion.emoji} ${selectedEmotion.label} — intensidade ${intensity}/5${gamiMessage}`);
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      keyboardShouldPersistTaps="handled"
    >
      {step === 'wheel' && (
        <>
          <View style={styles.greeting}>
            <Text style={[styles.greetingTitle, { color: colors.text }]}>Olá 👋</Text>
            <Text style={[styles.greetingSubtitle, { color: colors.textDim }]}>
              Como você está se sentindo?
            </Text>
          </View>

          <View style={[styles.gamiCard, card(colors)]}>
            <View style={styles.gamiRow}>
              <Text style={[styles.gamiStreak, { color: colors.accent }]}>
                🔥 {gamification.streak}
              </Text>
              <Text style={[styles.gamiLevel, { color: colors.textSecondary }]}>
                Nível {gamification.level} · {gamification.xpTotal} XP
              </Text>
            </View>
            <View style={[styles.gamiBarTrack, { backgroundColor: colors.background }]}>
              <View
                style={[
                  styles.gamiBarFill,
                  { backgroundColor: colors.accent, width: `${Math.round(gamification.levelProgress * 100)}%` },
                ]}
              />
            </View>
            <Text style={[styles.gamiNext, { color: colors.textDim }]}>
              {gamification.toNext} XP para o nível {gamification.level + 1}
            </Text>
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
              style={styles.backBtn}
              onPress={() => setStep('wheel')}
            >
              <Text style={[styles.backBtnText, { color: colors.textSecondary }]}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: colors.accent }]}
              onPress={() => setStep('note')}
            >
              <Text style={[styles.primaryBtnText, { color: colors.textOnAccent }]}>Continuar</Text>
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
              style={styles.backBtn}
              onPress={() => setStep('intensity')}
            >
              <Text style={[styles.backBtnText, { color: colors.textSecondary }]}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: colors.accent }]}
              onPress={handleRegister}
            >
              <Text style={[styles.primaryBtnText, { color: colors.textOnAccent }]}>Registrar</Text>
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
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  greeting: {
    marginBottom: spacing.md,
  },
  greetingTitle: {
    fontSize: 34,
    fontWeight: '800',
  },
  greetingSubtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  gamiCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  gamiRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gamiStreak: {
    fontSize: 22,
    fontWeight: '800',
  },
  gamiLevel: {
    fontSize: 13,
    fontWeight: '600',
  },
  gamiBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  gamiBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  gamiNext: {
    fontSize: 11,
    marginTop: 6,
  },
  stepContainer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  selectedEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  selectedLabel: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  stepButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: spacing.lg,
    width: '100%',
    maxWidth: 320,
  },
  backBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radii.btn,
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  nextBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.btn,
    alignItems: 'center',
    ...shadow(),
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

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
import EmojiRenderer from '../../components/EmojiRenderer';
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
import { card, radii, spacing, shadow, fonts, displayFont } from '../../constants/ui';

/* Cantos: temas pixel usam raio pequeno; os modernos usam pill. */
function displayRadius(colors: ReturnType<typeof useTheme>['colors']): number {
  return colors.style === 'pixel' ? 6 : 999;
}

export default function HomeScreen() {
  const { colors, emojiPack } = useTheme();
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
            <Text style={[styles.greetingTitle, { color: colors.text, fontFamily: displayFont(colors, 'extrabold') }]}>Olá 👋</Text>
            <Text style={[styles.greetingSubtitle, { color: colors.textDim, fontFamily: displayFont(colors, 'regular') }]}>
              Como você está se sentindo?
            </Text>
          </View>

          <View style={[styles.gamiCard, card(colors)]}>
            <View style={styles.gamiRow}>
              <View>
                <Text style={[styles.gamiLabel, { color: colors.textDim, fontFamily: displayFont(colors, 'bold') }]}>Sequência</Text>
                <Text style={[styles.gamiStreak, { color: colors.text, fontFamily: displayFont(colors, 'extrabold') }]}>
                  🔥 {gamification.streak}
                  <Text style={[styles.gamiStreakUnit, { color: colors.textSecondary, fontFamily: displayFont(colors, 'semibold') }]}>
                    {gamification.streak === 1 ? ' dia' : ' dias'}
                  </Text>
                </Text>
              </View>
              <View style={[styles.levelPill, { backgroundColor: colors.accent + '1f', borderColor: colors.accent + '60', borderRadius: displayRadius(colors) }]}>
                <Text style={[styles.levelPillText, { color: colors.accent, fontFamily: displayFont(colors, 'bold') }]}>Nível {gamification.level}</Text>
              </View>
            </View>
            <View style={[styles.gamiBarTrack, { backgroundColor: colors.background }]}>
              <View
                style={[
                  styles.gamiBarFill,
                  { backgroundColor: colors.accent, width: `${Math.round(gamification.levelProgress * 100)}%` },
                ]}
              />
            </View>
            <View style={styles.gamiFooter}>
              <Text style={[styles.gamiNext, { color: colors.textDim }]}>
                {gamification.toNext} XP para o nível {gamification.level + 1}
              </Text>
              <Text style={[styles.gamiNext, { color: colors.textDim }]}>{gamification.xpTotal} XP</Text>
            </View>
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
          <EmojiRenderer
            source={emojiPack[selectedEmotion.id as keyof typeof emojiPack] ?? selectedEmotion.emoji}
            size={64}
          />
          <Text style={[styles.selectedLabel, { color: colors.text, fontFamily: displayFont(colors, 'bold') }]}>{selectedEmotion.label}</Text>

          <IntensityPicker value={intensity} onChange={setIntensity} />

          <View style={styles.stepButtons}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setStep('wheel')}
            >
              <Text style={[styles.backBtnText, { color: colors.textSecondary, fontFamily: displayFont(colors, 'semibold') }]}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: colors.accent, borderRadius: radii.btn }]}
              onPress={() => setStep('note')}
            >
              <Text style={[styles.primaryBtnText, { color: colors.textOnAccent, fontFamily: displayFont(colors, 'bold') }]}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 'note' && (
        <View style={styles.stepContainer}>
          <EmojiRenderer
            source={
              selectedEmotion
                ? emojiPack[selectedEmotion.id as keyof typeof emojiPack] ?? selectedEmotion.emoji
                : '❓'
            }
            size={64}
          />
          <Text style={[styles.selectedLabel, { color: colors.text, fontFamily: displayFont(colors, 'bold') }]}>
            {selectedEmotion?.label} — {intensity}/5
          </Text>

          <NoteInput value={note} onChange={setNote} visible={true} />

          <View style={styles.stepButtons}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setStep('intensity')}
            >
              <Text style={[styles.backBtnText, { color: colors.textSecondary, fontFamily: displayFont(colors, 'semibold') }]}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: colors.accent, borderRadius: radii.btn }]}
              onPress={handleRegister}
            >
              <Text style={[styles.primaryBtnText, { color: colors.textOnAccent, fontFamily: displayFont(colors, 'bold') }]}>Registrar</Text>
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
    marginBottom: spacing.lg,
  },
  greetingTitle: {
    fontSize: 32,
    fontFamily: fonts.extrabold,
    letterSpacing: -0.5,
  },
  greetingSubtitle: {
    fontSize: 15,
    fontFamily: fonts.regular,
    marginTop: 4,
  },
  gamiCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  gamiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  gamiLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  gamiStreak: {
    fontSize: 28,
    fontFamily: fonts.extrabold,
    letterSpacing: -0.5,
  },
  gamiStreakUnit: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    letterSpacing: 0,
  },
  levelPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  levelPillText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    letterSpacing: 0.3,
  },
  gamiBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  gamiBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  gamiFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  gamiNext: {
    fontSize: 11,
    fontFamily: fonts.regular,
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
    fontFamily: fonts.bold,
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

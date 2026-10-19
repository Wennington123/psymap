import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Emotion } from '../types';
import { BASE_EMOTIONS } from '../constants/emotions';
import { useTheme } from '../contexts/ThemeContext';
import { EmojiSource } from '../constants/colors';
import { card, radii, spacing, shadow } from '../constants/ui';
import EmojiRenderer from './EmojiRenderer';

interface Props {
  onSelect: (emotion: Emotion) => void;
  onAddCustom: () => void;
  customEmotions: Emotion[];
}

export default function EmotionWheel({ onSelect, onAddCustom, customEmotions }: Props) {
  const { colors, emojiPack } = useTheme();

  const itemStyle = {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    ...shadow(),
  } as const;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Selecione uma Emoção</Text>
      <View style={styles.grid}>
        {BASE_EMOTIONS.map((emotion) => {
          const emojiSource: EmojiSource = emojiPack[emotion.id as keyof typeof emojiPack] ?? emotion.emoji;
          return (
            <TouchableOpacity
              key={emotion.id}
              style={[styles.emotionItem, itemStyle]}
              onPress={() => onSelect(emotion)}
              activeOpacity={0.7}
            >
              <EmojiRenderer source={emojiSource} size={28} />
              <Text style={[styles.emotionLabel, { color: colors.textSecondary }]}>{emotion.label}</Text>
            </TouchableOpacity>
          );
        })}
        {customEmotions.map((emotion) => (
          <TouchableOpacity
            key={emotion.id}
            style={[styles.emotionItem, itemStyle]}
            onPress={() => onSelect(emotion)}
            activeOpacity={0.7}
          >
            <EmojiRenderer source={emotion.emoji} size={28} />
            <Text style={[styles.emotionLabel, { color: colors.textSecondary }]}>{emotion.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.emotionItem, itemStyle, { borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.accent }]}
          onPress={onAddCustom}
          activeOpacity={0.7}
        >
          <Text style={[styles.emoji, { color: colors.accent }]}>+</Text>
          <Text style={[styles.emotionLabel, { color: colors.textSecondary }]}>Personalizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  emotionItem: {
    width: 82,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  emotionLabel: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
});

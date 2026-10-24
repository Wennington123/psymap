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
import { spacing, shadow, fonts, displayFont } from '../constants/ui';
import EmojiRenderer from './EmojiRenderer';

interface Props {
  onSelect: (emotion: Emotion) => void;
}

export default function EmotionWheel({ onSelect }: Props) {
  const { colors, emojiPack } = useTheme();

  const itemStyle = {
    backgroundColor: colors.surface,
    borderRadius: colors.style === 'pixel' ? 6 : 999,
    borderWidth: colors.style === 'pixel' ? 2 : 1,
    borderColor: colors.style === 'pixel' ? colors.border : colors.border + '55',
    ...(colors.style === 'pixel' ? {} : shadow()),
  } as const;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textDim, fontFamily: displayFont(colors, 'bold') }]}>Selecione uma emoção</Text>
      <View style={styles.grid}>
        {BASE_EMOTIONS.map((emotion) => {
          const emojiSource: EmojiSource = emojiPack[emotion.id as keyof typeof emojiPack] ?? emotion.emoji;
          return (
            <TouchableOpacity
              key={emotion.id}
              style={[styles.emotionItem, itemStyle]}
              onPress={() => onSelect(emotion)}
              activeOpacity={0.65}
            >
              <EmojiRenderer source={emojiSource} size={30} />
              <Text
                style={[styles.emotionLabel, { color: colors.textSecondary, fontFamily: displayFont(colors, 'semibold') }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
              >
                {emotion.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  title: {
    fontSize: 12,
    fontFamily: fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  emotionItem: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  emotionLabel: {
    fontSize: 10,
    fontFamily: fonts.semibold,
    marginTop: 3,
    textAlign: 'center',
  },
});

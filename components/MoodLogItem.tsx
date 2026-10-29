import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MoodEntry } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { EmojiSource } from '../constants/colors';
import { shadow, radii } from '../constants/ui';
import { emotionLabel } from '../constants/emotions';
import i18n from '../lib/i18n';
import EmojiRenderer from './EmojiRenderer';

interface Props {
  entry: MoodEntry;
}

export default function MoodLogItem({ entry }: Props) {
  const { colors, emojiPack } = useTheme();
  const time = new Date(entry.timestamp);
  const timeStr = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const emojiSource: EmojiSource =
    !entry.emotion.isCustom
      ? (emojiPack[entry.emotion.id as keyof typeof emojiPack] ?? entry.emotion.emoji)
      : entry.emotion.emoji;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.left}>
        <EmojiRenderer source={emojiSource} size={30} />
      </View>
      <View style={styles.center}>
        <Text style={[styles.emotionName, { color: colors.text }]}>{emotionLabel(entry.emotion)}</Text>
        {entry.note ? <Text style={[styles.note, { color: colors.textSecondary }]}>{entry.note}</Text> : null}
      </View>
      <View style={styles.right}>
        <Text style={[styles.time, { color: colors.textDim }]}>{timeStr}</Text>
        <View style={styles.intensityDots}>
          {[1, 2, 3, 4, 5].map((level) => (
            <View
              key={level}
              style={[styles.miniDot, level <= entry.intensity ? { backgroundColor: colors.accent } : { backgroundColor: colors.borderMuted }]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radii.card,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    alignItems: 'center',
    ...shadow(),
  },
  left: {
    marginRight: 12,
  },
  emoji: {
    fontSize: 30,
  },
  center: {
    flex: 1,
  },
  emotionName: {
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 13,
    marginTop: 3,
  },
  right: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    marginBottom: 6,
  },
  intensityDots: {
    flexDirection: 'row',
    gap: 4,
  },
  miniDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

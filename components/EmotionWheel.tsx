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

interface Props {
  onSelect: (emotion: Emotion) => void;
  onAddCustom: () => void;
  customEmotions: Emotion[];
}

export default function EmotionWheel({ onSelect, onAddCustom, customEmotions }: Props) {
  const { colors } = useTheme();
  const allEmotions = [...BASE_EMOTIONS, ...customEmotions];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Como você está se sentindo?</Text>
      <View style={styles.grid}>
        {allEmotions.map((emotion) => (
          <TouchableOpacity
            key={emotion.id}
            style={[styles.emotionItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => onSelect(emotion)}
            activeOpacity={0.6}
          >
            <Text style={styles.emoji}>{emotion.emoji}</Text>
            <Text style={[styles.emotionLabel, { color: colors.textSecondary }]}>{emotion.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.emotionItem, styles.addCustom, { backgroundColor: colors.surface, borderColor: colors.accent }]}
          onPress={onAddCustom}
          activeOpacity={0.6}
        >
          <Text style={styles.emoji}>+</Text>
          <Text style={[styles.emotionLabel, { color: colors.textSecondary }]}>Personalizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  emotionItem: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  addCustom: {
    borderStyle: 'dashed',
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

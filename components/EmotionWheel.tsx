import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Emotion } from '../types';
import { BASE_EMOTIONS } from '../constants/emotions';

interface Props {
  onSelect: (emotion: Emotion) => void;
  onAddCustom: () => void;
  customEmotions: Emotion[];
}

export default function EmotionWheel({ onSelect, onAddCustom, customEmotions }: Props) {
  const allEmotions = [...BASE_EMOTIONS, ...customEmotions];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Como você está se sentindo?</Text>
      <View style={styles.grid}>
        {allEmotions.map((emotion) => (
          <TouchableOpacity
            key={emotion.id}
            style={styles.emotionItem}
            onPress={() => onSelect(emotion)}
            activeOpacity={0.6}
          >
            <Text style={styles.emoji}>{emotion.emoji}</Text>
            <Text style={styles.emotionLabel}>{emotion.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.emotionItem, styles.addCustom]}
          onPress={onAddCustom}
          activeOpacity={0.6}
        >
          <Text style={styles.emoji}>+</Text>
          <Text style={styles.emotionLabel}>Personalizar</Text>
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
    color: '#e0e0e0',
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
    backgroundColor: '#16213e',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  addCustom: {
    borderStyle: 'dashed',
    borderColor: '#e94560',
  },
  emoji: {
    fontSize: 28,
  },
  emotionLabel: {
    fontSize: 10,
    color: '#a0a0b0',
    marginTop: 4,
    textAlign: 'center',
  },
});

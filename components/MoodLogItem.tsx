import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MoodEntry } from '../types';

interface Props {
  entry: MoodEntry;
}

export default function MoodLogItem({ entry }: Props) {
  const time = new Date(entry.timestamp);
  const timeStr = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.emoji}>{entry.emotion.emoji}</Text>
      </View>
      <View style={styles.center}>
        <Text style={styles.emotionName}>{entry.emotion.label}</Text>
        {entry.note ? <Text style={styles.note}>{entry.note}</Text> : null}
      </View>
      <View style={styles.right}>
        <Text style={styles.time}>{timeStr}</Text>
        <View style={styles.intensityDots}>
          {[1, 2, 3, 4, 5].map((level) => (
            <View
              key={level}
              style={[
                styles.miniDot,
                level <= entry.intensity ? styles.miniDotActive : styles.miniDotInactive,
              ]}
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
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
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
    color: '#e0e0e0',
  },
  note: {
    fontSize: 13,
    color: '#888',
    marginTop: 3,
  },
  right: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#666',
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
    borderWidth: 1,
  },
  miniDotActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  miniDotInactive: {
    backgroundColor: 'transparent',
    borderColor: '#444',
  },
});

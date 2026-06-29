import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MoodEntry } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  entry: MoodEntry;
}

export default function MoodLogItem({ entry }: Props) {
  const { colors } = useTheme();
  const time = new Date(entry.timestamp);
  const timeStr = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.left}>
        <Text style={styles.emoji}>{entry.emotion.emoji}</Text>
      </View>
      <View style={styles.center}>
        <Text style={[styles.emotionName, { color: colors.text }]}>{entry.emotion.label}</Text>
        {entry.note ? <Text style={[styles.note, { color: colors.textSecondary }]}>{entry.note}</Text> : null}
      </View>
      <View style={styles.right}>
        <Text style={[styles.time, { color: colors.textDim }]}>{timeStr}</Text>
        <View style={styles.intensityDots}>
          {[1, 2, 3, 4, 5].map((level) => (
            <View
              key={level}
              style={[
                styles.miniDot,
                level <= entry.intensity
                  ? { backgroundColor: colors.accent, borderColor: colors.accent }
                  : { backgroundColor: 'transparent', borderColor: colors.borderMuted },
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
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    alignItems: 'center',
    borderWidth: 1,
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
    borderWidth: 1,
  },
});

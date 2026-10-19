import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

const LABELS = ['Muito fraco', 'Fraco', 'Moderado', 'Forte', 'Muito intenso'];

export default function IntensityPicker({ value, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Qual a intensidade?</Text>
      <View style={styles.dots}>
        {[1, 2, 3, 4, 5].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => onChange(level)}
            style={[styles.dot, { backgroundColor: level <= value ? colors.accent : colors.borderMuted }]}
            activeOpacity={0.7}
          />
        ))}
      </View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{LABELS[value - 1]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 14,
  },
  dot: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  label: {
    fontSize: 13,
    marginTop: 12,
  },
});

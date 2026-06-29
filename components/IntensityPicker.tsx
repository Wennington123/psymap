import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

const LABELS = ['Muito fraco', 'Fraco', 'Moderado', 'Forte', 'Muito intenso'];

export default function IntensityPicker({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qual a intensidade?</Text>
      <View style={styles.dots}>
        {[1, 2, 3, 4, 5].map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => onChange(level)}
            style={[
              styles.dot,
              level <= value ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
      <Text style={styles.label}>{LABELS[value - 1]}</Text>
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
    color: '#e0e0e0',
    marginBottom: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 14,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
  },
  dotActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  dotInactive: {
    backgroundColor: 'transparent',
    borderColor: '#444',
  },
  label: {
    fontSize: 13,
    color: '#888',
    marginTop: 12,
  },
});

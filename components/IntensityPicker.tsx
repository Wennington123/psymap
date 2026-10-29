import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import i18n from '../lib/i18n';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

const LABEL_KEYS = ['intensidade.muitoFraco', 'intensidade.fraco', 'intensidade.moderado', 'intensidade.forte', 'intensidade.muitoIntenso'];

export default function IntensityPicker({ value, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{i18n.t('intensidade.titulo')}</Text>
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
      <Text style={[styles.label, { color: colors.textSecondary }]}>{i18n.t(LABEL_KEYS[value - 1])}</Text>
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

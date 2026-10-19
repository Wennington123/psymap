import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DateRangePreset, RANGE_LABELS } from '../../lib/dateRange';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  selected: DateRangePreset;
  onSelect: (range: DateRangePreset) => void;
}

const OPTIONS: DateRangePreset[] = ['all', '7d', '30d', '90d'];

export default function RangeSelector({ selected, onSelect }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[
            styles.segment,
            {
              backgroundColor: selected === opt ? colors.accent : colors.surface,
            },
          ]}
          onPress={() => onSelect(opt)}
          activeOpacity={0.7}
        >
          <Text style={[styles.segmentText, { color: selected === opt ? colors.textOnAccent : colors.textSecondary }]}>
            {RANGE_LABELS[opt]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  segment: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

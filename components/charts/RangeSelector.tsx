import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DateRangePreset, RANGE_LABELS } from '../../lib/dateRange';

interface Props {
  selected: DateRangePreset;
  onSelect: (range: DateRangePreset) => void;
}

const OPTIONS: DateRangePreset[] = ['all', '7d', '30d', '90d'];

export default function RangeSelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {OPTIONS.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.segment, selected === opt && styles.segmentActive]}
          onPress={() => onSelect(opt)}
          activeOpacity={0.7}
        >
          <Text style={[styles.segmentText, selected === opt && styles.segmentTextActive]}>
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
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  segmentActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  segmentTextActive: {
    color: '#fff',
  },
});

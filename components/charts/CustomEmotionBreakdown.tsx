import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EmotionStat } from '../../lib/stats';
import EmotionFrequencyChart from './EmotionFrequencyChart';

interface Props {
  data: EmotionStat[];
}

export default function CustomEmotionBreakdown({ data }: Props) {
  if (data.length === 0) return null;
  return (
    <View style={styles.container}>
      <EmotionFrequencyChart data={data} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

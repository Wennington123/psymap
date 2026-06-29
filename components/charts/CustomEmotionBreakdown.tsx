import React from 'react';
import { View, StyleSheet } from 'react-native';
import EmotionFrequencyChart from './EmotionFrequencyChart';
import { EmotionStat } from '../../lib/stats';
import StatsSection from './StatsSection';

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
  container: {},
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { DayOfWeekStat } from '../../lib/stats';

interface Props {
  data: DayOfWeekStat[];
}

export default function DayOfWeekChart({ data }: Props) {
  if (data.length === 0) return null;

  const barData = data.map((stat) => ({
    value: stat.avgIntensity,
    label: stat.dayLabel,
    frontColor: stat.count > 0 ? '#e94560' : '#2a2a4e',
    topLabelComponent: () =>
      stat.count > 0 ? (
        <Text style={{ color: '#e0e0e0', fontSize: 10, fontWeight: '600' }}>{stat.avgIntensity}</Text>
      ) : null,
  }));

  return (
    <View style={styles.container}>
      <BarChart
        data={barData}
        barWidth={32}
        spacing={12}
        roundedTop
        roundedBottom
        hideRules
        yAxisTextStyle={styles.axisLabel}
        noOfSections={4}
        maxValue={5}
        stepValue={1}
        isAnimated
        showReferenceLine1
        referenceLine1Position={0}
        referenceLine1Config={{ color: '#2a2a4e', thickness: 1 }}
      />
      <Text style={styles.hint}>Intensidade média por dia da semana</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  barTop: {
    color: '#e0e0e0',
    fontSize: 10,
    fontWeight: '600',
  },
  barLabel: {
    color: '#666',
    fontSize: 10,
  },
  axisLabel: {
    color: '#666',
    fontSize: 10,
  },
  hint: {
    color: '#555',
    fontSize: 11,
    marginTop: 8,
  },
});

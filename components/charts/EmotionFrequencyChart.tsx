import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { EmotionStat } from '../../lib/stats';

const PALLETTE = ['#e94560', '#f77f00', '#fcbf49', '#06d6a0', '#118ab2', '#9b5de5', '#f15bb5', '#073b4c'];

interface Props {
  data: EmotionStat[];
}

export default function EmotionFrequencyChart({ data }: Props) {
  if (data.length === 0) return null;

  const top10 = data.slice(0, 10);
  const maxCount = top10[0]?.count || 1;

  const barData = top10.map((stat, i) => ({
    value: stat.count,
    label: stat.emoji,
    frontColor: PALLETTE[i % PALLETTE.length],
    topLabelComponent: () => (
      <Text style={styles.barTopLabel}>{stat.count}</Text>
    ),
  }));

  return (
    <View style={styles.container}>
      <BarChart
        data={barData}
        barWidth={28}
        spacing={16}
        roundedTop
        roundedBottom
        hideRules
        xAxisLabelTextStyle={{ color: '#666', fontSize: 10 }}
        yAxisTextStyle={{ color: '#666', fontSize: 10 }}
        yAxisLabelSuffix=""
        noOfSections={4}
        maxValue={maxCount}
        isAnimated
        showReferenceLine1
        referenceLine1Position={0}
        referenceLine1Config={{ color: '#2a2a4e', thickness: 1 }}
      />
      <View style={styles.legend}>
        {top10.map((stat, i) => (
          <View key={stat.emotionId} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: PALLETTE[i % PALLETTE.length] }]} />
            <Text style={styles.legendText} numberOfLines={1}>
              {stat.emoji} {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  barTopLabel: {
    color: '#e0e0e0',
    fontSize: 10,
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: '#a0a0b0',
    fontSize: 11,
    maxWidth: 100,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { EmotionStat } from '../../lib/stats';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  data: EmotionStat[];
}

export default function EmotionFrequencyChart({ data }: Props) {
  const { colors } = useTheme();

  if (data.length === 0) return null;

  const top10 = data.slice(0, 10);
  const maxCount = top10[0]?.count || 1;

  const barData = top10.map((stat, i) => ({
    value: stat.count,
    label: stat.emoji,
    frontColor: colors.chartPalette[i % colors.chartPalette.length],
    topLabelComponent: () => (
      <Text style={[styles.barTopLabel, { color: colors.text }]}>{stat.count}</Text>
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
        xAxisLabelTextStyle={{ color: colors.textDim, fontSize: 10 }}
        yAxisTextStyle={{ color: colors.textDim, fontSize: 10 }}
        yAxisLabelSuffix=""
        noOfSections={4}
        maxValue={maxCount}
        isAnimated
        showReferenceLine1
        referenceLine1Position={0}
        referenceLine1Config={{ color: colors.chartAxis, thickness: 1 }}
      />
      <View style={styles.legend}>
        {top10.map((stat, i) => (
          <View key={stat.emotionId} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.chartPalette[i % colors.chartPalette.length] }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]} numberOfLines={1}>
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
    fontSize: 11,
    maxWidth: 100,
  },
});

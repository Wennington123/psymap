import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { EmotionStat } from '../../lib/stats';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  data: EmotionStat[];
}

export default function MoodDistributionChart({ data }: Props) {
  const { colors } = useTheme();

  if (data.length === 0) return null;

  const total = data.reduce((sum, s) => sum + s.count, 0);

  const pieData = data.map((stat, i) => ({
    value: stat.count,
    color: colors.chartPalette[i % colors.chartPalette.length],
    text: `${stat.percentage}%`,
    textColor: colors.text,
    textSize: 11,
    focused: i === 0,
    label: stat.emoji,
  }));

  return (
    <View style={styles.container}>
      <PieChart
        data={pieData}
        donut
        radius={100}
        innerRadius={60}
        innerCircleColor={colors.background}
        centerLabelComponent={() => (
          <View style={styles.center}>
            <Text style={[styles.centerNumber, { color: colors.text }]}>{total}</Text>
            <Text style={[styles.centerLabel, { color: colors.textDim }]}>registros</Text>
          </View>
        )}
      />
      <View style={styles.legend}>
        {data.map((stat, i) => (
          <View key={stat.emotionId} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.chartPalette[i % colors.chartPalette.length] }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              {stat.emoji} {stat.label} ({stat.count})
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
  center: {
    alignItems: 'center',
  },
  centerNumber: {
    fontSize: 30,
    fontWeight: '700',
  },
  centerLabel: {
    fontSize: 11,
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
  },
});

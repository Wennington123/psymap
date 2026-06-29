import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { EmotionStat } from '../../lib/stats';

const PALLETTE = ['#e94560', '#f77f00', '#fcbf49', '#06d6a0', '#118ab2', '#9b5de5', '#f15bb5', '#073b4c'];

interface Props {
  data: EmotionStat[];
}

export default function MoodDistributionChart({ data }: Props) {
  if (data.length === 0) return null;

  const total = data.reduce((sum, s) => sum + s.count, 0);

  const pieData = data.map((stat, i) => ({
    value: stat.count,
    color: PALLETTE[i % PALLETTE.length],
    text: `${stat.percentage}%`,
    textColor: '#1a1a2e',
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
        innerCircleColor="#1a1a2e"
        centerLabelComponent={() => (
          <View style={styles.center}>
            <Text style={styles.centerNumber}>{total}</Text>
            <Text style={styles.centerLabel}>registros</Text>
          </View>
        )}
      />
      <View style={styles.legend}>
        {data.map((stat, i) => (
          <View key={stat.emotionId} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: PALLETTE[i % PALLETTE.length] }]} />
            <Text style={styles.legendText}>
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
    color: '#e0e0e0',
  },
  centerLabel: {
    fontSize: 11,
    color: '#666',
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
  },
});

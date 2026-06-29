import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { HourOfDayStat } from '../../lib/stats';

interface Props {
  data: HourOfDayStat[];
}

export default function HourOfDayChart({ data }: Props) {
  if (data.length === 0) return null;

  const lineData = data.map((stat) => ({
    value: stat.avgIntensity,
    label: stat.hour % 3 === 0 ? `${stat.hour}h` : '',
    labelTextStyle: styles.labelText,
  }));

  const maxVal = Math.max(...data.map((d) => d.avgIntensity), 1);

  return (
    <View style={styles.container}>
      <LineChart
        data={lineData}
        width={300}
        height={160}
        color="#e94560"
        thickness={2}
        startFillColor="#e9456020"
        endFillColor="#e9456000"
        startOpacity={0.3}
        endOpacity={0}
        spacing={10}
        initialSpacing={10}
        yAxisColor="#2a2a4e"
        xAxisColor="#2a2a4e"
        yAxisTextStyle={styles.axisLabel}
        noOfSections={4}
        maxValue={maxVal > 5 ? maxVal : 5}
        stepValue={1}
        curved
        isAnimated
        hideDataPoints
        rulesColor="#2a2a4e"
        rulesType="solid"
        showReferenceLine1
        referenceLine1Position={0}
        referenceLine1Config={{ color: '#2a2a4e', thickness: 1 }}
      />
      <Text style={styles.hint}>Intensidade média por hora do dia</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  axisLabel: {
    color: '#666',
    fontSize: 9,
  },
  labelText: {
    color: '#666',
    fontSize: 9,
  },
  hint: {
    color: '#555',
    fontSize: 11,
    marginTop: 8,
  },
});

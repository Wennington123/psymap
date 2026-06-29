import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { TimeSeriesPoint } from '../../lib/stats';

interface Props {
  data: TimeSeriesPoint[];
}

export default function IntensityTrendChart({ data }: Props) {
  if (data.length < 2) return null;

  const lineData = data.map((point) => {
    const d = new Date(point.date + 'T12:00:00');
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    return {
      value: point.avgIntensity,
      label: `${day}/${month}`,
      dataPointText: point.avgIntensity.toString(),
    };
  });

  return (
    <View style={styles.container}>
      <LineChart
        data={lineData}
        width={300}
        height={180}
        color="#e94560"
        thickness={2}
        startFillColor="#e9456020"
        endFillColor="#e9456000"
        startOpacity={0.4}
        endOpacity={0}
        spacing={40}
        initialSpacing={10}
        yAxisColor="#2a2a4e"
        xAxisColor="#2a2a4e"
        yAxisTextStyle={styles.axisLabel}
        xAxisLabelTextStyle={styles.axisLabel}
        noOfSections={4}
        maxValue={5}
        stepValue={1}
        yAxisLabelTexts={['', '1', '2', '3', '4', '5']}
        curved
        isAnimated
        dataPointsColor="#e94560"
        dataPointsRadius={3}
        textColor="#e0e0e0"
        textFontSize={10}
        rulesColor="#2a2a4e"
        rulesType="solid"
        showReferenceLine1
        referenceLine1Position={3}
        referenceLine1Config={{ color: '#e9456040', thickness: 1, dashWidth: 5, dashGap: 5 }}
      />
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
});

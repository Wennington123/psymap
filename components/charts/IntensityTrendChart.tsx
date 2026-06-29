import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { TimeSeriesPoint } from '../../lib/stats';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  data: TimeSeriesPoint[];
}

export default function IntensityTrendChart({ data }: Props) {
  const { colors } = useTheme();

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
        color={colors.accent}
        thickness={2}
        startFillColor={colors.accent + '20'}
        endFillColor={colors.accent + '00'}
        startOpacity={0.4}
        endOpacity={0}
        spacing={40}
        initialSpacing={10}
        yAxisColor={colors.chartAxis}
        xAxisColor={colors.chartAxis}
        yAxisTextStyle={{ color: colors.textDim, fontSize: 9 }}
        xAxisLabelTextStyle={{ color: colors.textDim, fontSize: 9 }}
        noOfSections={4}
        maxValue={5}
        stepValue={1}
        yAxisLabelTexts={['', '1', '2', '3', '4', '5']}
        curved
        isAnimated
        dataPointsColor={colors.accent}
        dataPointsRadius={3}
        textColor={colors.text}
        textFontSize={10}
        rulesColor={colors.chartAxis}
        rulesType="solid"
        showReferenceLine1
        referenceLine1Position={3}
        referenceLine1Config={{ color: colors.accent + '40', thickness: 1, dashWidth: 5, dashGap: 5 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});

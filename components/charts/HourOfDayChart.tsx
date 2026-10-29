import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { HourOfDayStat } from '../../lib/stats';
import { useTheme } from '../../contexts/ThemeContext';
import i18n from '../../lib/i18n';

interface Props {
  data: HourOfDayStat[];
}

export default function HourOfDayChart({ data }: Props) {
  const { colors } = useTheme();

  if (data.length === 0) return null;

  const lineData = data.map((stat) => ({
    value: stat.avgIntensity,
    label: stat.hour % 3 === 0 ? `${stat.hour}h` : '',
  }));

  const maxVal = Math.max(...data.map((d) => d.avgIntensity), 1);

  return (
    <View style={styles.container}>
      <LineChart
        data={lineData}
        width={300}
        height={160}
        color={colors.accent}
        thickness={2}
        startFillColor={colors.accent + '20'}
        endFillColor={colors.accent + '00'}
        startOpacity={0.3}
        endOpacity={0}
        spacing={10}
        initialSpacing={10}
        yAxisColor={colors.chartAxis}
        xAxisColor={colors.chartAxis}
        yAxisTextStyle={{ color: colors.textDim, fontSize: 9 }}
        xAxisLabelTextStyle={{ color: colors.textDim, fontSize: 9 }}
        noOfSections={4}
        maxValue={maxVal > 5 ? maxVal : 5}
        stepValue={1}
        curved
        isAnimated
        hideDataPoints
        rulesColor={colors.chartAxis}
        rulesType="solid"
        showReferenceLine1
        referenceLine1Position={0}
        referenceLine1Config={{ color: colors.chartAxis, thickness: 1 }}
      />
      <Text style={[styles.hint, { color: colors.textDim }]}>{i18n.t('stats.intensidadeMediaHora')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  hint: {
    fontSize: 11,
    marginTop: 8,
  },
});

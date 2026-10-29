import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { DayOfWeekStat } from '../../lib/stats';
import { useTheme } from '../../contexts/ThemeContext';
import i18n from '../../lib/i18n';

interface Props {
  data: DayOfWeekStat[];
}

export default function DayOfWeekChart({ data }: Props) {
  const { colors } = useTheme();

  if (data.length === 0) return null;

  const barData = data.map((stat) => ({
    value: stat.avgIntensity,
    label: stat.dayLabel,
    frontColor: stat.count > 0 ? colors.accent : colors.surface,
    topLabelComponent: () =>
      stat.count > 0 ? (
        <Text style={{ color: colors.text, fontSize: 10, fontWeight: '600' }}>{stat.avgIntensity}</Text>
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
        yAxisTextStyle={{ color: colors.textDim, fontSize: 10 }}
        noOfSections={4}
        maxValue={5}
        stepValue={1}
        isAnimated
        showReferenceLine1
        referenceLine1Position={0}
        referenceLine1Config={{ color: colors.chartAxis, thickness: 1 }}
      />
      <Text style={[styles.hint, { color: colors.textDim }]}>{i18n.t('stats.intensidadeMediaSemana')}</Text>
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

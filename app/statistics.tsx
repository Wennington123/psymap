import React, { useState, useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getEntries } from '../storage/moodStorage';
import { MoodEntry } from '../types';
import { DateRangePreset, filterByRange } from '../lib/dateRange';
import {
  computeSummary,
  computeEmotionFrequency,
  computeIntensityTrend,
  computeDayOfWeek,
  computeHourOfDay,
  computeCustomStats,
} from '../lib/stats';
import RangeSelector from '../components/charts/RangeSelector';
import StatsSummaryCards from '../components/charts/StatsSummaryCards';
import StatsSection from '../components/charts/StatsSection';
import EmotionFrequencyChart from '../components/charts/EmotionFrequencyChart';
import MoodDistributionChart from '../components/charts/MoodDistributionChart';
import IntensityTrendChart from '../components/charts/IntensityTrendChart';
import DayOfWeekChart from '../components/charts/DayOfWeekChart';
import HourOfDayChart from '../components/charts/HourOfDayChart';
import CustomEmotionBreakdown from '../components/charts/CustomEmotionBreakdown';

export default function StatisticsScreen() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [range, setRange] = useState<DateRangePreset>('all');

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await getEntries();
        setEntries(data);
      })();
    }, [])
  );

  const filtered = useMemo(() => filterByRange(entries, range), [entries, range]);
  const summary = useMemo(() => computeSummary(filtered), [filtered]);
  const frequency = useMemo(() => computeEmotionFrequency(filtered), [filtered]);
  const trend = useMemo(() => computeIntensityTrend(filtered), [filtered]);
  const dayOfWeek = useMemo(() => computeDayOfWeek(filtered), [filtered]);
  const hourOfDay = useMemo(() => computeHourOfDay(filtered), [filtered]);
  const custom = useMemo(() => computeCustomStats(filtered), [filtered]);

  const hasData = filtered.length > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <RangeSelector selected={range} onSelect={setRange} />
      <StatsSummaryCards data={summary} />

      {hasData && (
        <>
          <StatsSection title="Frequência de Emoções">
            <EmotionFrequencyChart data={frequency} />
          </StatsSection>

          <StatsSection title="Distribuição de Humor">
            <MoodDistributionChart data={frequency} />
          </StatsSection>

          <StatsSection title="Intensidade ao Longo do Tempo">
            <IntensityTrendChart data={trend} />
          </StatsSection>

          <StatsSection title="Humor por Dia da Semana">
            <DayOfWeekChart data={dayOfWeek} />
          </StatsSection>

          <StatsSection title="Humor por Hora do Dia">
            <HourOfDayChart data={hourOfDay} />
          </StatsSection>

          {custom.length > 0 && (
            <StatsSection title="Emoções Personalizadas">
              <CustomEmotionBreakdown data={custom} />
            </StatsSection>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    paddingBottom: 40,
  },
});

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { getEntries } from '../../storage/moodStorage';
import { MoodEntry } from '../../types';
import { DateRangePreset, filterByRange, getRangeLabel } from '../../lib/dateRange';
import {
  computeSummary,
  computeEmotionFrequency,
  computeIntensityTrend,
  computeDayOfWeek,
  computeHourOfDay,
  computeCustomStats,
} from '../../lib/stats';
import { generateReportHtml } from '../../lib/pdfReport';
import { useTheme } from '../../contexts/ThemeContext';
import RangeSelector from '../../components/charts/RangeSelector';
import StatsSummaryCards from '../../components/charts/StatsSummaryCards';
import StatsSection from '../../components/charts/StatsSection';
import EmotionFrequencyChart from '../../components/charts/EmotionFrequencyChart';
import MoodDistributionChart from '../../components/charts/MoodDistributionChart';
import IntensityTrendChart from '../../components/charts/IntensityTrendChart';
import DayOfWeekChart from '../../components/charts/DayOfWeekChart';
import HourOfDayChart from '../../components/charts/HourOfDayChart';
import CustomEmotionBreakdown from '../../components/charts/CustomEmotionBreakdown';
import NamePromptModal from '../../components/NamePromptModal';

export default function StatisticsScreen() {
  const { colors } = useTheme();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [range, setRange] = useState<DateRangePreset>('all');
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [exporting, setExporting] = useState(false);
  const dataRef = useRef<{
    summary: ReturnType<typeof computeSummary>;
    frequency: ReturnType<typeof computeEmotionFrequency>;
    trend: ReturnType<typeof computeIntensityTrend>;
    dayOfWeek: ReturnType<typeof computeDayOfWeek>;
    hourOfDay: ReturnType<typeof computeHourOfDay>;
    custom: ReturnType<typeof computeCustomStats>;
    rangeLabel: string;
  } | null>(null);

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

  function handleOpenNamePrompt() {
    if (!hasData) return;
    dataRef.current = {
      summary,
      frequency,
      trend,
      dayOfWeek,
      hourOfDay,
      custom,
      rangeLabel: getRangeLabel(range),
    };
    setShowNamePrompt(true);
  }

  async function handleExportPdf(userName: string) {
    setShowNamePrompt(false);
    if (!dataRef.current) return;

    setExporting(true);
    try {
      let logoSrc: string | undefined;
      try {
        const asset = Asset.fromModule(require('../assets/icon.png'));
        await asset.downloadAsync();
        if (asset.localUri) {
          const logoB64 = await FileSystem.readAsStringAsync(asset.localUri, {
            encoding: 'base64',
          });
          logoSrc = 'data:image/png;base64,' + logoB64;
        }
      } catch (_) {
        // logo optional
      }

      const html = generateReportHtml({
        userName,
        rangeLabel: dataRef.current.rangeLabel,
        summary: dataRef.current.summary,
        frequency: dataRef.current.frequency,
        trend: dataRef.current.trend,
        dayOfWeek: dataRef.current.dayOfWeek,
        hourOfDay: dataRef.current.hourOfDay,
        custom: dataRef.current.custom,
        logoSrc,
        colors,
      });

      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Relatório PsyMap',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('PDF gerado!', `Salvo em:\n${uri}`);
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível gerar o PDF.');
    } finally {
      setExporting(false);
      dataRef.current = null;
    }
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <RangeSelector selected={range} onSelect={setRange} />

      <TouchableOpacity
        style={[styles.exportBtn, { backgroundColor: colors.accent }, (!hasData || exporting) && styles.exportBtnDisabled]}
        onPress={handleOpenNamePrompt}
        disabled={!hasData || exporting}
        activeOpacity={0.7}
      >
        {exporting ? (
          <ActivityIndicator color={colors.textOnAccent} size="small" />
        ) : (
          <Text style={[styles.exportBtnText, { color: colors.textOnAccent }]}>📄 Exportar PDF</Text>
        )}
      </TouchableOpacity>

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

      <NamePromptModal
        visible={showNamePrompt}
        onConfirm={handleExportPdf}
        onCancel={() => setShowNamePrompt(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  exportBtn: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  exportBtnDisabled: {
    opacity: 0.4,
  },
  exportBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

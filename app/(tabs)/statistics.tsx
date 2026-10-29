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
} from '../../lib/stats';
import { generateReportHtml } from '../../lib/pdfReport';
import { useTheme } from '../../contexts/ThemeContext';
import { radii, shadow } from '../../constants/ui';
import i18n from '../../lib/i18n';
import RangeSelector from '../../components/charts/RangeSelector';
import StatsSummaryCards from '../../components/charts/StatsSummaryCards';
import StatsSection from '../../components/charts/StatsSection';
import EmotionFrequencyChart from '../../components/charts/EmotionFrequencyChart';
import MoodDistributionChart from '../../components/charts/MoodDistributionChart';
import IntensityTrendChart from '../../components/charts/IntensityTrendChart';
import DayOfWeekChart from '../../components/charts/DayOfWeekChart';
import HourOfDayChart from '../../components/charts/HourOfDayChart';
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

  const hasData = filtered.length > 0;

  function handleOpenNamePrompt() {
    if (!hasData) return;
    dataRef.current = {
      summary,
      frequency,
      trend,
      dayOfWeek,
      hourOfDay,
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
        const asset = Asset.fromModule(require('../../assets/icon.png'));
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
        logoSrc,
        colors,
      });

      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: i18n.t('estatisticas.titulo'),
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert(i18n.t('estatisticas.pdfGerado'), i18n.t('estatisticas.pdfSalvo', { uri }));
      }
    } catch (err) {
      Alert.alert(i18n.t('estatisticas.erroPdf'), i18n.t('estatisticas.erroPdfMsg'));
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
          <Text style={[styles.exportBtnText, { color: colors.textOnAccent }]}>{i18n.t('estatisticas.exportarPdf')}</Text>
        )}
      </TouchableOpacity>

      <StatsSummaryCards data={summary} />

      {hasData && (
        <>
          <StatsSection title={i18n.t('estatisticas.frequencia')}>
            <EmotionFrequencyChart data={frequency} />
          </StatsSection>

          <StatsSection title={i18n.t('estatisticas.distribuicao')}>
            <MoodDistributionChart data={frequency} />
          </StatsSection>

          <StatsSection title={i18n.t('estatisticas.intensidadeTempo')}>
            <IntensityTrendChart data={trend} />
          </StatsSection>

          <StatsSection title={i18n.t('estatisticas.diaSemana')}>
            <DayOfWeekChart data={dayOfWeek} />
          </StatsSection>

          <StatsSection title={i18n.t('estatisticas.horaDia')}>
            <HourOfDayChart data={hourOfDay} />
          </StatsSection>
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
    paddingVertical: 14,
    borderRadius: radii.btn,
    alignItems: 'center',
    ...shadow(),
  },
  exportBtnDisabled: {
    opacity: 0.4,
  },
  exportBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

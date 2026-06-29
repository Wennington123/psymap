import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SummaryStats } from '../../lib/stats';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  data: SummaryStats;
}

export default function StatsSummaryCards({ data }: Props) {
  const { colors } = useTheme();

  if (data.totalEntries === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📊</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhum registro ainda</Text>
        <Text style={[styles.emptyHint, { color: colors.textDim }]}>Registre suas emoções para ver as estatísticas</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardNumber, { color: colors.accent }]}>{data.totalEntries}</Text>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Registros</Text>
      </View>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardNumber, { color: colors.accent }]}>{data.avgIntensity}</Text>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Média intensidade</Text>
      </View>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {data.mostFrequent ? (
          <>
            <Text style={styles.cardEmoji}>{data.mostFrequent.emoji}</Text>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Mais frequente</Text>
            <Text style={[styles.cardSub, { color: colors.text }]}>{data.mostFrequent.label}</Text>
          </>
        ) : (
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>-</Text>
        )}
      </View>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardNumber, { color: colors.accent }]}>{data.daysWithEntries}</Text>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Dias ativos</Text>
      </View>
      <View style={[styles.card, styles.cardWide, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.cardNumber, { color: colors.accent }]}>{data.currentStreak}</Text>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Sequência de dias</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    padding: 14,
    width: '46%',
    alignItems: 'center',
    borderWidth: 1,
  },
  cardWide: {
    width: '100%',
  },
  cardNumber: {
    fontSize: 28,
    fontWeight: '700',
  },
  cardEmoji: {
    fontSize: 32,
  },
  cardLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  cardSub: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SummaryStats } from '../../lib/stats';

interface Props {
  data: SummaryStats;
}

export default function StatsSummaryCards({ data }: Props) {
  if (data.totalEntries === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📊</Text>
        <Text style={styles.emptyText}>Nenhum registro ainda</Text>
        <Text style={styles.emptyHint}>Registre suas emoções para ver as estatísticas</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      <View style={styles.card}>
        <Text style={styles.cardNumber}>{data.totalEntries}</Text>
        <Text style={styles.cardLabel}>Registros</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardNumber}>{data.avgIntensity}</Text>
        <Text style={styles.cardLabel}>Média intensidade</Text>
      </View>
      <View style={styles.card}>
        {data.mostFrequent ? (
          <>
            <Text style={styles.cardEmoji}>{data.mostFrequent.emoji}</Text>
            <Text style={styles.cardLabel}>Mais frequente</Text>
            <Text style={styles.cardSub}>{data.mostFrequent.label}</Text>
          </>
        ) : (
          <Text style={styles.cardLabel}>-</Text>
        )}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardNumber}>{data.daysWithEntries}</Text>
        <Text style={styles.cardLabel}>Dias ativos</Text>
      </View>
      <View style={[styles.card, styles.cardWide]}>
        <Text style={styles.cardNumber}>{data.currentStreak}</Text>
        <Text style={styles.cardLabel}>Sequência de dias</Text>
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
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 14,
    width: '46%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  cardWide: {
    width: '100%',
  },
  cardNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e94560',
  },
  cardEmoji: {
    fontSize: 32,
  },
  cardLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textAlign: 'center',
  },
  cardSub: {
    fontSize: 13,
    color: '#e0e0e0',
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
    color: '#888',
  },
  emptyHint: {
    fontSize: 13,
    color: '#555',
    marginTop: 6,
    textAlign: 'center',
  },
});

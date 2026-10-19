import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { computeLevel, computeStreak, dayKey } from '../lib/gamification';
import { getEntries } from '../storage/moodStorage';
import { getEarnedBadges, getXpTotal } from '../storage/gamification';

export interface GamificationState {
  xpTotal: number;
  entriesToday: number;
  streak: number;
  level: number;
  levelProgress: number;
  toNext: number;
  badges: string[];
  refresh: () => Promise<void>;
}

export function useGamification(): GamificationState {
  const [xpTotal, setXpTotal] = useState(0);
  const [entriesToday, setEntriesToday] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    const [entries, xp, earned] = await Promise.all([
      getEntries(),
      getXpTotal(),
      getEarnedBadges(),
    ]);
    const today = dayKey(new Date());
    setEntriesToday(
      entries.filter((e) => dayKey(new Date(e.timestamp)) === today).length,
    );
    setStreak(computeStreak(entries));
    setXpTotal(xp);
    setBadges(earned);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const level = computeLevel(xpTotal);
  return {
    xpTotal,
    entriesToday,
    streak,
    level: level.level,
    levelProgress: level.progress,
    toNext: level.toNext,
    badges,
    refresh,
  };
}

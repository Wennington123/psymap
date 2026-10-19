import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodEntry } from '../types';
import {
  BADGES,
  BadgeContext,
  computeBadgeContext,
  computeLevel,
  xpDeltaForNewEntry,
} from '../lib/gamification';

const XP_KEY = '@psymap:xpEarned';
const BADGES_KEY = '@psymap:badges';

export async function getXpTotal(): Promise<number> {
  const raw = await AsyncStorage.getItem(XP_KEY);
  if (!raw) return 0;
  return Number(raw) || 0;
}

export async function getEarnedBadges(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(BADGES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export interface AwardResult {
  delta: number;
  xpTotal: number;
  levelUp: boolean;
  newBadges: string[];
}

/**
 * Registra o XP do registro novo no contador monotônico local
 * (apagar registros no histórico NÃO recua XP) e desbloqueia badges.
 */
export async function awardEntry(prevEntries: MoodEntry[], newEntry: MoodEntry): Promise<AwardResult> {
  const delta = xpDeltaForNewEntry(prevEntries, newEntry);

  const beforeXp = await getXpTotal();
  const beforeLevel = computeLevel(beforeXp).level;
  const xpTotal = beforeXp + delta;

  if (delta > 0) {
    await AsyncStorage.setItem(XP_KEY, String(xpTotal));
  }

  // badges nunca são revogadas (só cresce)
  const earned = new Set(await getEarnedBadges());
  const newBadges: string[] = [];
  const ctx: BadgeContext = computeBadgeContext([...prevEntries, newEntry], xpTotal);
  for (const badge of BADGES) {
    if (badge.check(ctx) && !earned.has(badge.id)) {
      earned.add(badge.id);
      newBadges.push(badge.id);
    }
  }
  if (newBadges.length > 0) {
    await AsyncStorage.setItem(BADGES_KEY, JSON.stringify([...earned]));
  }

  return {
    delta,
    xpTotal,
    levelUp: computeLevel(xpTotal).level > beforeLevel,
    newBadges,
  };
}

export async function clearGamificationData(): Promise<void> {
  await AsyncStorage.multiRemove([XP_KEY, BADGES_KEY]);
}

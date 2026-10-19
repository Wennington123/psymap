import { MoodEntry } from '../types';

export const BASE_XP_PER_ENTRY = 10;
export const FIRST_OF_DAY_BONUS = 10;
export const STREAK_BONUS_PER_ENTRY = 5;
export const STREAK_BONUS_MIN_STREAK = 3;
export const MAX_SCORED_ENTRIES_PER_DAY = 5;
export const XP_PER_LEVEL = 100;

export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isNextDay(prevKey: string, key: string): boolean {
  const [py, pm, pd] = prevKey.split('-').map(Number);
  const [cy, cm, cd] = key.split('-').map(Number);
  const prev = new Date(py, pm - 1, pd);
  const cur = new Date(cy, cm - 1, cd);
  return Math.round((cur.getTime() - prev.getTime()) / 86400000) === 1;
}

/** Streak = dias consecutivos com >=1 registro, terminando hoje ou ontem. */
export function computeStreak(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;
  const days = new Set(entries.map((e) => dayKey(new Date(e.timestamp))));
  let cursor = new Date();
  if (!days.has(dayKey(cursor))) {
    cursor = addDays(cursor, -1);
    if (!days.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/**
 * XP total derivado do histórico, de forma determinística:
 * - 10 XP por registro (máx 5 registros/dia pontuam, anti-spam)
 * - +10 XP na primeira entrada de cada dia
 * - +5 XP por registro quando o streak ativo no dia >= 3
 */
export function computeTotalXP(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;

  const sorted = [...entries].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  const perDay = new Map<string, number>();
  const dayOrder: string[] = [];
  for (const entry of sorted) {
    const key = dayKey(new Date(entry.timestamp));
    const count = perDay.get(key) ?? 0;
    if (count === 0) dayOrder.push(key);
    perDay.set(key, count + 1);
  }

  let total = 0;
  let streak = 0;
  let prevKey: string | null = null;
  for (const key of dayOrder) {
    streak = prevKey && isNextDay(prevKey, key) ? streak + 1 : 1;
    const scored = Math.min(perDay.get(key) ?? 0, MAX_SCORED_ENTRIES_PER_DAY);
    total += scored * BASE_XP_PER_ENTRY;
    total += FIRST_OF_DAY_BONUS;
    if (streak >= STREAK_BONUS_MIN_STREAK) {
      total += scored * STREAK_BONUS_PER_ENTRY;
    }
    prevKey = key;
  }
  return total;
}

/** XP que um registro novo rende, dado o histórico anterior. */
export function xpDeltaForNewEntry(prevEntries: MoodEntry[], newEntry: MoodEntry): number {
  return Math.max(computeTotalXP([...prevEntries, newEntry]) - computeTotalXP(prevEntries), 0);
}

export function computeLevel(xpTotal: number): { level: number; progress: number; toNext: number } {
  const level = Math.floor(xpTotal / XP_PER_LEVEL) + 1;
  const progress = (xpTotal % XP_PER_LEVEL) / XP_PER_LEVEL;
  const toNext = XP_PER_LEVEL - (xpTotal % XP_PER_LEVEL);
  return { level, progress, toNext };
}

export interface BadgeDefinition {
  id: string;
  emoji: string;
  title: string;
  description: string;
  check: (ctx: BadgeContext) => boolean;
}

export interface BadgeContext {
  totalEntries: number;
  streak: number;
  level: number;
}

export const BADGES: BadgeDefinition[] = [
  {
    id: 'first-entry',
    emoji: '🌱',
    title: 'Primeiro passo',
    description: 'Registre sua primeira emoção',
    check: (c) => c.totalEntries >= 1,
  },
  {
    id: 'entries-10',
    emoji: '📗',
    title: 'Aquecendo',
    description: '10 registros',
    check: (c) => c.totalEntries >= 10,
  },
  {
    id: 'entries-50',
    emoji: '📘',
    title: 'Costume',
    description: '50 registros',
    check: (c) => c.totalEntries >= 50,
  },
  {
    id: 'entries-100',
    emoji: '📙',
    title: 'Diarista',
    description: '100 registros',
    check: (c) => c.totalEntries >= 100,
  },
  {
    id: 'entries-365',
    emoji: '🏆',
    title: 'Ano inteiro',
    description: '365 registros',
    check: (c) => c.totalEntries >= 365,
  },
  {
    id: 'streak-3',
    emoji: '🔥',
    title: 'Faísca',
    description: 'Streak de 3 dias',
    check: (c) => c.streak >= 3,
  },
  {
    id: 'streak-7',
    emoji: '⚡',
    title: 'Uma semana',
    description: 'Streak de 7 dias',
    check: (c) => c.streak >= 7,
  },
  {
    id: 'streak-14',
    emoji: '🌟',
    title: 'Duas semanas',
    description: 'Streak de 14 dias',
    check: (c) => c.streak >= 14,
  },
  {
    id: 'streak-30',
    emoji: '💎',
    title: 'Um mês',
    description: 'Streak de 30 dias',
    check: (c) => c.streak >= 30,
  },
  {
    id: 'level-2',
    emoji: '🥉',
    title: 'Nível 2',
    description: 'Alcance o nível 2',
    check: (c) => c.level >= 2,
  },
  {
    id: 'level-5',
    emoji: '🥈',
    title: 'Nível 5',
    description: 'Alcance o nível 5',
    check: (c) => c.level >= 5,
  },
  {
    id: 'level-10',
    emoji: '🥇',
    title: 'Nível 10',
    description: 'Alcance o nível 10',
    check: (c) => c.level >= 10,
  },
];

export function computeBadgeContext(entries: MoodEntry[], xpTotal: number): BadgeContext {
  return {
    totalEntries: entries.length,
    streak: computeStreak(entries),
    level: computeLevel(xpTotal).level,
  };
}

import type { User } from '@react-native-firebase/auth';
import { IS_FOSS } from './config';

/**
 * Facade do ranking Firebase. NÃO importa firebase no topo — o código real
 * (lib/firebase/ranking.ts) é carregado via import() dinâmico somente no
 * build normal (Play). No flavor `foss` (F-Droid) essas funções são no-ops,
 * então o bundle nunca executa o require do módulo nativo do Firebase.
 */

export interface RankRow {
  uid: string;
  displayName: string;
  photoURL: string | null;
  xp: number;
  xpWeek: number;
  streak: number;
  level: number;
}

export async function ensureRankDoc(user: User, xpTotal: number, streak: number): Promise<void> {
  if (IS_FOSS) return;
  const m = await import('./firebase/ranking');
  return m.ensureRankDoc(user, xpTotal, streak);
}

export async function syncXpDelta(user: User, delta: number, streak: number): Promise<void> {
  if (IS_FOSS) return;
  const m = await import('./firebase/ranking');
  return m.syncXpDelta(user, delta, streak);
}

export async function fetchWeeklyRanking(): Promise<RankRow[]> {
  if (IS_FOSS) return [];
  const m = await import('./firebase/ranking');
  return m.fetchWeeklyRanking();
}

export async function fetchAllTimeRanking(): Promise<RankRow[]> {
  if (IS_FOSS) return [];
  const m = await import('./firebase/ranking');
  return m.fetchAllTimeRanking();
}

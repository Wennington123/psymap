import { MoodEntry } from '../types';
import i18n from './i18n';

export type DateRangePreset = 'all' | '7d' | '30d' | '90d';

export function getRangeStart(preset: DateRangePreset): Date | null {
  if (preset === 'all') return null;
  const days: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 };
  const d = new Date();
  d.setDate(d.getDate() - days[preset]);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function filterByRange(entries: MoodEntry[], preset: DateRangePreset): MoodEntry[] {
  const start = getRangeStart(preset);
  if (!start) return entries;
  return entries.filter((e) => new Date(e.timestamp) >= start);
}

export function getRangeLabel(preset: DateRangePreset): string {
  return i18n.t('range.' + preset);
}

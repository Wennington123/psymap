import { MoodEntry } from '../types';

export interface EmotionStat {
  emotionId: string;
  label: string;
  emoji: string;
  isCustom: boolean;
  count: number;
  avgIntensity: number;
  percentage: number;
}

export interface TimeSeriesPoint {
  date: string;
  avgIntensity: number;
  count: number;
  dominantEmotion: string;
}

export interface DayOfWeekStat {
  dayLabel: string;
  dayIndex: number;
  avgIntensity: number;
  count: number;
}

export interface HourOfDayStat {
  hour: number;
  avgIntensity: number;
  count: number;
}

export interface SummaryStats {
  totalEntries: number;
  mostFrequent: { label: string; emoji: string; count: number } | null;
  avgIntensity: number;
  daysWithEntries: number;
  currentStreak: number;
}

export function computeSummary(entries: MoodEntry[]): SummaryStats {
  if (entries.length === 0) {
    return { totalEntries: 0, mostFrequent: null, avgIntensity: 0, daysWithEntries: 0, currentStreak: 0 };
  }

  const freq = computeEmotionFrequency(entries);
  const mostFrequent = freq[0];
  const avgIntensity = entries.reduce((sum, e) => sum + e.intensity, 0) / entries.length;

  const days = new Set(entries.map((e) => e.timestamp.split('T')[0]));
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if (days.has(key)) {
      streak++;
    } else {
      break;
    }
  }

  return {
    totalEntries: entries.length,
    mostFrequent: mostFrequent ? { label: mostFrequent.label, emoji: mostFrequent.emoji, count: mostFrequent.count } : null,
    avgIntensity: Math.round(avgIntensity * 10) / 10,
    daysWithEntries: days.size,
    currentStreak: streak,
  };
}

export function computeEmotionFrequency(entries: MoodEntry[]): EmotionStat[] {
  const map = new Map<string, { label: string; emoji: string; isCustom: boolean; count: number; totalIntensity: number }>();

  entries.forEach((e) => {
    const existing = map.get(e.emotion.id);
    if (existing) {
      existing.count++;
      existing.totalIntensity += e.intensity;
    } else {
      map.set(e.emotion.id, {
        label: e.emotion.label,
        emoji: e.emotion.emoji,
        isCustom: e.emotion.isCustom,
        count: 1,
        totalIntensity: e.intensity,
      });
    }
  });

  const total = entries.length;
  const stats: EmotionStat[] = [];
  map.forEach((v, id) => {
    stats.push({
      emotionId: id,
      label: v.label,
      emoji: v.emoji,
      isCustom: v.isCustom,
      count: v.count,
      avgIntensity: Math.round((v.totalIntensity / v.count) * 10) / 10,
      percentage: Math.round((v.count / total) * 1000) / 10,
    });
  });

  stats.sort((a, b) => b.count - a.count);
  return stats;
}

export function computeIntensityTrend(entries: MoodEntry[]): TimeSeriesPoint[] {
  const map = new Map<string, { totalIntensity: number; count: number; emotions: Map<string, number> }>();

  entries.forEach((e) => {
    const date = e.timestamp.split('T')[0];
    const existing = map.get(date);
    if (existing) {
      existing.totalIntensity += e.intensity;
      existing.count++;
      existing.emotions.set(e.emotion.id, (existing.emotions.get(e.emotion.id) || 0) + 1);
    } else {
      const emotions = new Map<string, number>();
      emotions.set(e.emotion.id, 1);
      map.set(date, { totalIntensity: e.intensity, count: 1, emotions });
    }
  });

  const points: TimeSeriesPoint[] = [];
  map.forEach((v, date) => {
    let maxCount = 0;
    let dominantEmoji = '';
    v.emotions.forEach((count, id) => {
      if (count > maxCount) {
        maxCount = count;
        const entry = entries.find((e) => e.emotion.id === id);
        dominantEmoji = entry ? entry.emotion.emoji : '';
      }
    });

    points.push({
      date,
      avgIntensity: Math.round((v.totalIntensity / v.count) * 10) / 10,
      count: v.count,
      dominantEmotion: dominantEmoji,
    });
  });

  points.sort((a, b) => a.date.localeCompare(b.date));
  return points;
}

export function computeDayOfWeek(entries: MoodEntry[]): DayOfWeekStat[] {
  const DAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const buckets: { totalIntensity: number; count: number }[] = Array.from({ length: 7 }, () => ({
    totalIntensity: 0,
    count: 0,
  }));

  entries.forEach((e) => {
    const day = new Date(e.timestamp).getDay();
    buckets[day].totalIntensity += e.intensity;
    buckets[day].count++;
  });

  return DAYS_PT.map((label, i) => ({
    dayLabel: label,
    dayIndex: i,
    avgIntensity: buckets[i].count > 0 ? Math.round((buckets[i].totalIntensity / buckets[i].count) * 10) / 10 : 0,
    count: buckets[i].count,
  }));
}

export function computeHourOfDay(entries: MoodEntry[]): HourOfDayStat[] {
  const buckets: { totalIntensity: number; count: number }[] = Array.from({ length: 24 }, () => ({
    totalIntensity: 0,
    count: 0,
  }));

  entries.forEach((e) => {
    const hour = new Date(e.timestamp).getHours();
    buckets[hour].totalIntensity += e.intensity;
    buckets[hour].count++;
  });

  return buckets.map((b, hour) => ({
    hour,
    avgIntensity: b.count > 0 ? Math.round((b.totalIntensity / b.count) * 10) / 10 : 0,
    count: b.count,
  }));
}

export function computeCustomStats(entries: MoodEntry[]): EmotionStat[] {
  const custom = entries.filter((e) => e.emotion.isCustom);
  return computeEmotionFrequency(custom);
}

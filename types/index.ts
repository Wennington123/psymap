export interface Emotion {
  id: string;
  label: string;
  emoji: string;
  isCustom: boolean;
}

export interface MoodEntry {
  id: string;
  emotion: Emotion;
  intensity: number;
  note?: string;
  timestamp: string;
}

import { Emotion } from '../types';

import i18n from '../lib/i18n';

export const BASE_EMOTIONS: Emotion[] = [
  { id: 'joy', label: 'Alegria', emoji: '😊', isCustom: false },
  { id: 'trust', label: 'Confiança', emoji: '🤝', isCustom: false },
  { id: 'fear', label: 'Medo', emoji: '😨', isCustom: false },
  { id: 'surprise', label: 'Surpresa', emoji: '😲', isCustom: false },
  { id: 'sadness', label: 'Tristeza', emoji: '😢', isCustom: false },
  { id: 'disgust', label: 'Nojo', emoji: '🤢', isCustom: false },
  { id: 'anger', label: 'Raiva', emoji: '😠', isCustom: false },
  { id: 'anticipation', label: 'Expectativa', emoji: '🤔', isCustom: false },
];

/** Rótulo da emoção traduzido conforme o idioma atual (fallback pt-BR). */
export function emotionLabel(e: Pick<Emotion, 'id' | 'label'>): string {
  return i18n.t('emotions.' + e.id, { defaultValue: e.label });
}

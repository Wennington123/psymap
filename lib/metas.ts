import { ThemeName } from '../constants/colors';

/**
 * Metas locais (versão F-Droid / flavor `foss`). Cada meta é atrelada a um
 * badge já existente do sistema de gamificação: ao conquistá-lo, o tema
 * `rewardTheme` é desbloqueado automaticamente (via `requiredBadge` em
 * constants/colors.ts). Tudo offline, sem conta.
 */
export interface MetaDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  /** badge de gamificação que, quando ganho, completa a meta */
  badgeId: string;
  /** tema desbloqueado como recompensa */
  rewardTheme: ThemeName;
}

export const METAS: MetaDefinition[] = [
  {
    id: 'meta-week',
    title: 'Uma semana de hábito',
    description: 'Mantenha um streak de 7 dias',
    icon: '⚡',
    badgeId: 'streak-7',
    rewardTheme: 'nord',
  },
  {
    id: 'meta-50',
    title: 'Diarista',
    description: 'Acumule 50 registros',
    icon: '📘',
    badgeId: 'entries-50',
    rewardTheme: 'gruvbox',
  },
  {
    id: 'meta-level5',
    title: 'Veterano',
    description: 'Alcance o nível 5',
    icon: '🥈',
    badgeId: 'level-5',
    rewardTheme: 'catppuccin',
  },
  {
    id: 'meta-month',
    title: 'Um mês inteiro',
    description: 'Streak de 30 dias',
    icon: '💎',
    badgeId: 'streak-30',
    rewardTheme: 'pixel',
  },
];

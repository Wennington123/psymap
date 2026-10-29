import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { METAS } from '../../lib/metas';
import { BADGES, computeBadgeContext, type BadgeContext } from '../../lib/gamification';
import { getEarnedBadges, getXpTotal } from '../../storage/gamification';
import { getEntries } from '../../storage/moodStorage';
import { Themes, ThemeName } from '../../constants/colors';
import { card, displayFont } from '../../constants/ui';
import i18n from '../../lib/i18n';

export default function MetasScreen() {
  const { colors } = useTheme();
  const [earned, setEarned] = useState<string[]>([]);
  const [ctx, setCtx] = useState<BadgeContext>({ totalEntries: 0, streak: 0, level: 1 });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [entries, xp, badges] = await Promise.all([
          getEntries(),
          getXpTotal(),
          getEarnedBadges(),
        ]);
        setEarned(badges);
        setCtx(computeBadgeContext(entries, xp));
      })();
    }, []),
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.intro, { color: colors.textSecondary, fontFamily: displayFont(colors, 'regular') }]}>
        {i18n.t('metas.intro')}
      </Text>

      {METAS.map((meta) => {
        const done = earned.includes(meta.badgeId);
        const progress = metaProgress(meta, ctx);
        return (
          <View key={meta.id} style={[styles.card, card(colors)]}>
            <Text style={styles.icon}>{meta.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.text, fontFamily: displayFont(colors, 'bold') }]}>
                {meta.title}
              </Text>
              <Text style={[styles.desc, { color: colors.textSecondary, fontFamily: displayFont(colors, 'regular') }]}>
                {meta.description}
              </Text>
              <View style={[styles.barTrack, { backgroundColor: colors.background }]}>
                <View
                  style={[
                    styles.barFill,
                    { backgroundColor: colors.accent, width: `${Math.round(progress * 100)}%` },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.reward,
                  { color: done ? colors.accent : colors.textDim, fontFamily: displayFont(colors, 'semibold') },
                ]}
              >
                {done
                  ? i18n.t('metas.temaDesbloqueado', { theme: themeLabel(meta.rewardTheme) })
                  : i18n.t('metas.recompensa', { theme: themeLabel(meta.rewardTheme) })}
              </Text>
            </View>
          </View>
        );
      })}

      <Text style={[styles.sectionTitle, { color: colors.textDim, fontFamily: displayFont(colors, 'bold') }]}>
        {i18n.t('metas.insignias')}
      </Text>
      <View style={[styles.badgeGrid, card(colors)]}>
        {BADGES.map((b) => {
          const has = earned.includes(b.id);
          return (
            <View key={b.id} style={styles.badgeItem}>
              <Text style={[styles.badgeEmoji, !has && styles.badgeLocked]}>{has ? b.emoji : '🔒'}</Text>
              <Text
                style={[styles.badgeName, { color: has ? colors.text : colors.textDim }]}
                numberOfLines={1}
              >
                {i18n.t('badges.' + b.id + '.title')}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function themeLabel(name?: ThemeName): string {
  return name ? Themes[name].name : '';
}

function metaProgress(meta: (typeof METAS)[number], ctx: BadgeContext): number {
  switch (meta.badgeId) {
    case 'streak-7':
      return Math.min(ctx.streak / 7, 1);
    case 'streak-30':
      return Math.min(ctx.streak / 30, 1);
    case 'entries-50':
      return Math.min(ctx.totalEntries / 50, 1);
    case 'level-5':
      return Math.min(ctx.level / 5, 1);
    default:
      return 0;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  intro: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
    marginBottom: 12,
  },
  icon: { fontSize: 30 },
  title: { fontSize: 16, fontWeight: '600' },
  desc: { fontSize: 12, marginTop: 2 },
  barTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 10,
  },
  barFill: { height: '100%', borderRadius: 4 },
  reward: { fontSize: 12, marginTop: 6 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 24,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    padding: 18,
    justifyContent: 'center',
  },
  badgeItem: { width: 88, alignItems: 'center' },
  badgeEmoji: { fontSize: 28 },
  badgeLocked: { opacity: 0.4 },
  badgeName: { fontSize: 10, textAlign: 'center', marginTop: 4 },
});

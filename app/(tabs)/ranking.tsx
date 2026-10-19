import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { BADGES } from '../../lib/gamification';
import {
  fetchAllTimeRanking,
  fetchWeeklyRanking,
  RankRow,
} from '../../lib/firebaseRanking';
import { getEarnedBadges, getXpTotal } from '../../storage/gamification';
import { computeStreak } from '../../lib/gamification';
import { getEntries } from '../../storage/moodStorage';
import { ensureRankDoc } from '../../lib/firebaseRanking';
import { card, radii, shadow } from '../../constants/ui';

type Mode = 'weekly' | 'all';

const PODIUM_COLORS = ['#FFD24C', '#C9CFDA', '#E2A16C'];

export default function RankingScreen() {
  const { colors } = useTheme();
  const { user, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState<Mode>('weekly');
  const [rows, setRows] = useState<RankRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myBadges, setMyBadges] = useState<string[]>([]);
  const [signingIn, setSigningIn] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = mode === 'weekly' ? await fetchWeeklyRanking() : await fetchAllTimeRanking();
      setRows(data);
    } catch (e) {
      setError('Não foi possível carregar o ranking. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        load();
        (async () => {
          const [badges] = await Promise.all([getEarnedBadges()]);
          setMyBadges(badges);
        })();
      } else {
        setRows([]);
        setLoading(false);
        setError(null);
      }
    }, [user, load]),
  );

  async function handleSignIn() {
    setSigningIn(true);
    const signedIn = await signInWithGoogle();
    setSigningIn(false);
    if (!signedIn) return;
    const [xp, entries] = await Promise.all([getXpTotal(), getEntries()]);
    ensureRankDoc(signedIn, xp, computeStreak(entries));
  }

  if (!user) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.emptyContent}
      >
        <View style={[styles.ctaCard, card(colors)]}>
          <Text style={styles.ctaEmoji}>🏆</Text>
          <Text style={[styles.ctaTitle, { color: colors.text }]}>Entre para competir</Text>
          <Text style={[styles.ctaBody, { color: colors.textSecondary }]}>
            Acompanhe seu XP e veja como você está se saindo no ranking semanal e geral de registradores de humor.
          </Text>
          <TouchableOpacity style={[styles.ctaButton, { backgroundColor: colors.accent }]} onPress={handleSignIn} activeOpacity={0.7}>
            {signingIn ? (
              <ActivityIndicator color={colors.textOnAccent} size="small" />
            ) : (
              <View style={styles.ctaButtonInner}>
                <Text style={styles.ctaGoogle}>G</Text>
                <Text style={[styles.ctaButtonText, { color: colors.textOnAccent }]}>Entrar com Google</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={[styles.ctaNote, { color: colors.textDim }]}>
            Suas emoções continuam 100% privadas no seu aparelho — só contamos XP.
          </Text>
        </View>

        <BadgeGrid colors={colors} myBadges={[]} />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.accent} />
      }
    >
      <View style={styles.modeSwitch}>
        {(['weekly', 'all'] as Mode[]).map((m) => (
          <TouchableOpacity
            key={m}
            style={[
              styles.modeSegment,
              { backgroundColor: mode === m ? colors.accent : colors.surface },
            ]}
            onPress={() => setMode(m)}
            activeOpacity={0.7}
          >
            <Text style={[styles.modeText, { color: mode === m ? colors.textOnAccent : colors.textSecondary }]}>
              {m === 'weekly' ? 'Semanal' : 'Geral'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? (
        <View style={styles.feedback}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>{error}</Text>
          <TouchableOpacity onPress={load} style={styles.retryBtn}>
            <Text style={[styles.retryText, { color: colors.accent }]}>Tentar de novo</Text>
          </TouchableOpacity>
        </View>
      ) : rows.length === 0 && !loading ? (
        <View style={styles.feedback}>
          <Text style={[styles.errorText, { color: colors.textDim }]}>
            Ninguém por aqui ainda neste modo.
          </Text>
        </View>
      ) : (
        <>
          {rows.length >= 3 && (
            <View style={styles.podium}>
              {rows.slice(0, 3).map((row, i) => (
                <View key={row.uid} style={[stagePodium(i)]}>
                  <View style={[styles.podiumBadge, { backgroundColor: PODIUM_COLORS[i] }]}>
                    <Text style={styles.podiumPos}>{i + 1}</Text>
                  </View>
                  <RankAvatar row={row} size={i === 0 ? 52 : 44} />
                  <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
                    {row.displayName}
                  </Text>
                  <Text style={[styles.podiumXp, { color: colors.textSecondary }]}>
                    {row.xp} XP
                  </Text>
                  {row.streak > 0 && (
                    <Text style={[styles.podiumStreak, { color: colors.textDim }]}>
                      🔥 {row.streak}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          <FlatList
            data={rows.length >= 3 ? rows.slice(3) : rows}
            scrollEnabled={false}
            keyExtractor={(item) => item.uid}
            contentContainerStyle={styles.rankList}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.rankRow,
                  item.uid === user.uid && { backgroundColor: colors.accent + '22', borderColor: colors.accent },
                ]}
              >
                <Text style={[styles.rankPos, { color: item.uid === user.uid ? colors.accent : colors.textDim }]}>
                  {index + (rows.length >= 3 ? 4 : 1)}
                </Text>
                <RankAvatar row={item} size={36} />
                <View style={styles.rankInfo}>
                  <Text style={[styles.rankName, { color: colors.text }]} numberOfLines={1}>
                    {item.displayName}
                  </Text>
                  <Text style={[styles.rankMeta, { color: colors.textDim }]}>
                    Nível {item.level} {item.streak > 0 ? ` · 🔥 ${item.streak}` : ''}
                  </Text>
                </View>
                <Text style={[styles.rankXp, { color: colors.accent }]}>
                  {item.xp} XP
                </Text>
              </View>
            )}
          />
        </>
      )}

      <BadgeGrid colors={colors} myBadges={myBadges} />
    </ScrollView>
  );
}

function stagePodium(i: number) {
  return i === 0 ? styles.podiumCenter : i === 1 ? styles.podiumLeft : styles.podiumRight;
}

function RankAvatar({ row, size }: { row: RankRow; size: number }) {
  if (row.photoURL) {
    return <Image source={{ uri: row.photoURL }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(128,128,128,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: size * 0.45, fontWeight: '700', color: '#555' }}>
        {row.displayName.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

function BadgeGrid({
  colors,
  myBadges,
}: {
  colors: ReturnType<typeof useTheme>['colors'];
  myBadges: string[];
}) {
  return (
    <View style={styles.badgeSection}>
      <Text style={[styles.badgeTitle, { color: colors.textDim }]}>Conquistas</Text>
      <View style={[styles.badgeGrid, card(colors)]}>
        {BADGES.map((badge) => {
          const earned = myBadges.includes(badge.id);
          return (
            <View key={badge.id} style={styles.badgeItem}>
              <Text style={[styles.badgeEmoji, !earned && styles.badgeLocked]}>
                {earned ? badge.emoji : '🔒'}
              </Text>
              <Text
                style={[styles.badgeName, { color: earned ? colors.text : colors.textDim }]}
                numberOfLines={1}
              >
                {badge.title}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 12,
    paddingBottom: 40,
  },
  emptyContent: {
    paddingTop: 72,
    paddingBottom: 40,
    alignItems: 'center',
  },
  ctaCard: {
    width: '86%',
    padding: 28,
    alignItems: 'center',
  },
  ctaEmoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  ctaBody: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  ctaButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radii.btn,
    ...shadow(),
    minWidth: 220,
    alignItems: 'center',
  },
  ctaButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ctaGoogle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4285F4',
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  ctaNote: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 18,
  },
  modeSwitch: {
    flexDirection: 'row',
    gap: 6,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modeSegment: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  modeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  feedback: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radii.btn,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '700',
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  podiumLeft: { alignItems: 'center' },
  podiumCenter: { alignItems: 'center', paddingBottom: 16 },
  podiumRight: { alignItems: 'center' },
  podiumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  podiumPos: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  podiumName: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
    maxWidth: 96,
    textAlign: 'center',
  },
  podiumXp: {
    fontSize: 12,
  },
  podiumStreak: {
    fontSize: 11,
    marginTop: 2,
  },
  rankList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(128,128,128,0.08)',
    borderRadius: 14,
    padding: 10,
    gap: 10,
  },
  rankPos: {
    width: 24,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontSize: 14,
    fontWeight: '600',
  },
  rankMeta: {
    fontSize: 11,
    marginTop: 1,
  },
  rankXp: {
    fontSize: 13,
    fontWeight: '700',
  },
  badgeSection: {
    marginTop: 28,
    paddingHorizontal: 16,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    padding: 18,
    justifyContent: 'center',
  },
  badgeItem: {
    width: 88,
    alignItems: 'center',
  },
  badgeEmoji: {
    fontSize: 28,
  },
  badgeLocked: {
    opacity: 0.4,
  },
  badgeName: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
});

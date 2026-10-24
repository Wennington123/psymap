import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Share,
  Linking,
  ActivityIndicator,
} from 'react-native';
import Constants from 'expo-constants';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { BADGES } from '../../lib/gamification';
import { Themes, ThemeName } from '../../constants/colors';
import { clearAllData, getEntries } from '../../storage/moodStorage';
import { clearGamificationData, getEarnedBadges, getXpTotal } from '../../storage/gamification';
import { computeStreak } from '../../lib/gamification';
import { ensureRankDoc } from '../../lib/firebaseRanking';
import {
  requestPermission,
  scheduleDailyReminders,
  cancelAllReminders,
  setNotificationsEnabled,
  getNotificationsEnabled,
} from '../../lib/notifications';
import { card, radii, shadow, displayFont } from '../../constants/ui';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

const THEME_LABELS: Record<ThemeName, string> = {
  light: 'Claro',
  dark: 'Escuro',
  dracula: 'Dracula',
  nord: 'Nord',
  gruvbox: 'Gruvbox',
  catppuccin: 'Catppuccin',
  pixel: 'Pixel',
};
const THEME_LIST: ThemeName[] = ['light', 'dark', 'dracula', 'nord', 'gruvbox', 'catppuccin', 'pixel'];

const PIX_KEY = '74988217793';

export default function SettingsScreen() {
  const { colors, themeName, setTheme } = useTheme();
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [myBadges, setMyBadges] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      getEarnedBadges().then(setMyBadges);
    }, []),
  );

  useEffect(() => {
    getNotificationsEnabled().then(setNotifEnabled);
  }, []);

  const handleToggleNotifications = async () => {
    if (notifEnabled) {
      await cancelAllReminders();
      await setNotificationsEnabled(false);
      setNotifEnabled(false);
    } else {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Permissão negada',
          'Para receber lembretes, ative as notificações para o PsyMap nas configurações do seu dispositivo.',
        );
        return;
      }
      await scheduleDailyReminders();
      await setNotificationsEnabled(true);
      setNotifEnabled(true);
      Alert.alert(
        'Notificações ativadas',
        'Você receberá 3 lembretes gentis por dia (9h, 14h e 20h) para registrar seu humor.',
      );
    }
  };

  const handleSignIn = async () => {
    setSigningIn(true);
    const signedIn = await signInWithGoogle();
    setSigningIn(false);
    if (!signedIn) return;
    // garante que o doc do ranking nasce com o XP já acumulado
    const [xp, entries] = await Promise.all([getXpTotal(), getEntries()]);
    ensureRankDoc(signedIn, xp, computeStreak(entries));
  };

  const handleSignOut = () => {
    Alert.alert('Sair da conta', 'Sair da sua conta Google? Seus dados locais são mantidos.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const handleDeleteAll = () => {
    Alert.alert(
      'Excluir todos os dados',
      'Isso apagará todo o seu histórico, sua gamificação e redefinirá o tema. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            await clearGamificationData();
            setTheme('dracula');
            Alert.alert('Sucesso', 'Todos os dados foram excluídos.');
          },
        },
      ],
    );
  };

  const handleFeedback = () => {
    Linking.openURL('mailto:wenningtondiasx25@gmail.com?subject=Feedback%20PsyMap');
  };

  const handleShare = () => {
    Share.share({ message: 'Conheça o PsyMap — app de mapeamento emocional! 🧠' });
  };

  const handleCopyPix = async () => {
    await Clipboard.setStringAsync(PIX_KEY);
    Alert.alert('Copiado!', 'Chave PIX copiada para a área de transferência.');
  };

  const handleThemePress = (name: ThemeName) => {
    const theme = Themes[name];
    const requirement = theme.requiredBadge ? BADGES.find((b) => b.id === theme.requiredBadge) : null;
    if (!requirement) {
      setTheme(name);
      return;
    }
    if (myBadges.includes(theme.requiredBadge!)) {
      setTheme(name);
      return;
    }
    Alert.alert(
      THEME_LABELS[name],
      `Desbloqueie com a conquista ${requirement.emoji} ${requirement.title}: ${requirement.description.toLowerCase()}.`,
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.sectionTitle, { color: colors.textDim, fontFamily: displayFont(colors, 'bold') }]}>Conta</Text>
      <View style={styles.section}>
        {loading ? (
          <View style={[styles.accountCard, card(colors)]}>
            <ActivityIndicator color={colors.accent} size="small" />
          </View>
        ) : user ? (
          <View style={[styles.accountCard, card(colors)]}>
            {user.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
                <Text style={[styles.avatarInitial, { color: colors.textOnAccent }]}>
                  {(user.displayName ?? '?').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.accountInfo}>
              <Text style={[styles.accountName, { color: colors.text, fontFamily: displayFont(colors, 'bold') }]}>{user.displayName}</Text>
              <Text style={[styles.accountEmail, { color: colors.textDim, fontFamily: displayFont(colors, 'regular') }]}>{user.email}</Text>
            </View>
            <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
              <Text style={[styles.signOutText, { color: colors.textSecondary }]}>Sair</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.loginCard, card(colors)]}
            activeOpacity={0.7}
            onPress={handleSignIn}
          >
            <View style={styles.googleBadge}>
              <Text style={styles.googleBadgeIcon}>G</Text>
            </View>
            <View style={styles.accountInfo}>
              <Text style={[styles.accountName, { color: colors.text, fontFamily: displayFont(colors, 'bold') }]}>Entrar com Google</Text>
              <Text style={[styles.accountEmail, { color: colors.textDim, fontFamily: displayFont(colors, 'regular') }]}>
                Para competir no ranking semanal e geral
              </Text>
            </View>
            {signingIn ? <ActivityIndicator color={colors.accent} size="small" /> : <Ionicons name="chevron-forward" size={20} color={colors.textDim} />}
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textDim, fontFamily: displayFont(colors, 'bold') }]}>Tema</Text>
      <View style={styles.section}>
        {THEME_LIST.map((key) => {
          const theme = Themes[key];
          const requirement = theme.requiredBadge ? BADGES.find((b) => b.id === theme.requiredBadge) : null;
          const unlocked = !requirement || myBadges.includes(requirement.id);
          const isSelected = themeName === key;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.card,
                card(colors),
                !unlocked && { opacity: 0.55 },
                isSelected && unlocked && { borderWidth: 2, borderColor: colors.accent },
              ]}
              activeOpacity={0.7}
              onPress={() => handleThemePress(key)}
            >
              <View style={styles.preview}>
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      margin: 2,
                      backgroundColor:
                        i === 0
                          ? theme.accent
                          : i === 1
                            ? theme.border
                            : theme.textDim,
                    }}
                  />
                ))}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.text, fontFamily: displayFont(colors, 'semibold') }]}>{THEME_LABELS[key]}</Text>
                {requirement && !unlocked ? (
                  <Text style={[styles.description, { color: colors.textSecondary, fontFamily: displayFont(colors, 'regular') }]}>
                    🔒 Desbloqueia com: {requirement.emoji} {requirement.title}
                  </Text>
                ) : null}
              </View>
              {isSelected && unlocked && (
                <View style={[styles.check, { backgroundColor: colors.accent }]}>
                  <Text style={{ color: colors.textOnAccent, fontSize: 13, fontWeight: '700' }}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textDim, fontFamily: displayFont(colors, 'bold') }]}>Notificações</Text>
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.card, card(colors)]}
          activeOpacity={0.7}
          onPress={handleToggleNotifications}
        >
          <Ionicons
            name={notifEnabled ? 'notifications' : 'notifications-outline'}
            size={22}
            color={notifEnabled ? colors.accent : colors.textDim}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.text, fontFamily: displayFont(colors, 'semibold') }]}>Lembretes diários</Text>
            <Text style={[styles.description, { color: colors.textSecondary, fontFamily: displayFont(colors, 'regular') }]}>
              {notifEnabled ? '3 lembretes por dia (9h, 14h e 20h)' : 'Receba lembretes gentis para registrar seu humor'}
            </Text>
          </View>
          <View style={[styles.toggle, { backgroundColor: notifEnabled ? colors.accent : colors.borderMuted }]}>
            <View style={[styles.toggleDot, notifEnabled && styles.toggleDotOn]} />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textDim, fontFamily: displayFont(colors, 'bold') }]}>Dados</Text>
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.card, card(colors)]}
          activeOpacity={0.7}
          onPress={handleDeleteAll}
        >
          <Text style={[styles.label, { color: '#e94560' }]}>Excluir todos os dados</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textDim, fontFamily: displayFont(colors, 'bold') }]}>Contribua</Text>
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.card, card(colors)]}
          activeOpacity={0.7}
          onPress={handleFeedback}
        >
          <Text style={[styles.label, { color: colors.text, fontFamily: displayFont(colors, 'semibold') }]}>Enviar feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, card(colors)]}
          activeOpacity={0.7}
          onPress={handleShare}
        >
          <Text style={[styles.label, { color: colors.text, fontFamily: displayFont(colors, 'semibold') }]}>Compartilhar app</Text>
        </TouchableOpacity>

        <View style={[styles.card, card(colors), styles.donationCard]}>
          <Text style={[styles.label, { color: colors.text, marginBottom: 12, fontFamily: displayFont(colors, 'semibold') }]}>Fazer doação (PIX)</Text>
          <Image
            source={require('../../assets/qrcode-pix.png')}
            style={styles.qrImage}
            resizeMode="contain"
          />
          <Text style={[styles.pixKey, { color: colors.textSecondary }]}>Chave: {PIX_KEY}</Text>
          <TouchableOpacity
            style={[styles.copyButton, { backgroundColor: colors.accent, borderRadius: colors.style === 'pixel' ? 6 : radii.btn }]}
            activeOpacity={0.7}
            onPress={handleCopyPix}
          >
            <Text style={styles.copyButtonText}>Copiar chave PIX</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.version, { color: colors.textDim, fontFamily: displayFont(colors, 'regular') }]}>PsyMap v{version}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 24,
  },
  section: {
    paddingHorizontal: 16,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
  },
  loginCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
    ...shadow(),
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '700',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
  },
  accountEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  signOutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '600',
  },
  googleBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  googleBadgeIcon: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4285F4',
  },
  preview: {
    flexDirection: 'row',
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(128,128,128,0.6)',
  },
  toggleDotOn: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donationCard: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  qrImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 8,
  },
  pixKey: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  copyButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radii.btn,
    alignSelf: 'center',
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 13,
  },
});

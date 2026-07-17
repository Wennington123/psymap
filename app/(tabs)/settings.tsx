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
} from 'react-native';
import Constants from 'expo-constants';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Themes, ThemeName } from '../../constants/colors';
import { clearAllData } from '../../storage/moodStorage';
import {
  requestPermission,
  scheduleDailyReminders,
  cancelAllReminders,
  setNotificationsEnabled,
  getNotificationsEnabled,
} from '../../lib/notifications';

const THEME_LABELS: Record<ThemeName, string> = {
  dracula: 'Dracula',
  dark: 'Escuro',
  light: 'Claro',
  sunset: 'Sunset',
  ocean: 'Oceano',
  forest: 'Floresta',
  kittens: 'Gatinhos',
};
const THEME_LIST: ThemeName[] = ['dracula', 'dark', 'light', 'sunset', 'ocean', 'forest', 'kittens'];

const PIX_KEY = '74988217793';

export default function SettingsScreen() {
  const { colors, themeName, setTheme, isUnlocked, channel } = useTheme();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const [notifEnabled, setNotifEnabled] = useState(false);

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

  const handleDeleteAll = () => {
    Alert.alert(
      'Excluir todos os dados',
      'Isso apagará todo o seu histórico, emoções customizadas e redefinirá o tema. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
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

  const handleBuy = (name: ThemeName) => {
    const price = Themes[name].priceBRL?.toFixed(2).replace('.', ',');
    Alert.alert(
      `Comprar tema ${THEME_LABELS[name]}`,
      `Na Play Store este tema custa R$ ${price}. A compra será processada pelo Google Play Billing.`,
    );
  };

  const handleThemePress = (name: ThemeName) => {
    if (isUnlocked(name)) {
      setTheme(name);
      return;
    }
    if (channel === 'play') {
      handleBuy(name);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Theme Section */}
      <Text style={[styles.sectionTitle, { color: colors.accent }]}>Tema</Text>
      <View style={styles.section}>
        {THEME_LIST.map((key) => {
          const theme = Themes[key];
          const unlocked = isUnlocked(key);
          const isSelected = themeName === key;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: isSelected ? colors.accent : colors.border,
                },
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
                      borderRadius: 8,
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
                <Text style={[styles.label, { color: colors.text }]}>{THEME_LABELS[key]}</Text>
                {channel === 'play' && theme.premium ? (
                  <Text style={[styles.description, { color: colors.textSecondary }]}>
                    {unlocked ? 'Premium · adquirido' : `Premium · R$ ${theme.priceBRL?.toFixed(2).replace('.', ',')}`}
                  </Text>
                ) : null}
              </View>
              {isSelected && (
                <View style={[styles.check, { backgroundColor: colors.accent }]}>
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notification Section */}
      <Text style={[styles.sectionTitle, { color: colors.accent }]}>Notificações</Text>
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.surface, borderColor: notifEnabled ? colors.accent : colors.border }]}
          activeOpacity={0.7}
          onPress={handleToggleNotifications}
        >
          <Ionicons
            name={notifEnabled ? 'notifications' : 'notifications-outline'}
            size={22}
            color={notifEnabled ? colors.accent : colors.textDim}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.text }]}>Lembretes diários</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {notifEnabled ? '3 lembretes por dia (9h, 14h e 20h)' : 'Receba lembretes gentis para registrar seu humor'}
            </Text>
          </View>
          <View style={[styles.toggle, { backgroundColor: notifEnabled ? colors.accent : colors.borderMuted }]}>
            <View style={[styles.toggleDot, notifEnabled && styles.toggleDotOn]} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Data Section */}
      <Text style={[styles.sectionTitle, { color: colors.accent }]}>Dados</Text>
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.card, styles.dangerCard, { backgroundColor: colors.surface, borderColor: '#e94560' }]}
          activeOpacity={0.7}
          onPress={handleDeleteAll}
        >
          <Text style={[styles.label, { color: '#e94560' }]}>Excluir todos os dados</Text>
        </TouchableOpacity>
      </View>

      {/* Contribute Section */}
      <Text style={[styles.sectionTitle, { color: colors.accent }]}>Contribua</Text>
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.7}
          onPress={handleFeedback}
        >
          <Text style={[styles.label, { color: colors.text }]}>Enviar feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.7}
          onPress={handleShare}
        >
          <Text style={[styles.label, { color: colors.text }]}>Compartilhar app</Text>
        </TouchableOpacity>

        {/* Donation Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, flexDirection: 'column', alignItems: 'stretch' }]}>
          <Text style={[styles.label, { color: colors.text, marginBottom: 12 }]}>Fazer doação (PIX)</Text>
          <Image
            source={require('../../assets/qrcode-pix.png')}
            style={styles.qrImage}
            resizeMode="contain"
          />
          <Text style={[styles.pixKey, { color: colors.textSecondary }]}>Chave: {PIX_KEY}</Text>
          <TouchableOpacity
            style={[styles.copyButton, { backgroundColor: colors.accent }]}
            activeOpacity={0.7}
            onPress={handleCopyPix}
          >
            <Text style={styles.copyButtonText}>Copiar chave PIX</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Version */}
      <Text style={[styles.version, { color: colors.textDim }]}>PsyMap v{version}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 20,
  },
  section: {
    paddingHorizontal: 16,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    gap: 14,
  },
  dangerCard: {
    borderColor: '#e94560',
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
    backgroundColor: '#999',
  },
  toggleDotOn: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  version: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 13,
  },
});

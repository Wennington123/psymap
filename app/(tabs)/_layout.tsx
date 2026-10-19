import { Tabs } from 'expo-router';
import React from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { shadow } from '../../constants/ui';

const TAB_ICONS = {
  index: 'home',
  history: 'time',
  statistics: 'bar-chart',
  ranking: 'trophy',
  settings: 'settings',
} as const;

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopWidth: 0,
            paddingTop: 8,
            paddingBottom: 8 + insets.bottom,
            height: 72 + insets.bottom,
            ...(shadow() as object),
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textDim,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            tabBarIcon: ({ focused }) => (
              <Ionicons name={focused ? TAB_ICONS.index : `${TAB_ICONS.index}-outline`} size={24} color={focused ? colors.accent : colors.textDim} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'Histórico',
            tabBarIcon: ({ focused }) => (
              <Ionicons name={focused ? TAB_ICONS.history : `${TAB_ICONS.history}-outline`} size={24} color={focused ? colors.accent : colors.textDim} />
            ),
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            title: 'Estatísticas',
            tabBarIcon: ({ focused }) => (
              <Ionicons name={focused ? TAB_ICONS.statistics : `${TAB_ICONS.statistics}-outline`} size={24} color={focused ? colors.accent : colors.textDim} />
            ),
          }}
        />
        <Tabs.Screen
          name="ranking"
          options={{
            title: 'Ranking',
            tabBarIcon: ({ focused }) => (
              <Ionicons name={focused ? TAB_ICONS.ranking : `${TAB_ICONS.ranking}-outline`} size={24} color={focused ? colors.accent : colors.textDim} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Configurações',
            tabBarIcon: ({ focused }) => (
              <Ionicons name={focused ? TAB_ICONS.settings : `${TAB_ICONS.settings}-outline`} size={24} color={focused ? colors.accent : colors.textDim} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

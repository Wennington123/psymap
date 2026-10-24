import { Tabs } from 'expo-router';
import React from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, Clock, ChartColumn, Trophy, Settings } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { displayFont, shadow } from '../../constants/ui';

const TAB_ICONS = {
  index: House,
  history: Clock,
  statistics: ChartColumn,
  ranking: Trophy,
  settings: Settings,
} as const;

type TabName = keyof typeof TAB_ICONS;

function TabIcon({ tab, focused, color }: { tab: TabName; focused: boolean; color: string }) {
  const Icon = TAB_ICONS[tab];
  return <Icon size={22} color={color} strokeWidth={focused ? 2.6 : 2} />;
}

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
            fontSize: 10.5,
            fontFamily: displayFont(colors, 'bold'),
            letterSpacing: 0.1,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            tabBarIcon: ({ focused, color }) => <TabIcon tab="index" focused={focused} color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'Histórico',
            tabBarIcon: ({ focused, color }) => <TabIcon tab="history" focused={focused} color={color} />,
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            title: 'Gráficos',
            tabBarIcon: ({ focused, color }) => <TabIcon tab="statistics" focused={focused} color={color} />,
          }}
        />
        <Tabs.Screen
          name="ranking"
          options={{
            title: 'Ranking',
            tabBarIcon: ({ focused, color }) => <TabIcon tab="ranking" focused={focused} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Ajustes',
            tabBarIcon: ({ focused, color }) => <TabIcon tab="settings" focused={focused} color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

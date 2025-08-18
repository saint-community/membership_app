import '~/global.css';
import '~/translation';

import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NAV_THEME } from '~/theme';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { queryClient } from '~/lib/react-query/query-client';
import { useEffect, useMemo } from 'react';
import { persister } from '~/utils';
import { useMe } from '~/hooks/data/me';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme } = useColorScheme();

  const isDarkColorScheme = useMemo(() => colorScheme === 'dark', [colorScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />

      <NavThemeProvider value={NAV_THEME[colorScheme ?? 'dark']}>
        <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
          <RootLayoutNav />
          <Toast swipeable />
        </PersistQueryClientProvider>
      </NavThemeProvider>
    </GestureHandlerRootView>
  );
}

const RootLayoutNav = () => {
  const { data: me, isLoading } = useMe();

  useEffect(() => {
    if (me === null) {
      setTimeout(() => {
        router.replace('/(login)/login');
      }, 1000);
    } else {
      setTimeout(() => {
        router.replace('/(drawer)/(tabs)');
      }, 1000);
    }
  }, [me]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" className="text-white" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="(login)" options={{ headerShown: false }} />
    </Stack>
  );
};

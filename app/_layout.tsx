import '~/global.css';
import '~/translation';

import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NAV_THEME } from '~/theme';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { queryClient } from '~/lib/react-query/query-client';
import { useMemo } from 'react';

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
        <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
            <Stack.Screen name="(login)" options={{ headerShown: false }} />
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          </Stack>
          <Toast swipeable />
        </QueryClientProvider>
      </NavThemeProvider>
    </GestureHandlerRootView>
  );
}

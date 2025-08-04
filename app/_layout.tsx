import '~/global.css';
import '~/translation';

import { useColorScheme, useInitialAndroidBarSync } from '~/lib/useColorScheme';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NAV_THEME } from '~/theme';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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
        <Stack
          screenOptions={{
            headerShown: false,
          }}
         >
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(login)" options={{ headerShown: false }} />
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        </Stack>
      </NavThemeProvider>
    </GestureHandlerRootView>
  );
}

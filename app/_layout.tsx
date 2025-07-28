import { Stack } from 'expo-router';
import { NAV_THEME } from '~/theme';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useInitialAndroidBarSync } from '~/lib/useColorScheme';

export default function RootLayout() {
  useInitialAndroidBarSync();
  const isDarkColorScheme = true;
  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
        style={isDarkColorScheme ? 'light' : 'dark'}
      />
      <NavThemeProvider value={NAV_THEME['dark']}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        </Stack>
      </NavThemeProvider>
    </>
  );
}

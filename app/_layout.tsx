import '~/global.css';
import { Stack } from 'expo-router';
import { NAV_THEME } from '~/theme';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useInitialAndroidBarSync, useColorScheme } from '~/lib/useColorScheme';
import {
  useFonts as useInter,
  Inter_400Regular,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  useFonts as usePoppins,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useMemo } from 'react';
import '~/translation';

export default function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme } = useColorScheme();
  console.log('colorScheme', colorScheme);

  const isDarkColorScheme = useMemo(() => colorScheme === 'dark', [colorScheme]);
  const [interLoaded] = useInter({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  const [poppinsLoaded] = usePoppins({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const fontsLoaded = interLoaded && poppinsLoaded;

  if (!fontsLoaded) {
    return null; // or <AppLoading />
  }
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
          }}>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        </Stack>
      </NavThemeProvider>
    </GestureHandlerRootView>
  );
}

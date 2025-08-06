import * as SplashScreen from 'expo-splash-screen';

import { Inter_400Regular, Inter_600SemiBold, useFonts } from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  useFonts as usePoppins,
} from '@expo-google-fonts/poppins';

import Login from './(login)/login';
import LoginLayout from './(login)/_layout';
import OnboardingLayout from './(onboarding)/_layout';
import RootLayout from './_layout';
import { useEffect } from 'react';

export default function Index() {
  // Set the animation options. This is optional.
  SplashScreen.setOptions({
    duration: 1000,
    fade: true,
  });

  SplashScreen.preventAutoHideAsync();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  // TODO: fix this font loading
  const [poppinsLoaded] = usePoppins({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // hide splashscreen after loading artifacts
      SplashScreen.hide();
    }
  }, [fontsLoaded]);

  // simulate returning user
  const USER_LOGGED_IN = false;

  return !USER_LOGGED_IN ? <OnboardingLayout /> : <LoginLayout />;
}

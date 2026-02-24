import * as SplashScreen from 'expo-splash-screen';

import { Inter_400Regular, Inter_600SemiBold, useFonts } from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  useFonts as usePoppins,
} from '@expo-google-fonts/poppins';
import { useEffect } from 'react';

import LoginLayout from './(login)/_layout';
import OnboardingLayout from './(onboarding)/_layout';
import { STORAGE_KEYS } from '~/utils/constants';
import { getStringData } from '~/utils';

export default function Index() {
  const onboardingCompleted = getStringData(STORAGE_KEYS.ONBOARDING_COMPLETED);

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

  if (onboardingCompleted) {
    return <LoginLayout />;
  }

  return <OnboardingLayout />;
}

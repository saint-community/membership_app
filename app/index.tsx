import * as SplashScreen from 'expo-splash-screen';

import { Inter_400Regular, Inter_600SemiBold, useFonts } from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  useFonts as usePoppins,
} from '@expo-google-fonts/poppins';
import { useEffect, useState } from 'react';

import Login from './(login)/login';
import LoginLayout from './(login)/_layout';
import OnboardingLayout from './(onboarding)/_layout';
import RootLayout from './_layout';
import { STORAGE_KEYS } from '~/utils/constants';
import { getStringData } from '~/utils';

export default function Index() {
  // const [auth, setAuth] = useState(false);

  // const loadUserData = async () => {
  //   const isAuthenticated = await getStringData(STORAGE_KEYS.IS_AUTHENTICATED);

  //   if (isAuthenticated) {
  //     setAuth(isAuthenticated);
  //   }
  // };

  // useEffect(() => {
  //   loadUserData();
  // }, []);

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

  const isAuthenticated = async () => await getStringData(STORAGE_KEYS.IS_AUTHENTICATED);

  useEffect(() => {
    if (fontsLoaded) {
      // hide splashscreen after loading artifacts
      SplashScreen.hide();
    }
  }, []);

  return true ? <OnboardingLayout /> : <LoginLayout />;
}

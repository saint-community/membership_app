import { Platform } from 'react-native';

const IOS_SYSTEM_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  light: {
    grey6: 'rgb(249, 248, 248)',
    grey5: 'rgb(239, 237, 238)',
    grey4: 'rgb(229, 227, 228)',
    grey3: 'rgb(215, 210, 213)',
    grey2: 'rgb(186, 178, 182)',
    grey: 'rgb(166, 157, 162)',
    background: 'rgb(249, 246, 247)',
    foreground: 'rgb(5, 3, 4)',
    root: 'rgb(249, 246, 247)',
    card: 'rgb(249, 246, 247)',
    destructive: 'rgb(255, 56, 43)',
    primary: 'rgb(255, 0, 127)',
  },
  dark: {
    grey6: 'rgb(29, 26, 27)',
    grey5: 'rgb(48, 43, 45)',
    grey4: 'rgb(61, 55, 58)',
    grey3: 'rgb(82, 74, 78)',
    grey2: 'rgb(128, 116, 122)',
    grey: 'rgb(165, 155, 160)',
    background: 'rgb(4, 0, 2)',
    foreground: 'rgb(255, 247, 251)',
    root: 'rgb(4, 0, 2)',
    card: 'rgb(4, 0, 2)',
    destructive: 'rgb(254, 67, 54)',
    primary: 'rgb(255, 0, 127)',
  },
} as const;

const ANDROID_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  light: {
    grey6: 'rgb(255, 245, 250)',
    grey5: 'rgb(250, 240, 245)',
    grey4: 'rgb(247, 233, 240)',
    grey3: 'rgb(245, 229, 237)',
    grey2: 'rgb(244, 226, 235)',
    grey: 'rgb(242, 223, 232)',
    background: 'rgb(254, 250, 252)',
    foreground: 'rgb(13, 12, 13)',
    root: 'rgb(254, 250, 252)',
    card: 'rgb(254, 250, 252)',
    destructive: 'rgb(186, 26, 26)',
    primary: 'rgb(255, 0, 127)',
  },
  dark: {
    grey6: 'rgb(33, 23, 28)',
    grey5: 'rgb(42, 29, 36)',
    grey4: 'rgb(49, 33, 41)',
    grey3: 'rgb(56, 36, 46)',
    grey2: 'rgb(59, 38, 49)',
    grey: 'rgb(66, 42, 54)',
    background: 'rgb(28, 21, 24)',
    foreground: 'rgb(235, 224, 230)',
    root: 'rgb(28, 21, 24)',
    card: 'rgb(28, 21, 24)',
    destructive: 'rgb(147, 0, 10)',
    primary: 'rgb(255, 0, 127)',
  },
} as const;

const WEB_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  light: {
    grey6: 'rgb(249, 248, 248)',
    grey5: 'rgb(239, 237, 238)',
    grey4: 'rgb(229, 227, 228)',
    grey3: 'rgb(215, 210, 213)',
    grey2: 'rgb(186, 178, 182)',
    grey: 'rgb(166, 157, 162)',
    background: 'rgb(254, 249, 252)',
    foreground: 'rgb(16, 14, 15)',
    root: 'rgb(254, 249, 252)',
    card: 'rgb(254, 249, 252)',
    destructive: 'rgb(186, 26, 26)',
    primary: 'rgb(255, 0, 127)',
  },
  dark: {
    grey6: 'rgb(29, 26, 27)',
    grey5: 'rgb(48, 43, 45)',
    grey4: 'rgb(61, 55, 58)',
    grey3: 'rgb(82, 74, 78)',
    grey2: 'rgb(128, 116, 122)',
    grey: 'rgb(165, 155, 160)',
    background: 'rgb(27, 18, 22)',
    foreground: 'rgb(234, 220, 227)',
    root: 'rgb(27, 18, 22)',
    card: 'rgb(27, 18, 22)',
    destructive: 'rgb(147, 0, 10)',
    primary: 'rgb(255, 0, 127)',
  },
} as const;

const COLORS =
  Platform.OS === 'ios'
    ? IOS_SYSTEM_COLORS
    : Platform.OS === 'android'
      ? ANDROID_COLORS
      : WEB_COLORS;

export { COLORS };

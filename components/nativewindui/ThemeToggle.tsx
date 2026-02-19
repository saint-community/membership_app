import { Icon } from '@roninoss/icons';
import { Pressable, View } from 'react-native';
import Animated, { LayoutAnimationConfig, ZoomInRotate } from 'react-native-reanimated';

import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';
import { COLORS } from '~/theme/colors';

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  return (

    <LayoutAnimationConfig skipEntering>
      <Pressable
        key={'toggle-' + colorScheme}
        onPress={() => {
          setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
        }}
        className="opacity-80">
        {({ pressed }) => (
          <Animated.View
            className="items-center justify-center"
            key={'toggle-' + colorScheme}
            entering={ZoomInRotate}>
            {colorScheme === 'dark'
              ?
              <View className={cn('px-0.5', pressed && 'opacity-50')}>
                <Icon namingScheme="sfSymbol" name="moon.stars" color={COLORS.white} />
              </View> : <View className={cn('px-0.5', pressed && 'opacity-50')}>
                <Icon namingScheme="sfSymbol" name="sun.min" color={COLORS.black} />
              </View>}
          </Animated.View>

        )}
      </Pressable>
    </LayoutAnimationConfig>
  );
}

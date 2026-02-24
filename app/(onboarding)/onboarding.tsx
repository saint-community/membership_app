import { useRef, useState } from 'react';

import Slide from './_components/slide';
import Swiper from 'react-native-swiper';
import { View } from 'react-native';
import { swipeList } from '~/lib/constants';
import { useRouter } from 'expo-router';
import { STORAGE_KEYS } from '~/utils/constants';
import { storeStringData } from '~/utils';

const Onboarding = () => {
  const router = useRouter();
  const swiperref = useRef<Swiper | null>(null);
  const [buttonText, setButtonText] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const lastSlide = index === swipeList.length - 1;
  const onSwiperIndexChange = (index: number) => {
    setIndex(index);
    if (index === swipeList.length - 1) {
      setButtonText('Get Started');
    }
  };

  const handleButtonPress = () => {
    if (index === swipeList.length - 1) {
      // Mark onboarding as completed and navigate to login
      storeStringData(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      router.replace('/(login)/login');
    } else {
      // Move to next slide
      swiperref.current?.scrollBy(1);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Swiper
        scrollEnabled={false}
        containerStyle={{}}
        index={index}
        loop={false}
        bounces
        contentContainerStyle={{ marginBottom: 40 }}
        onIndexChanged={onSwiperIndexChange}
        horizontal
        ref={swiperref}
        dot={<View className="mx-1 h-1.5 w-1.5 rounded-full bg-[#C4C4C4]" />}
        activeDot={<View className="mx-1 h-1.5 w-5 rounded-full bg-white" />}
        dotStyle={{ position: 'absolute', top: '50%', transform: [{ translateY: -3 }] }}>
        {[
          ...swipeList.map((swipes) => (
            <Slide
              key={swipes?.subject}
              source={swipes?.source}
              description={swipes?.description}
              subject={swipes?.subject}
              onPress={handleButtonPress}
              title={buttonText}
              lastSlide={lastSlide}
            />
          )),
        ]}
      </Swiper>
    </View>
  );
};

export default Onboarding;

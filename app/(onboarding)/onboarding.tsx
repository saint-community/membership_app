import { useMemo, useRef, useState } from 'react';

import Slide from './_components/slide';
import { Dimensions, FlatList, View } from 'react-native';
import { swipeList } from '~/lib/constants';
import { useRouter } from 'expo-router';
import { STORAGE_KEYS } from '~/utils/constants';
import { storeStringData } from '~/utils';

const Onboarding = () => {
  const router = useRouter();
  const listRef = useRef<FlatList<(typeof swipeList)[number]> | null>(null);
  const [buttonText, setButtonText] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const lastSlide = index === swipeList.length - 1;

  const dots = useMemo(() => swipeList.map((_, i) => i), []);

  const pageWidth = Dimensions.get('window').width;

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
      const nextIndex = index + 1;
      onSwiperIndexChange(nextIndex);
      listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <FlatList
        ref={(r) => {
          listRef.current = r;
        }}
        data={swipeList}
        horizontal
        pagingEnabled
        bounces
        scrollEnabled={false}
        keyExtractor={(item) => item.subject}
        renderItem={({ item }) => (
          <Slide
            source={item.source}
            description={item.description}
            subject={item.subject}
            onPress={handleButtonPress}
            title={buttonText}
            lastSlide={lastSlide}
          />
        )}
        getItemLayout={(_, i) => ({ length: pageWidth, offset: pageWidth * i, index: i })}
      />

      <View className="absolute bottom-12 w-full flex-row justify-center">
        {dots.map((i) =>
          i === index ? (
            <View key={i} className="mx-1 h-1.5 w-5 rounded-full bg-white" />
          ) : (
            <View key={i} className="mx-1 h-1.5 w-1.5 rounded-full bg-[#C4C4C4]" />
          )
        )}
      </View>
    </View>
  );
};

export default Onboarding;

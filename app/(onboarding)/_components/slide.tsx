import { ImageBackground, ImageSourcePropType, TouchableOpacity, View } from 'react-native';
import React, { FC } from 'react';

import { FontAwesome6 } from '@expo/vector-icons';
import { Text } from '~/components/nativewindui/Text';
import { useRouter } from 'expo-router';

type Props = {
  subject: string;
  description: string;
  source?: ImageSourcePropType;
  title: string | null;
  onPress: () => void;
  lastSlide: boolean;
};

const Slide: FC<Props> = ({ source, subject, description, title, onPress, lastSlide }) => {
  const router = useRouter();
  const handleSkip = () => {
    router.replace('/(login)/login');
  };

  return (
    <ImageBackground
      source={source}
      resizeMode="cover"
      className="h-full w-full items-center justify-center">
      <View className="absolute inset-0 flex-1 items-center justify-center bg-black/70 pt-[70%]">
        <Text className="mt-60 px-20 text-center text-2xl font-bold text-white">
          {subject ?? ''}
        </Text>
        <Text className="relative mt-2.5 w-[290px] text-center text-base leading-5 text-white">
          {description ?? ''}
        </Text>
        <View className="mt-[90px] w-full flex-row items-center justify-between px-8">
          {!lastSlide && (
            <TouchableOpacity onPress={handleSkip}>
              <Text className="text-xl font-medium text-[#FF007F]">Skip</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className={`h-12 w-12 items-center justify-center rounded-full bg-[#FF007F]  ${
              lastSlide ? 'w-full rounded-lg' : ''
            }`}
            onPress={onPress}>
            {lastSlide ? (
              <Text className="w-full text-center font-semibold text-white">{title}</Text>
            ) : (
              <FontAwesome6 name="arrow-right" color={'white'} size={18} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Slide;

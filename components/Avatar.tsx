import { Image, Text, View } from 'react-native';
import React from 'react';
import { cn } from '~/lib/cn';

interface AvatarProps {
  icon?: React.ReactNode;
  image_url?: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ icon, image_url, className }) => {
  return (
    <View>
      {icon ? (
        <View className={cn("mr-4 h-20 w-20 rounded-full bg-gray-300 items-center justify-center", className)}>
          {icon}
        </View>
      ) : (
        <Image
          source={{
            uri: image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          }}
          className={cn("mr-4 h-20 w-20 rounded-full bg-gray-300", className)}
        />
      )}
    </View>
  );
};

export default Avatar;

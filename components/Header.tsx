import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from './nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import type { HeaderProps } from '~/types/dashboard';
import { useColors } from '~/theme/colors';

export function Header({
  userName = 'Temitope',
  profileImage,
  notificationCount = 1,
  onNotificationPress,
  onProfilePress,
}: HeaderProps) {
  const colors = useColors();
  return (
    <View className="flex-row items-center justify-between px-4 py-6">
      {/* Profile and Greeting */}
      <View className="flex-1 flex-row items-center">
        <TouchableOpacity onPress={onProfilePress} className="mr-3">
          <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-600">
            {profileImage ? (
              <Image source={{ uri: profileImage }} className="h-full w-full" />
            ) : (
              <Ionicons name="person" size={24} color="#9CA3AF" />
            )}
          </View>
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="text-base">Hello! 👋</Text>
          <Text className="text-xl font-bold">{userName}</Text>
        </View>
      </View>

      {/* Notification Icon */}
      <TouchableOpacity onPress={onNotificationPress} className="relative">
        <Ionicons name="notifications" size={24} color={colors.foreground} />
        {notificationCount > 0 && (
          <View className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500" />
        )}
      </TouchableOpacity>
    </View>
  );
}

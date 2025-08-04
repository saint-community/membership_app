import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Text } from '~/components/nativewindui/Text';
import { useRouter } from 'expo-router';

interface ProfileOptionItemProps {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
  showChevron?: boolean;
}

function ProfileOptionItem({ icon, title, onPress, showChevron = true }: ProfileOptionItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-lg bg-gray-800 px-6 py-4">
      <View className="mr-4">{icon}</View>
      <Text className="flex-1 text-base font-medium text-white">{title}</Text>
      {showChevron && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
    </TouchableOpacity>
  );
}

export default function ProfileOption() {
  const router = useRouter();
  return (
    <View className="pt-safe flex-1 bg-black">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header with back button */}
        <View className="flex-row items-center py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <TouchableOpacity
          onPress={() => router.push('/edit-profile')}
          className="mb-6 flex-row items-center rounded-lg px-6 py-6">
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            }}
            className="mr-4 h-20 w-20 rounded-full bg-gray-300"
          />
          <View className="flex-1">
            <Text className="text-lg font-semibold text-white">Temitope Sanusi</Text>
            <Text className="text-sm text-gray-400">temitopesanusi@gmail.com</Text>
          </View>
          <TouchableOpacity onPress={() => console.log('Profile edit pressed')}>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Profile Options */}
        <View className="flex-1 gap-0">
          <ProfileOptionItem
            icon={<Ionicons name="lock-closed" size={20} color="#9CA3AF" />}
            title="Change Password"
            onPress={() => console.log('Change Password pressed')}
          />

          <ProfileOptionItem
            icon={<Ionicons name="notifications" size={20} color="#9CA3AF" />}
            title="Notifications"
            onPress={() => console.log('Notifications pressed')}
          />

          <ProfileOptionItem
            icon={<Ionicons name="settings" size={20} color="#9CA3AF" />}
            title="Settings"
            onPress={() => console.log('Settings pressed')}
          />
        </View>

        {/* Logout Button */}
        <View className="mb-8 mt-auto ">
          <TouchableOpacity
            onPress={() => console.log('Logout pressed')}
            className="flex-row items-center justify-center py-4">
            <MaterialIcons name="logout" size={20} color="#EF4444" />
            <Text className="ml-2 text-base font-medium text-red-500">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

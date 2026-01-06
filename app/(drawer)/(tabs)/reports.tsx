import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Reports() {
  const router = useRouter();
  const reportItems = [
    {
      icon: <Ionicons name="add-circle-outline" size={24} color="#4ECDC4" />,
      title: 'Evangelism Report',
      subtitle: 'Daily Evangelism Report',
      onPress: () => router.push('/evangelism/main'),
    },
    {
      icon: <MaterialIcons name="bar-chart" size={24} color="#FF6B9D" />,
      title: 'Attendance',
      subtitle: 'All services attendance can be added here',
      onPress: () => router.push('/attendance/main'),
    },
    {
      icon: <FontAwesome5 name="tasks" size={24} color="#FFD93D" />,
      title: 'Follow Up',
      subtitle: 'All follow up activities can be added here',
      onPress: () => router.push('/follow-up/main'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <View className="mb-6 px-6 pt-4">
          <View className="mb-6 w-full flex-row items-center justify-between">
            <View className="w-[25px]" />
            <Text className="text-2xl font-bold">Reports</Text>
            <View className="w-[25px]" />
          </View>

          <View className="gap-3">
            {reportItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.onPress}
                className="flex-row items-center justify-between rounded-lg bg-white p-4 dark:bg-gray-800">
                <View className="flex-1 flex-row items-center">
                  <View className="mr-4">{item.icon}</View>
                  <View className="flex-1">
                    <Text className="mb-1 text-base font-semibold">{item.title}</Text>
                    <Text className="text-sm text-gray-400">{item.subtitle}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

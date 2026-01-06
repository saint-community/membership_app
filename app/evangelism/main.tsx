import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '~/lib/useColorScheme';

export default function EvangelismMain() {
  const router = useRouter();
  const colors = useColors();

  const actionCards = [
    {
      icon: (
        <View className="relative h-12 w-12 items-center justify-center rounded-lg bg-[#22C55E]">
          <Ionicons name="document-text-outline" size={20} color="white" />
          <View className="absolute -bottom-0.5 -right-0.5 h-5 w-5 items-center justify-center rounded-full bg-white">
            <Ionicons name="add" size={12} color="#22C55E" />
          </View>
        </View>
      ),
      title: 'Submit a New Report',
      subtitle: 'Daily Evangelism Report',
      onPress: () => router.push('/evangelism/submit-report'),
    },
    {
      icon: (
        <View className="h-12 w-12 items-center justify-center rounded-lg bg-[#FF007F]">
          <MaterialIcons name="bar-chart" size={20} color="white" />
        </View>
      ),
      title: 'View all Reports',
      subtitle: 'View evangelism tracker',
      onPress: () => router.push('/evangelism/report-filter'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black dark:text-white">Evangelism Tracker</Text>
        <View className="w-6" />
      </View>

      {/* Main Content */}
      <View className="flex-1 px-4 pt-6">
        <View className="gap-4">
          {actionCards.map((card, index) => (
            <TouchableOpacity
              key={index}
              onPress={card.onPress}
              className="flex-row items-center justify-between rounded-lg bg-white p-4 dark:bg-gray-800">
              <View className="flex-1 flex-row items-center">
                <View className="mr-4">{card.icon}</View>
                <View className="flex-1">
                  <Text className="mb-1 text-base font-semibold text-black dark:text-white">
                    {card.title}
                  </Text>
                  <Text className="text-sm text-gray-400">{card.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

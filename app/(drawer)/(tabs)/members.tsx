import MembersList from '~/components/members/membersList';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useColors } from '~/lib/useColorScheme';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Members() {
  const router = useRouter();
  const colors = useColors();
  return (
    <View className="p-safe flex-1 px-4 dark:bg-black ">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold dark:text-white">My Members</Text>
        <View style={{ width: 24 }} />
      </View>

      <MembersList />
    </View>
  );
}

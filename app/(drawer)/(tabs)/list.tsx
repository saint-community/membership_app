import { View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';

export default function List() {
  return (
    <View className="p-safe flex-1 items-center justify-center">
      <Text className="text-2xl font-bold text-white">List</Text>
    </View>
  );
}

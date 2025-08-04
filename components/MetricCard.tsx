import { View, TouchableOpacity } from 'react-native';
import { Text } from './nativewindui/Text';

interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  onPress?: () => void;
}

export function MetricCard({ icon, value, label, onPress }: MetricCardProps) {
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent onPress={onPress} className="flex-1 rounded-lg bg-gray-800 px-4 py-6">
      <View className="gap-3">
        <View>{icon}</View>
        <Text className="text-2xl font-bold text-white">{value}</Text>
        <Text className="text-md text-gray-300">{label}</Text>
      </View>
    </CardComponent>
  );
}

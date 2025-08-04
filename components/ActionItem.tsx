import { View, TouchableOpacity } from 'react-native';
import { Text } from './nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '~/lib/cn';

interface ActionItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  iconColor?: string;
  onPress?: () => void;
  className?: string;
}

export function ActionItem({
  icon,
  title,
  subtitle,
  iconColor = '#FF6B9D',
  onPress,
  className,
}: ActionItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn('flex-row items-center justify-between rounded-lg bg-gray-800 p-4', className)}>
      <View className="flex-1 flex-row items-center">
        <View className="mr-4">{icon}</View>
        <View className="flex-1">
          <Text className="mb-1 text-base font-medium text-white">{title}</Text>
          <Text className="text-sm text-gray-400">{subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

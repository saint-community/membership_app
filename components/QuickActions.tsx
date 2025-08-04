import { View } from 'react-native';
import { Text } from './nativewindui/Text';
import { ActionItem } from './ActionItem';
import type { ActionData } from '~/types/dashboard';

interface QuickActionsProps {
  title?: string;
  actions: ActionData[];
}

export function QuickActions({ title = 'Quick Actions', actions }: QuickActionsProps) {
  return (
    <View className="px-4">
      <Text className="mb-4 text-lg font-semibold text-white">{title}</Text>
      <View className="gap-3">
        {actions.map((action, index) => (
          <ActionItem
            key={index}
            icon={action.icon}
            title={action.title}
            subtitle={action.subtitle}
            onPress={action.onPress}
          />
        ))}
      </View>
    </View>
  );
}

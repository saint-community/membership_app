import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ParticipantChipProps = {
  name: string;
  onRemove?: () => void;
};

export function ParticipantChip({ name, onRemove }: ParticipantChipProps) {
  return (
    <View className="mb-2 mr-2 flex-row items-center rounded-md bg-[#303030] px-2 py-1">
      <Text className="text-foreground">{name}</Text>
      {onRemove ? (
        <TouchableOpacity onPress={onRemove} className="ml-2">
          <Ionicons name="close" size={14} color="#ffffff" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

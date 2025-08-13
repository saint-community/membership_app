import { View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import BottomSheetWrapper from '~/components/ui/BottomSheetWrapper';
import { Button } from '~/components/Button';
import { Ionicons } from '@expo/vector-icons';

type ConfirmationSheetProps = {
  visible: boolean;
  names: string[];
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationSheet({ visible, names, onConfirm, onCancel }: ConfirmationSheetProps) {
  if (!visible) return null;

  return (
    <BottomSheetWrapper snapPoints={['50%']} enablePanDownToClose={false}>
      <View className="flex-1 items-center">
        <Ionicons name="alert-circle-outline" size={120} color="#FFA000" />
        <Text className="leading my-3 text-center text-[16px]  dark:text-white">
          You are about to mark prayer group attendance for{' '}
          <Text className="mb-6 text-center font-semibold">{formatListWithAnd(names)}</Text>
        </Text>
        <View className="my-2 w-full flex-row gap-3">
          <Button title="Cancel" onPress={onCancel} className="flex-1 bg-gray-500 dark:bg-muted" />
          <Button title="Confirm" onPress={onConfirm} className="flex-1" />
        </View>
      </View>
    </BottomSheetWrapper>
  );
}

const formatListWithAnd = (names: string[]) => {
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
};

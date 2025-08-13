import { View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import BottomSheetWrapper from '~/components/ui/BottomSheetWrapper';
import { Ionicons } from '@expo/vector-icons';

type ResultType = 'success' | 'error' | 'done';

type ResultSheetProps = {
  visible: boolean;
  type: ResultType;
  message: string;
  onClose: () => void;
};

export function ResultSheet({ visible, type, message, onClose }: ResultSheetProps) {
  if (!visible) return null;

  const icon =
    type === 'error' ? (
      <Ionicons name="close-circle-outline" size={100} color="#D32F2F" />
    ) : (
      <Ionicons name="checkmark-circle-outline" size={100} color="#4CAF50" />
    );

  return (
    <BottomSheetWrapper
      initialIndex={0}
      snapPoints={['50%']}
      enablePanDownToClose
      onSheetChange={(i) => {
        if (i === -1) onClose();
      }}>
      <View className="min-h-[250px] flex-1 items-center justify-center">
        {icon}
        <Text className="mt-4 max-w-[220px] text-center text-base">{message}</Text>
      </View>
    </BottomSheetWrapper>
  );
}

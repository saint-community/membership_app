import { useMemo, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import BottomSheetWrapper from '~/components/ui/BottomSheetWrapper';
import { Text } from '~/components/nativewindui/Text';
import { Button } from '~/components/Button';

export type Participant = {
  id: string;
  name: string;
};

type ParticipantSelectorSheetProps = {
  visible: boolean; // controlled by mounting/unmounting parent
  participants: Participant[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onDone: () => void;
};

export function ParticipantSelectorSheet({
  visible,
  participants,
  selectedIds,
  onToggle,
  onDone,
}: ParticipantSelectorSheetProps) {
  const [index] = useState(0);
  const data = useMemo(() => participants, [participants]);

  if (!visible) return null;

  return (
    <BottomSheetWrapper
      initialIndex={index}
      snapPoints={['80%', '90%']}
      enablePanDownToClose
      onSheetChange={(i) => {
        if (i === -1) onDone();
      }}>
      <View className="mb-4">
        <Text className="text-center text-base font-semibold">Select Participant</Text>
        <Text className="text-center text-muted-foreground">Multiple selection allowed</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const selected = selectedIds.includes(item.id);
          return (
            <TouchableOpacity
              onPress={() => onToggle(item.id)}
              className="mb-3 flex-row items-center justify-between rounded-xl px-4 py-3">
              <Text className="">{item.name}</Text>
              <View
                className={`h-5 w-5 items-center justify-center rounded ${
                  selected
                    ? 'border border-border bg-primary'
                    : 'border border-gray-600 dark:border-white'
                }`}
              />
            </TouchableOpacity>
          );
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
      <Button title="Done" onPress={onDone} className="mt-4" isLoading={false} />
    </BottomSheetWrapper>
  );
}

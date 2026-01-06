import { useMemo, useState } from 'react';
import { FlatList, TouchableOpacity, View, TextInput } from 'react-native';
import BottomSheetWrapper from '~/components/ui/BottomSheetWrapper';
import { Text } from '~/components/nativewindui/Text';
import { Button } from '~/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '~/lib/cn';

export type Participant = {
  _id: string;
  full_name: string;
};

type ParticipantSelectorSheetProps = {
  visible: boolean; // controlled by mounting/unmounting parent
  participants: Participant[];
  selectedIds?: string[];
  onToggle: (id: string) => void;
  onDone?: () => void;
  singleSelection?: boolean;
  showFirstTimers?: boolean;
  firstTimers?: string[];
  onFirstTimersChange?: (firstTimers: string[]) => void;
};

export function ParticipantSelectorSheet({
  visible,
  participants,
  selectedIds = [],
  onToggle,
  onDone,
  singleSelection,
  showFirstTimers = false,
  firstTimers = [],
  onFirstTimersChange,
}: ParticipantSelectorSheetProps) {
  const [index] = useState(0);
  const data = useMemo(() => participants, [participants]);
  const [input, setInput] = useState<string>('');

  const handleAddFirstTimer = (index: number) => {
    const name = input.trim();
    if (name && !firstTimers.includes(name)) {
      const newFirstTimers = [...firstTimers, name];
      onFirstTimersChange?.(newFirstTimers);
      // Clear the input
      setInput('');
    }
  };

  const handleRemoveFirstTimer = (index: number) => {
    const newFirstTimers = firstTimers.filter((_, i) => i !== index);
    onFirstTimersChange?.(newFirstTimers);
  };

  if (!visible) return null;

  return (
    <BottomSheetWrapper
      initialIndex={index}
      snapPoints={['80%', '90%']}
      enablePanDownToClose
      onSheetChange={(i) => {
        if (i === -1) onDone?.();
      }}>
      <View className="mb-4">
        <Text className="text-center text-base font-semibold">Select Participant</Text>
        {!singleSelection && (
          <Text className="text-center text-muted-foreground">Multiple selection allowed</Text>
        )}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const selected = selectedIds.includes(item._id);
          return (
            <TouchableOpacity
              onPress={() => onToggle(item._id)}
              className="mb-3 flex-row items-center justify-between rounded-xl px-4 py-3">
              <Text className="">{item.full_name}</Text>
              {!singleSelection && (
                <View
                  className={`h-5 w-5 items-center justify-center rounded ${
                    selected
                      ? 'border border-border bg-primary'
                      : 'border border-gray-600 dark:border-white'
                  }`}
                />
              )}
            </TouchableOpacity>
          );
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: showFirstTimers ? 0 : 16 }}
        ListFooterComponent={
          showFirstTimers ? (
            <View className="mt-4 border-t border-gray-600 pt-4 dark:border-gray-400">
              <Text className="mb-3 text-sm font-semibold text-black dark:text-white">
                Add First Timer(s) (if any)
              </Text>

              {/* First Timer Input Fields */}
              <View className="mb-4 gap-2">
                <View key={index} className="mb-2 flex-row items-center gap-2">
                  <TextInput
                    className={cn(
                      'h-14 flex-1 rounded-xl border border-gray-400 bg-transparent px-4 py-3 text-base text-black dark:border-gray-600 dark:text-white'
                    )}
                    placeholder="First Timer Name"
                    placeholderTextColor="#666"
                    value={input}
                    onChangeText={(text) => setInput(text)}
                    // onSubmitEditing={() => handleAddFirstTimer(index)}
                  />
                  {input.trim() && (
                    <TouchableOpacity
                      onPress={() => handleAddFirstTimer(index)}
                      className="h-14 w-14 items-center justify-center rounded-xl bg-[#FF007F]">
                      <Ionicons name="checkmark" size={24} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Added First Timers List */}
              {firstTimers.length > 0 && (
                <View className="gap-2">
                  <Text className="mb-2 text-xs font-semibold text-gray-400">
                    Added First Timers:
                  </Text>
                  {firstTimers.map((firstTimer, index) => (
                    <View
                      key={index}
                      className="mb-2 flex-row items-center justify-between rounded-xl border border-gray-400 bg-transparent px-4 py-3 dark:border-gray-600">
                      <Text className="flex-1 text-base text-black dark:text-white">
                        {firstTimer}
                      </Text>
                      <TouchableOpacity onPress={() => handleRemoveFirstTimer(index)}>
                        <Ionicons name="close-circle" size={24} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ) : null
        }
      />
      {!singleSelection && (
        <Button title="Done" onPress={onDone} className="mt-4" isLoading={false} />
      )}
    </BottomSheetWrapper>
  );
}

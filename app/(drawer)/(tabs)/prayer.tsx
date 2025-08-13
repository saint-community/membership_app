import { useMemo, useState } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Button } from '~/components/Button';
import { ParticipantChip } from '~/components/prayer/ParticipantChip';
import {
  ParticipantSelectorSheet,
  type Participant,
} from '~/components/prayer/ParticipantSelectorSheet';
import { ConfirmationSheet } from '~/components/prayer/ConfirmationSheet';
import { ResultSheet } from '~/components/prayer/ResultSheet';

export default function Prayer() {
  const participants: Participant[] = useMemo(
    () => [
      { id: '1', name: 'Myself' },
      { id: '2', name: 'Akachukwu Blessing' },
      { id: '3', name: 'Bolu Salewd' },
      { id: '4', name: 'Celine Ugpa' },
      { id: '5', name: 'David John' },
      { id: '6', name: 'Emmanuel GOAT' },
      { id: '7', name: 'Emmanuel Goat' },
    ],
    []
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [code, setCode] = useState('');
  const [showSelect, setShowSelect] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<null | { type: 'success' | 'error'; message: string }>(null);

  const selectedNames = useMemo(
    () => participants.filter((p) => selectedIds.includes(p.id)).map((p) => p.name),
    [participants, selectedIds]
  );

  const toggleId = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const removeId = (id: string) => setSelectedIds((prev) => prev.filter((x) => x !== id));

  const handleMarkAttendance = () => {
    if (selectedIds.length === 0 || code.length !== 6) {
      setResult({
        type: 'error',
        message: 'Oops! We love your zeal but not that code. Input a valid code and try again.',
      });
      return;
    }
    setShowConfirm(true);
  };

  const confirmMark = () => {
    setShowConfirm(false);
    if (code === '123456') {
      setResult({
        type: 'success',
        message: 'You have successfully marked your prayer group attendance.',
      });
    } else {
      setResult({
        type: 'error',
        message: 'Oops! We love your zeal but not that code. Input a valid code and try again.',
      });
    }
  };

  return (
    <View className="py-safe flex-1 bg-background pb-10">
      <View className="flex-1 px-4 pb-[100px]">
        <View className="flex-1">
          <Text className="mb-8 text-xl font-bold">Prayer Meetings</Text>

          <TouchableOpacity
            onPress={() => setShowSelect(true)}
            className="mb-4 min-h-14 rounded-xl border border-gray-600 bg-transparent px-4 py-3 dark:border-white">
            {selectedIds.length === 0 ? (
              <Text className="text-base dark:text-muted-foreground">Select participants</Text>
            ) : (
              <View className="flex-row flex-wrap">
                {selectedIds.map((id) => {
                  const p = participants.find((x) => x.id === id);
                  if (!p) return null;
                  return <ParticipantChip key={id} name={p.name} onRemove={() => removeId(id)} />;
                })}
              </View>
            )}
          </TouchableOpacity>

          {/* Code input */}
          <TextInput
            className={`h-14 w-full rounded-xl border  border-gray-600 bg-transparent px-4 py-3 text-base dark:border-white dark:text-white`}
            placeholder="Input 6 digits code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>
        <Button
          title="Mark Attendance"
          onPress={handleMarkAttendance}
          disabled={selectedIds.length === 0 || code.length !== 6}
        />
      </View>

      <ParticipantSelectorSheet
        visible={showSelect}
        participants={participants}
        selectedIds={selectedIds}
        onToggle={toggleId}
        onDone={() => setShowSelect(false)}
      />

      <ConfirmationSheet
        visible={showConfirm}
        names={selectedNames}
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmMark}
      />

      <ResultSheet
        visible={!!result}
        type={result?.type === 'success' ? 'success' : result ? 'error' : 'success'}
        message={result?.message ?? ''}
        onClose={() => setResult(null)}
      />
    </View>
  );
}

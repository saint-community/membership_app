import { useMemo, useState } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Button } from '~/components/Button';
import { ParticipantChip } from '~/components/prayer/ParticipantChip';
import { ParticipantSelectorSheet } from '~/components/prayer/ParticipantSelectorSheet';
import { ConfirmationSheet } from '~/components/prayer/ConfirmationSheet';
import { ResultSheet } from '~/components/prayer/ResultSheet';
import { useGetAllMembers } from '~/hooks/queries/members/useGetAllMembers';
import { markPrayerAttendance } from '~/services/api/prayer';
import { useMutation } from '@tanstack/react-query';

export default function Prayer() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [code, setCode] = useState('');
  const [showSelect, setShowSelect] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<null | { type: 'success' | 'error'; message: string }>(null);
  const { data } = useGetAllMembers();

  const participants = useMemo(
    () =>
      (Array.isArray(data?.data)
        ? [{ _id: 'self', full_name: 'Myself' }, ...data.data]
        : [{ _id: 'self', full_name: 'Myself' }]) as any,
    [data?.data]
  );

  const selectedNames = useMemo(
    () => participants.filter((p: any) => selectedIds.includes(p._id)).map((p: any) => p.full_name),
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

  const mutation = useMutation({
    mutationFn: (data: { attendees: string[]; prayer_code: string }) => {
      return markPrayerAttendance(data);
    },
    onSuccess: () => {
      setCode('');
      setSelectedIds([]);
      setResult({
        type: 'success',
        message: 'You have successfully marked your prayer group attendance.',
      });
    },
    onError: (err: any) => {
      console.log('err', err);
      setResult({
        type: 'error',
        message:
          err?.response?.data?.message ||
          'Oops! We love your zeal but not that code. Input a valid code and try again.',
      });
    },
  });

  const confirmMark = () => {
    setShowConfirm(false);
    mutation.mutate({
      attendees: selectedIds,
      prayer_code: code,
    });
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
                  const p = participants.find((x: any) => x._id === id);
                  if (!p) return null;
                  return (
                    <ParticipantChip key={id} name={p.full_name} onRemove={() => removeId(id)} />
                  );
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
          isLoading={mutation.isPending}
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

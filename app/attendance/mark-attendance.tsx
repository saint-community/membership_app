import { useState, useMemo } from 'react';
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
import { useGetAllMembers } from '~/hooks/queries/members/useGetAllMembers';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '~/lib/useColorScheme';
import { useMarkAttendance } from '~/hooks/data/attendance';
import Toast from 'react-native-toast-message';

export default function MarkAttendance() {
  const router = useRouter();
  const { title = 'Sunday Service' } = useLocalSearchParams<{ title?: string }>();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [code, setCode] = useState('');
  const [showSelect, setShowSelect] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<null | { type: 'success' | 'error'; message: string }>(null);
  const { data } = useGetAllMembers();
  const colors = useColors();
  const [firstTimers, setFirstTimers] = useState<Array<{ name: string; phone: string; email: string }>>([]);
  const markAttendanceMutation = useMarkAttendance();

  const participants = useMemo(
    () =>
      (Array.isArray(data?.data)
        ? [{ _id: 'self', full_name: 'Myself' }, ...data.data]
        : []) as Participant[],
    [data?.data]
  );

  const selectedNames = useMemo(
    () => participants.filter((p) => selectedIds.includes(p._id)).map((p) => p.full_name),
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
    
    // Transform first timers to the required format
    const firstTimersDetails = firstTimers.map((ft) => ({
      name: ft.name,
      phone: ft.phone || '',
      email: ft.email || '',
    }));

    markAttendanceMutation.mutate(
      {
        attendance_code: code,
        first_timers_count: firstTimers.length,
        first_timers_details: firstTimersDetails,
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            setCode('');
            setSelectedIds([]);
            setFirstTimers([]);
            setResult({
              type: 'success',
              message: response.message || 'You have successfully marked your attendance.',
            });
          } else {
            setResult({
              type: 'error',
              message: response.message || 'Failed to mark attendance',
            });
          }
        },
        onError: (error: any) => {
          setResult({
            type: 'error',
            message: error?.message || 'Failed to mark attendance',
          });
        },
      }
    );
  };

  return (
    <View className="py-safe flex-1 bg-background pb-10">
      <View className="mb-4 flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black dark:text-white">{title}</Text>
        <View />
      </View>
      <View className="flex-1 px-4 pb-[100px]">
        <View className="flex-1">
          <TouchableOpacity
            onPress={() => setShowSelect(true)}
            className="mb-4 min-h-14 rounded-xl border border-gray-600 bg-transparent px-4 py-3 dark:border-white">
            {selectedIds.length === 0 ? (
              <Text className="text-base dark:text-muted-foreground">Select participants</Text>
            ) : (
              <View className="flex-row flex-wrap">
                {selectedIds.map((id) => {
                  const p = participants.find((x) => x._id === id);
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
            className="h-14 w-full rounded-xl border border-gray-600 bg-transparent px-4 py-3 text-base dark:border-white dark:text-white"
            placeholder="Input 6 digits code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            placeholderTextColor="#666"
          />
        </View>
        <Button
          title="Mark Attendance"
          onPress={handleMarkAttendance}
          disabled={selectedIds.length === 0 || code.length !== 6 || markAttendanceMutation.isPending}
        />
      </View>

      <ParticipantSelectorSheet
        visible={showSelect}
        showFirstTimers
        participants={participants}
        selectedIds={selectedIds}
        onToggle={toggleId}
        onDone={() => setShowSelect(false)}
        firstTimers={firstTimers.map((ft) => ft.name)}
        onFirstTimersChange={(names) => {
          // Convert string array to object array with required fields
          const newFirstTimers = names.map((name) => {
            const existing = firstTimers.find((ft) => ft.name === name);
            return existing || { name, phone: '', email: '' };
          });
          setFirstTimers(newFirstTimers);
        }}
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
        onClose={() => {
          setResult(null);
          if (result?.type === 'success') {
            router.back();
          }
        }}
      />
    </View>
  );
}

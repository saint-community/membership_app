import { useState, useMemo } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '~/components/Button';
import { cn } from '~/lib/cn';
import { useCreateFollowUpRecord } from '~/hooks/data/followUp';
import { useGetAllMembers } from '~/hooks/queries/members/useGetAllMembers';
import { ParticipantSelectorSheet } from '~/components/prayer/ParticipantSelectorSheet';
import { DatePicker } from '~/components/common/DatePicker';
import { TimePicker } from '~/components/common/TimePicker';
import { DurationPicker } from '~/components/common/DurationPicker';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

interface Record {
  members_taught: Array<{ id: string; name: string }>;
  topic: string;
  material: string;
  duration_minutes: number;
  comments: string;
}

export default function AddRecordTab() {
  const router = useRouter();
  const { data: membersData } = useGetAllMembers();
  const createFollowUpMutation = useCreateFollowUpRecord();

  const [sessionDate, setSessionDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [locationArea, setLocationArea] = useState('');
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
  const [showParticipantSelector, setShowParticipantSelector] = useState(false);
  const [records, setRecords] = useState<Record[]>([]);
  const [currentRecord, setCurrentRecord] = useState<Partial<Record>>({
    members_taught: [],
    topic: '',
    material: '',
    duration_minutes: 0,
    comments: '',
  });
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showMemberSelector, setShowMemberSelector] = useState(false);

  const participants = useMemo(
    () =>
      (Array.isArray(membersData?.data)
        ? [{ _id: 'self', full_name: 'Myself' }, ...membersData.data]
        : []) as any,
    [membersData?.data]
  );

  const selectedParticipantNames = useMemo(
    () =>
      participants
        .filter((p: any) => selectedParticipantIds.includes(p._id))
        .map((p: any) => p.full_name)
        .join(', '),
    [participants, selectedParticipantIds]
  );

  const selectedMemberNames = useMemo(
    () =>
      participants
        .filter((p: any) => (currentRecord.members_taught || []).some((mt) => mt.id === p._id))
        .map((p: any) => p.full_name)
        .join(', '),
    [participants, currentRecord.members_taught]
  );

  const toggleParticipant = (id: string) => {
    setSelectedParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleMemberTaught = (id: string) => {
    const member = participants.find((p: any) => p._id === id);
    if (!member) return;

    const currentMembers = currentRecord.members_taught || [];
    const exists = currentMembers.find((m) => m.id === id);

    if (exists) {
      setCurrentRecord({
        ...currentRecord,
        members_taught: currentMembers.filter((m) => m.id !== id),
      });
    } else {
      setCurrentRecord({
        ...currentRecord,
        members_taught: [...currentMembers, { id: member._id, name: member.full_name }],
      });
    }
  };

  const handleAddRecord = () => {
    if (
      !currentRecord.topic ||
      !currentRecord.material ||
      !currentRecord.duration_minutes ||
      (currentRecord.members_taught || []).length === 0
    ) {
      Toast.show({
        text1: 'Please fill in all required fields for the record',
        type: 'error',
      });
      return;
    }

    const newRecord: Record = {
      members_taught: currentRecord.members_taught || [],
      topic: currentRecord.topic || '',
      material: currentRecord.material || '',
      duration_minutes: currentRecord.duration_minutes || 0,
      comments: currentRecord.comments || '',
    };

    setRecords([...records, newRecord]);
    setCurrentRecord({
      members_taught: [],
      topic: '',
      material: '',
      duration_minutes: 0,
      comments: '',
    });
    setShowAddRecord(false);
  };

  const handleRemoveRecord = (index: number) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!sessionDate || !startTime || !locationArea || selectedParticipantIds.length === 0) {
      Toast.show({
        text1: 'Please fill in all required session fields',
        type: 'error',
      });
      return;
    }

    if (records.length === 0) {
      Toast.show({
        text1: 'Please add at least one record',
        type: 'error',
      });
      return;
    }

    // Transform participants to TeamMemberDto format
    const teamMembers = selectedParticipantIds.map((id) => {
      const participant = participants.find((p: any) => p._id === id);
      if (id === 'self') {
        return {
          id: 'self',
          type: 'worker' as const,
          name: 'Myself',
        };
      }
      return {
        id: participant?._id || id,
        type: 'member' as const,
        name: participant?.full_name || '',
      };
    });

    // Transform records to FollowUpRecordDto format
    const followUpRecords = records.map((record) => ({
      members_taught: record.members_taught,
      topic: record.topic,
      material: record.material,
      duration_minutes: record.duration_minutes,
      comments: record.comments,
    }));
    try {
      await createFollowUpMutation.mutateAsync({
        session_date: sessionDate,
        start_time: startTime,
        location_area: locationArea,
        participants: teamMembers,
        records: followUpRecords,
      });
      setSessionDate('');
      setStartTime('');
      setLocationArea('');
      setSelectedParticipantIds([]);
      setRecords([]);
      setCurrentRecord({
        members_taught: [],
        topic: '',
        material: '',
        duration_minutes: 0,
        comments: '',
      });
      setShowParticipantSelector(false);
      setShowMemberSelector(false);
      setShowAddRecord(false);
      Toast.show({
        text1: 'Follow-up record submitted successfully',
        type: 'success',
      });
    } catch (error) {
      Toast.show({
        text1: error?.message || 'Failed to submit follow-up record',
        type: 'error',
      });
    }
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-4">
        {/* Session Information */}
        <View className="mb-6">
          <Text className="mb-4 text-lg font-semibold text-black dark:text-white">
            Session Information
          </Text>

          {/* Session Date */}
          <View className="mb-4">
            <DatePicker value={sessionDate} onChange={setSessionDate} placeholder="Session Date" />
          </View>

          {/* Start Time */}
          <View className="mb-4">
            <TimePicker value={startTime} onChange={setStartTime} placeholder="Select start time" />
          </View>

          {/* Location Area */}
          <View className="mb-4">
            <TextInput
              className={cn(
                'h-14 w-full rounded-xl border border-gray-600 bg-transparent px-4 py-3 text-base text-black dark:border-white dark:text-white'
              )}
              placeholder="Location Area"
              placeholderTextColor="#666"
              value={locationArea}
              onChangeText={setLocationArea}
            />
          </View>

          {/* Participants */}
          <View className="mb-4">
            <TouchableOpacity
              onPress={() => setShowParticipantSelector(true)}
              className={cn(
                'h-14 w-full flex-row items-center justify-between rounded-xl border border-gray-600 bg-transparent px-4 py-3 dark:border-white'
              )}>
              <Text
                className={cn(
                  'flex-1 text-base',
                  selectedParticipantNames
                    ? 'text-black dark:text-white'
                    : 'text-gray-400 dark:text-gray-400'
                )}>
                {selectedParticipantNames || 'Select participants'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Records Section */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-black dark:text-white">
              Records ({records.length})
            </Text>
            <TouchableOpacity
              onPress={() => setShowAddRecord(!showAddRecord)}
              className="rounded-lg bg-[#FF007F] px-4 py-2">
              <Text className="text-sm font-semibold text-white">
                {showAddRecord ? 'Cancel' : '+ Add Record'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Add Record Form */}
          {showAddRecord && (
            <View className="mb-4 rounded-lg border border-gray-400 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
              <Text className="mb-4 text-base font-semibold text-black dark:text-white">
                Add New Record
              </Text>

              {/* Who did you teach? */}
              <View className="mb-4">
                <TouchableOpacity
                  onPress={() => setShowMemberSelector(true)}
                  className={cn(
                    'h-14 w-full flex-row items-center justify-between rounded-xl border border-gray-400 bg-transparent px-4 py-3 dark:border-gray-600'
                  )}>
                  <Text
                    className={cn(
                      'flex-1 text-base',
                      selectedMemberNames
                        ? 'text-black dark:text-white'
                        : 'text-gray-400 dark:text-gray-400'
                    )}>
                    {selectedMemberNames || 'Who did you teach?'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Topic */}
              <View className="mb-4">
                <TextInput
                  className={cn(
                    'h-14 w-full rounded-xl border border-gray-400 bg-transparent px-4 py-3 text-base text-black dark:border-gray-600 dark:text-white'
                  )}
                  placeholder="What Subject did you teach?"
                  placeholderTextColor="#666"
                  value={currentRecord.topic}
                  onChangeText={(text) => setCurrentRecord({ ...currentRecord, topic: text })}
                />
              </View>

              {/* Material */}
              <View className="mb-4">
                <TextInput
                  className={cn(
                    'h-14 w-full rounded-xl border border-gray-400 bg-transparent px-4 py-3 text-base text-black dark:border-gray-600 dark:text-white'
                  )}
                  placeholder="Material taught from (state if audio/written)"
                  placeholderTextColor="#666"
                  value={currentRecord.material}
                  onChangeText={(text) => setCurrentRecord({ ...currentRecord, material: text })}
                />
              </View>

              {/* Duration */}
              <View className="mb-4">
                <DurationPicker
                  value={currentRecord.duration_minutes || 0}
                  onChange={(minutes) =>
                    setCurrentRecord({
                      ...currentRecord,
                      duration_minutes: minutes,
                    })
                  }
                  placeholder="Select duration"
                />
              </View>

              {/* Comments */}
              <View className="mb-4">
                <TextInput
                  className={cn(
                    'min-h-32 w-full rounded-xl border border-gray-400 bg-transparent px-4 py-3 text-base text-black dark:border-gray-600 dark:text-white'
                  )}
                  placeholder="Additional Comments"
                  placeholderTextColor="#666"
                  value={currentRecord.comments}
                  onChangeText={(text) => setCurrentRecord({ ...currentRecord, comments: text })}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <Button title="Add Record" onPress={handleAddRecord} />
            </View>
          )}

          {/* Records List */}
          {records.length > 0 && (
            <View className="gap-3">
              {records.map((record, index) => (
                <View
                  key={index}
                  className="rounded-lg border border-gray-400 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
                  <View className="mb-2 flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="mb-1 text-base font-semibold text-black dark:text-white">
                        {record.topic}
                      </Text>
                      <Text className="text-sm text-gray-400">
                        {record.members_taught.map((m) => m.name).join(', ')}
                      </Text>
                      <Text className="text-sm text-gray-400">
                        {record.material} • {record.duration_minutes} minutes
                      </Text>
                      {record.comments && (
                        <Text className="mt-2 text-sm text-gray-400">{record.comments}</Text>
                      )}
                    </View>
                    <TouchableOpacity onPress={() => handleRemoveRecord(index)}>
                      <Ionicons name="close-circle" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {records.length === 0 && !showAddRecord && (
            <View className="rounded-lg border border-gray-400 bg-white p-8 dark:border-gray-600 dark:bg-gray-800">
              <Text className="text-center text-gray-400">No records added yet</Text>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <Button
          title="Submit"
          onPress={handleSubmit}
          disabled={
            !sessionDate ||
            !startTime ||
            !locationArea ||
            selectedParticipantIds.length === 0 ||
            records.length === 0 ||
            createFollowUpMutation.isPending
          }
        />
      </View>

      {/* Participant Selector Sheet */}
      <ParticipantSelectorSheet
        visible={showParticipantSelector}
        participants={participants}
        selectedIds={selectedParticipantIds}
        onToggle={toggleParticipant}
        onDone={() => setShowParticipantSelector(false)}
      />

      {/* Member Selector Sheet for "Who did you teach" */}
      <ParticipantSelectorSheet
        visible={showMemberSelector}
        participants={participants}
        selectedIds={(currentRecord.members_taught || []).map((m) => m.id)}
        onToggle={toggleMemberTaught}
        onDone={() => setShowMemberSelector(false)}
      />
    </ScrollView>
  );
}

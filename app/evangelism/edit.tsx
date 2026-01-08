import { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColors } from '~/lib/useColorScheme';
import { DatePicker } from '~/components/common/DatePicker';
import { TimePicker } from '~/components/common/TimePicker';
import { PhoneNumberInput } from '~/components/common/PhoneNumberInput';
import { ParticipantSelectorSheet } from '~/components/prayer/ParticipantSelectorSheet';
import { Button } from '~/components/Button';
import { cn } from '~/lib/cn';
import { useGetAllMembers } from '~/hooks/queries/members/useGetAllMembers';
import { DropdownSelect } from '~/components/common/DropdownSelect';
import { useUpdateEvangelismReport, useEvangelismReport } from '~/hooks/data/evangelism';
import Toast from 'react-native-toast-message';
import type { TeamMemberDto, SoulDto } from '~/services/api/evangelism';

interface Record {
  id: string;
  fullName: string;
  gender: string;
  age: string;
  address: string;
  phoneNumber: string;
  status: string[];
  conditionBefore?: string;
  conditionAfter?: string;
  additionalComments: string;
}

export default function EditEvangelismReport() {
  const router = useRouter();
  const colors = useColors();
  const { reportId } = useLocalSearchParams<{ reportId?: string }>();
  const { data: reportData, isLoading: isLoadingReport } = useEvangelismReport(reportId || '');
  const { data: membersData } = useGetAllMembers();
  const updateEvangelismMutation = useUpdateEvangelismReport();

  // Session data
  const [sessionDate, setSessionDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [locationArea, setLocationArea] = useState('');
  const [details, setDetails] = useState('');
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
  const [showParticipantSelector, setShowParticipantSelector] = useState(false);

  // Records
  const [records, setRecords] = useState<Record[]>([]);
  const [currentRecord, setCurrentRecord] = useState<Partial<Record>>({
    fullName: '',
    gender: '',
    age: '',
    address: '',
    phoneNumber: '',
    status: ['Saved'],
    conditionBefore: '',
    conditionAfter: '',
    additionalComments: '',
  });
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [editingRecordIndex, setEditingRecordIndex] = useState<number | null>(null);

  // Load report data when available
  useEffect(() => {
    if (reportData?.data && !isLoadingReport) {
      const report = reportData.data;
      
      // Format date for DatePicker (YYYY-MM-DD)
      const date = new Date(report.session_date);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      setSessionDate(formattedDate);
      setStartTime(report.start_time);
      setLocationArea(report.location_area);
      setDetails(report.details || '');
      
      // Set participants
      const participantIds = report.team_members.map((m) => m.id);
      setSelectedParticipantIds(participantIds);
      
      // Transform souls to records format
      const transformedRecords: Record[] = report.souls.map((soul, index) => {
        // Map impact_types back to status array
        const statusArray = soul.impact_types.map((t) => {
          const capitalized = t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
          return capitalized === 'Saved' || capitalized === 'Filled' || capitalized === 'Healed'
            ? capitalized
            : 'Saved';
        });
        
        // Ensure "Saved" is always included
        if (!statusArray.includes('Saved')) {
          statusArray.unshift('Saved');
        }
        
        return {
          id: `${reportId}-${index}`,
          fullName: soul.name,
          gender: soul.gender,
          age: soul.age.toString(),
          address: soul.address,
          phoneNumber: soul.phone,
          status: statusArray,
          conditionBefore: soul.note || '',
          conditionAfter: soul.status === 'healed' ? soul.note || '' : '',
          additionalComments: soul.note || '',
        };
      });
      
      setRecords(transformedRecords);
    }
  }, [reportData, isLoadingReport, reportId]);

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

  const toggleParticipant = (id: string) => {
    setSelectedParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const genderOptions = ['Male', 'Female'];
  const statusOptions = ['Saved', 'Filled', 'Healed'];

  const toggleStatus = (status: string) => {
    if (status === 'Saved') {
      return;
    }

    const currentStatuses = currentRecord.status || [];
    if (currentStatuses.includes(status)) {
      setCurrentRecord({
        ...currentRecord,
        status: currentStatuses.filter((s) => s !== status),
      });
    } else {
      setCurrentRecord({
        ...currentRecord,
        status: [...currentStatuses, status],
      });
    }
  };

  const handleAddRecord = () => {
    if (
      !currentRecord.fullName ||
      !currentRecord.gender ||
      !currentRecord.age ||
      !currentRecord.address ||
      !currentRecord.phoneNumber
    ) {
      Toast.show({
        text1: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }

    const newRecord: Record = {
      id: editingRecordIndex !== null ? records[editingRecordIndex].id : `${Date.now()}`,
      fullName: currentRecord.fullName || '',
      gender: currentRecord.gender || '',
      age: currentRecord.age || '',
      address: currentRecord.address || '',
      phoneNumber: currentRecord.phoneNumber || '',
      status: currentRecord.status || ['Saved'],
      conditionBefore: currentRecord.conditionBefore || '',
      conditionAfter: currentRecord.conditionAfter || '',
      additionalComments: currentRecord.additionalComments || '',
    };

    if (editingRecordIndex !== null) {
      const updatedRecords = [...records];
      updatedRecords[editingRecordIndex] = newRecord;
      setRecords(updatedRecords);
      setEditingRecordIndex(null);
    } else {
      setRecords([...records, newRecord]);
    }

    setCurrentRecord({
      fullName: '',
      gender: '',
      age: '',
      address: '',
      phoneNumber: '',
      status: ['Saved'],
      conditionBefore: '',
      conditionAfter: '',
      additionalComments: '',
    });
    setShowAddRecord(false);
  };

  const handleEditRecord = (index: number) => {
    const record = records[index];
    setCurrentRecord(record);
    setEditingRecordIndex(index);
    setShowAddRecord(true);
  };

  const handleRemoveRecord = (index: number) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
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

    if (!reportId) {
      Toast.show({
        text1: 'Report ID is missing',
        type: 'error',
      });
      return;
    }

    // Transform participants to TeamMemberDto format
    const teamMembers: TeamMemberDto[] = selectedParticipantIds.map((id) => {
      const participant = participants.find((p: any) => p._id === id);
      if (id === 'self') {
        return {
          id: 'self',
          type: 'worker',
          name: 'Myself',
        };
      }
      return {
        id: participant?._id || id,
        type: 'member',
        name: participant?.full_name || '',
      };
    });

    // Transform records to SoulDto format
    const souls: SoulDto[] = records.map((record) => {
      const primaryStatus = record.status[0] || 'Saved';
      const impactTypes = record.status.map((s) => s.toLowerCase());

      return {
        name: record.fullName,
        gender: record.gender === 'Male' ? 'Male' : 'Female',
        age: parseInt(record.age) || 0,
        phone: record.phoneNumber,
        address: record.address,
        status: primaryStatus.toLowerCase() as 'saved' | 'filled' | 'healed' | 'other',
        impact_types: impactTypes,
        note: record.additionalComments || '',
      };
    });

    // Calculate counts
    const savedCount = records.filter((r) => r.status?.includes('Saved')).length;
    const filledCount = records.filter((r) => r.status?.includes('Filled')).length;
    const healedCount = records.filter((r) => r.status?.includes('Healed')).length;

    const updateData = {
      date: new Date().toISOString(),
      session_date: sessionDate,
      start_time: startTime,
      location_area: locationArea,
      team_members: teamMembers,
      saved_count: savedCount,
      filled_count: filledCount,
      healed_count: healedCount,
      souls: souls,
      details: details || 'Evangelism session',
    };

    updateEvangelismMutation.mutate(
      { id: reportId, data: updateData },
      {
        onSuccess: () => {
          Toast.show({
            text1: 'Evangelism report updated successfully',
            type: 'success',
          });
          router.back();
        },
        onError: (error: any) => {
          Toast.show({
            text1: error?.message || 'Failed to update evangelism report',
            type: 'error',
          });
        },
      }
    );
  };

  if (isLoadingReport) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-black dark:text-white">Edit Report</Text>
          <View className="w-6" />
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400">Loading report...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black dark:text-white">Edit Report</Text>
        <View className="w-6" />
      </View>

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
              <DatePicker
                value={sessionDate}
                onChange={setSessionDate}
                placeholder="Session Date"
              />
            </View>

            {/* Start Time */}
            <View className="mb-4">
              <TimePicker
                value={startTime}
                onChange={setStartTime}
                placeholder="Select start time"
              />
            </View>

            {/* Location Area */}
            <View className="mb-4">
              <TextInput
                className={cn(
                  'h-14 w-full rounded-xl border border-gray-400 bg-transparent px-4 py-3 text-base text-black dark:border-gray-600 dark:text-white'
                )}
                placeholder="Location Area"
                placeholderTextColor="#666"
                value={locationArea}
                onChangeText={setLocationArea}
              />
            </View>

            {/* Details */}
            <View className="mb-4">
              <TextInput
                className={cn(
                  'min-h-24 w-full rounded-xl border border-gray-400 bg-transparent px-4 py-3 text-base text-black dark:border-gray-600 dark:text-white'
                )}
                placeholder="Details (optional)"
                placeholderTextColor="#666"
                value={details}
                onChangeText={setDetails}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Select Participant */}
            <View className="mb-4">
              <TouchableOpacity
                onPress={() => setShowParticipantSelector(true)}
                className={cn(
                  'h-14 w-full flex-row items-center justify-between rounded-xl border border-gray-400 bg-transparent px-4 py-3 dark:border-gray-600'
                )}>
                <Text
                  className={cn(
                    'flex-1 text-base',
                    selectedParticipantNames
                      ? 'text-black dark:text-white'
                      : 'text-gray-400 dark:text-gray-400'
                  )}>
                  {selectedParticipantNames || 'Select participant'}
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
                onPress={() => {
                  setShowAddRecord(!showAddRecord);
                  if (showAddRecord) {
                    setEditingRecordIndex(null);
                    setCurrentRecord({
                      fullName: '',
                      gender: '',
                      age: '',
                      address: '',
                      phoneNumber: '',
                      status: ['Saved'],
                      conditionBefore: '',
                      conditionAfter: '',
                      additionalComments: '',
                    });
                  }
                }}
                className="rounded-lg bg-[#FF007F] px-4 py-2">
                <Text className="text-sm font-semibold text-white">
                  {showAddRecord ? 'Cancel' : '+ Add Record'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Add/Edit Record Form */}
            {showAddRecord && (
              <View className="mb-4 rounded-lg border border-gray-400 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
                <Text className="mb-4 text-base font-semibold text-black dark:text-white">
                  {editingRecordIndex !== null ? 'Edit Record' : 'Add New Record'}
                </Text>

                {/* Full Name */}
                <View className="mb-4">
                  <TextInput
                    className={cn(
                      'h-14 w-full rounded-xl border border-gray-400 bg-transparent px-4 py-3 text-base text-black dark:border-gray-600 dark:text-white'
                    )}
                    placeholder="Full Name"
                    placeholderTextColor="#666"
                    value={currentRecord.fullName}
                    onChangeText={(text) => setCurrentRecord({ ...currentRecord, fullName: text })}
                  />
                </View>

                {/* Gender */}
                <View className="mb-4">
                  <DropdownSelect
                    items={genderOptions}
                    value={currentRecord.gender || ''}
                    onChange={(value) => setCurrentRecord({ ...currentRecord, gender: value })}
                    placeholder="Select Gender"
                  />
                </View>

                {/* Age */}
                <View className="mb-4">
                  <TextInput
                    className={cn(
                      'h-14 w-full rounded-xl border border-gray-400 bg-transparent px-4 py-3 text-base text-black dark:border-gray-600 dark:text-white'
                    )}
                    placeholder="Age"
                    placeholderTextColor="#666"
                    value={currentRecord.age}
                    onChangeText={(text) => setCurrentRecord({ ...currentRecord, age: text })}
                    keyboardType="numeric"
                  />
                </View>

                {/* Address */}
                <View className="mb-4">
                  <TextInput
                    className={cn(
                      'h-14 w-full rounded-xl border border-gray-400 bg-transparent px-4 py-3 text-base text-black dark:border-gray-600 dark:text-white'
                    )}
                    placeholder="Address"
                    placeholderTextColor="#666"
                    value={currentRecord.address}
                    onChangeText={(text) => setCurrentRecord({ ...currentRecord, address: text })}
                  />
                </View>

                {/* Phone Number */}
                <View className="mb-4">
                  <PhoneNumberInput
                    value={currentRecord.phoneNumber || ''}
                    onChange={(phoneNumber) =>
                      setCurrentRecord({ ...currentRecord, phoneNumber })
                    }
                    placeholder="Phone Number"
                  />
                </View>

                {/* Status - Multiple Select */}
                <View className="mb-4">
                  <Text className="mb-2 text-sm text-gray-400">Status</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {statusOptions.map((status) => {
                      const isSelected = (currentRecord.status || []).includes(status);
                      const isSaved = status === 'Saved';
                      const isDisabled = isSaved;
                      return (
                        <TouchableOpacity
                          key={status}
                          onPress={() => toggleStatus(status)}
                          disabled={isDisabled}
                          className={cn(
                            'rounded-full px-4 py-2',
                            isSelected
                              ? status === 'Saved'
                                ? 'bg-pink-500'
                                : status === 'Filled'
                                  ? 'bg-[#FF007F]'
                                  : 'bg-[#FF007F]'
                              : 'border border-gray-400 bg-transparent dark:border-gray-600',
                            isDisabled && 'opacity-75'
                          )}>
                          <Text
                            className={cn(
                              'text-sm font-medium',
                              isSelected ? 'text-white' : 'text-gray-400 dark:text-gray-400'
                            )}>
                            {status}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Condition Before - Only show when Healed is selected */}
                {(currentRecord.status || []).includes('Healed') && (
                  <>
                    <View className="mb-4">
                      <TextInput
                        className={cn(
                          'min-h-24 w-full rounded-xl border border-gray-400 bg-transparent px-4 py-3 text-base text-black dark:border-gray-600 dark:text-white'
                        )}
                        placeholder="Condition Before"
                        placeholderTextColor="#666"
                        value={currentRecord.conditionBefore || ''}
                        onChangeText={(text) =>
                          setCurrentRecord({ ...currentRecord, conditionBefore: text })
                        }
                        multiline
                        textAlignVertical="top"
                      />
                    </View>

                    <View className="mb-4">
                      <TextInput
                        className={cn(
                          'min-h-24 w-full rounded-xl border border-gray-400 bg-transparent px-4 py-3 text-base text-black dark:border-gray-600 dark:text-white'
                        )}
                        placeholder="Condition After"
                        placeholderTextColor="#666"
                        value={currentRecord.conditionAfter || ''}
                        onChangeText={(text) =>
                          setCurrentRecord({ ...currentRecord, conditionAfter: text })
                        }
                        multiline
                        textAlignVertical="top"
                      />
                    </View>
                  </>
                )}

                {/* Additional Comments */}
                <View className="mb-4">
                  <TextInput
                    className={cn(
                      'min-h-24 w-full rounded-xl border border-gray-400 bg-transparent px-4 py-3 text-base text-black dark:border-gray-600 dark:text-white'
                    )}
                    placeholder="Additional Comments"
                    placeholderTextColor="#666"
                    value={currentRecord.additionalComments}
                    onChangeText={(text) =>
                      setCurrentRecord({ ...currentRecord, additionalComments: text })
                    }
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                <Button
                  title={editingRecordIndex !== null ? 'Update Record' : 'Add Record'}
                  onPress={handleAddRecord}
                />
              </View>
            )}

            {/* Records List */}
            {records.length > 0 && (
              <View className="gap-3">
                {records.map((record, index) => (
                  <View
                    key={record.id}
                    className="rounded-lg border border-gray-400 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
                    <View className="mb-2 flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text className="mb-1 text-base font-semibold text-black dark:text-white">
                          {record.fullName}
                        </Text>
                        <Text className="text-sm text-gray-400">
                          {record.gender}, {record.age} years
                        </Text>
                        <Text className="text-sm text-gray-400">{record.address}</Text>
                        <Text className="text-sm text-gray-400">{record.phoneNumber}</Text>
                        <View className="mt-2 flex-row flex-wrap gap-2">
                          {record.status.map((status, statusIndex) => (
                            <View
                              key={statusIndex}
                              className={cn(
                                'rounded-full px-2 py-1',
                                status === 'Saved'
                                  ? 'bg-pink-500'
                                  : status === 'Filled'
                                    ? 'bg-[#FF007F]'
                                    : 'bg-[#FF007F]'
                              )}>
                              <Text className="text-xs font-medium text-white">{status}</Text>
                            </View>
                          ))}
                        </View>
                        {record.additionalComments && (
                          <Text className="mt-2 text-sm text-gray-400">
                            {record.additionalComments}
                          </Text>
                        )}
                      </View>
                      <View className="flex-row gap-2">
                        <TouchableOpacity onPress={() => handleEditRecord(index)}>
                          <Ionicons name="create-outline" size={24} color="#4ECDC4" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleRemoveRecord(index)}>
                          <Ionicons name="close-circle" size={24} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
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
            title="Update Report"
            onPress={handleSubmit}
            disabled={
              !sessionDate ||
              !startTime ||
              !locationArea ||
              selectedParticipantIds.length === 0 ||
              records.length === 0 ||
              updateEvangelismMutation.isPending
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
      </ScrollView>
    </SafeAreaView>
  );
}

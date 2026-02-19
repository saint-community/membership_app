import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColors } from '~/lib/useColorScheme';
import { useFollowUpRecord } from '~/hooks/data/followUp';
import { useMemo } from 'react';

export default function FollowUpDetailView() {
  const router = useRouter();
  const colors = useColors();
  const { recordId } = useLocalSearchParams<{ recordId?: string }>();
  const { data: recordData, isLoading } = useFollowUpRecord(recordId || '');

  const formattedData = useMemo(() => {
    if (!recordData?.data) return null;

    const record = recordData.data;

    // Format session date with null check
    let formattedDate = 'Not specified';
    if (record.session_date) {
      try {
        const sessionDate = new Date(record.session_date);
        if (!isNaN(sessionDate.getTime())) {
          formattedDate = sessionDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }
      } catch (error) {
        console.error('Error formatting date:', error);
      }
    }

    // Parse time to 12-hour format for display with null check
    let formattedTime = 'Not specified';
    if (record.start_time) {
      try {
        const time24 = record.start_time;
        if (time24.includes(':')) {
          const [hours, minutes] = time24.split(':').map(Number);
          if (!isNaN(hours) && !isNaN(minutes)) {
            const period = hours >= 12 ? 'PM' : 'AM';
            const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
            formattedTime = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
          }
        }
      } catch (error) {
        console.error('Error formatting time:', error);
      }
    }

    // Calculate total duration with null check
    const totalDuration = (record.records || []).reduce(
      (sum, r) => sum + (r.duration_minutes || 0),
      0
    );
    const hoursTotal = Math.floor(totalDuration / 60);
    const minutesTotal = totalDuration % 60;
    const formattedDuration =
      hoursTotal > 0 ? `${hoursTotal}h ${minutesTotal}m` : `${minutesTotal}m`;

    return {
      sessionDate: formattedDate,
      startTime: formattedTime,
      location: record.location_area || 'Not specified',
      participants: record.participants || [],
      records: record.records || [],
      totalDuration: formattedDuration,
      createdAt: record.createdAt,
      details: record.details || record.summary || null, // Check for session summary/details
    };
  }, [recordData]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-black dark:text-white">
            Follow-up Details
          </Text>
          <View className="w-6" />
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400">Loading details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!formattedData) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-black dark:text-white">
            Follow-up Details
          </Text>
          <View className="w-6" />
        </View>
        <View className="flex-1 items-center justify-center">
          <Ionicons name="document-outline" size={48} color="#9CA3AF" />
          <Text className="mt-4 text-base text-gray-400">Record not found</Text>
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
        <Text className="text-lg font-semibold text-black dark:text-white">Follow-up Details</Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/follow-up/edit',
              params: { recordId: recordId || '' },
            })
          }>
          <Ionicons name="create-outline" size={24} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          {/* Session Information */}
          <View className="mb-6 rounded-lg bg-white p-4 dark:bg-gray-800">
            <Text className="mb-4 text-lg font-semibold text-black dark:text-white">
              Session Information
            </Text>

            <View className="mb-3">
              <Text className="mb-1 text-sm text-gray-400">Date</Text>
              <Text className="text-base text-black dark:text-white">
                {formattedData.sessionDate}
              </Text>
            </View>

            <View className="mb-3">
              <Text className="mb-1 text-sm text-gray-400">Start Time</Text>
              <Text className="text-base text-black dark:text-white">
                {formattedData.startTime}
              </Text>
            </View>

            <View className="mb-3">
              <Text className="mb-1 text-sm text-gray-400">Location</Text>
              <Text className="text-base text-black dark:text-white">
                {formattedData.location || 'Not specified'}
              </Text>
            </View>

            <View className="mb-3">
              <Text className="mb-1 text-sm text-gray-400">Total Duration</Text>
              <Text className="text-base text-black dark:text-white">
                {formattedData.totalDuration}
              </Text>
            </View>

            {/* Participants */}
            <View className="mb-3">
              <Text className="mb-2 text-sm text-gray-400">Participants</Text>
              {formattedData.participants.length > 0 ? (
                <View className="flex-row flex-wrap gap-2">
                  {formattedData.participants.map((participant, index) => (
                    <View key={index} className="rounded-full bg-[#FF007F]/10 px-3 py-1">
                      <Text className="text-sm text-[#FF007F]">
                        {participant.name || 'Unknown'}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-sm italic text-gray-400">No participants recorded</Text>
              )}
            </View>

            {/* Session Summary/Details */}
            {formattedData.details && (
              <View className="mb-3">
                <Text className="mb-2 text-sm text-gray-400">Session Summary</Text>
                <View className="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
                  <Text className="text-sm text-black dark:text-gray-300">
                    {formattedData.details}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Records Section */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-black dark:text-white">
              Records ({formattedData.records.length})
            </Text>

            {formattedData.records.length > 0 ? (
              <View className="gap-4">
                {formattedData.records.map((record, index) => {
                  const hours = Math.floor((record.duration_minutes || 0) / 60);
                  const minutes = (record.duration_minutes || 0) % 60;
                  const durationDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

                  return (
                    <View key={index} className="rounded-lg bg-white p-4 dark:bg-gray-800">
                      <View className="mb-3">
                        <Text className="mb-2 text-base font-semibold text-black dark:text-white">
                          {record.topic || 'Untitled Record'}
                        </Text>
                        <Text className="mb-1 text-sm text-gray-400">
                          Material: {record.material || 'Not specified'}
                        </Text>
                        <Text className="text-sm text-gray-400">Duration: {durationDisplay}</Text>
                      </View>

                      {/* Members Taught */}
                      <View className="mb-3">
                        <Text className="mb-2 text-sm font-medium text-gray-400">
                          Members Taught
                        </Text>
                        {(record.members_taught || []).length > 0 ? (
                          <View className="flex-row flex-wrap gap-2">
                            {record.members_taught.map((member, memberIndex) => (
                              <View
                                key={memberIndex}
                                className="rounded-full bg-blue-500/10 px-3 py-1">
                                <Text className="text-sm text-blue-600 dark:text-blue-400">
                                  {member.name || 'Unknown'}
                                </Text>
                              </View>
                            ))}
                          </View>
                        ) : (
                          <Text className="text-sm italic text-gray-400">No members recorded</Text>
                        )}
                      </View>

                      {/* Comments */}
                      {record.comments ? (
                        <View className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                          <Text className="mb-2 text-sm font-medium text-gray-400">Comments</Text>
                          <View className="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
                            <Text className="text-sm text-black dark:text-gray-300">
                              {record.comments}
                            </Text>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            ) : (
              <View className="rounded-lg bg-white p-8 dark:bg-gray-800">
                <Text className="text-center text-gray-400">No records found for this session</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

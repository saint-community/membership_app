import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColors } from '~/lib/useColorScheme';
import { DropdownSelect } from '~/components/common/DropdownSelect';
import { useTemplateHistory } from '~/hooks/data/attendance';
import { usePullToRefresh } from '~/hooks/common/usePullToRefresh';
import type { TemplateHistoryItem } from '~/services/api/attendance';
import dayjs from 'dayjs';

interface AttendanceRecord {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'Present' | 'Absent';
}

function formatTime(timeStr: string): string {
  if (!timeStr) return '—';
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (hours === undefined) return timeStr;
  const period = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${minutes !== undefined ? String(minutes).padStart(2, '0') : '00'} ${period}`;
}

export default function AttendanceHistory() {
  const router = useRouter();
  const colors = useColors();
  const [selectedFilter, setSelectedFilter] = useState('All Records');
  const { meeting } = useLocalSearchParams<{
    meeting: string;
  }>();
  const parsedMeeting = meeting ? JSON.parse(meeting as string) : null;
  const templateId = parsedMeeting?.templateId ?? parsedMeeting?.id ?? null;
  const {
    data: attendanceHistoryData,
    isLoading: isLoadingAttendanceHistory,
    refetch: refetchAttendanceHistory,
  } = useTemplateHistory(templateId);

  const filterOptions = ['All Records', 'Present', 'Absent', 'This Month', 'This Year'];

  const overview = attendanceHistoryData?.overview;

  const allAttendanceRecords = useMemo<AttendanceRecord[]>(() => {
    const rawData = attendanceHistoryData?.data ?? [];
    return rawData.map((item: TemplateHistoryItem) => ({
      id: item._id,
      serviceName: item.title,
      date: dayjs(item.date).format('MMM D, YYYY'),
      time: formatTime(item.time),
      status: item.attended ? ('Present' as const) : ('Absent' as const),
    }));
  }, [attendanceHistoryData?.data]);

  const totalMeetings = overview?.total_meetings ?? 0;
  const meetingsAttended = overview?.meetings_attended ?? 0;
  const attendanceRate = overview?.attendance_rate ?? 0;

  const attendanceRecords = useMemo(() => {
    if (selectedFilter === 'All Records') return allAttendanceRecords;
    if (selectedFilter === 'Present') {
      return allAttendanceRecords.filter((record) => record.status === 'Present');
    }
    if (selectedFilter === 'Absent') {
      return allAttendanceRecords.filter((record) => record.status === 'Absent');
    }
    return allAttendanceRecords;
  }, [selectedFilter, allAttendanceRecords]);

  const handleRefresh = useCallback(async () => {
    if (!templateId) return;
    await refetchAttendanceHistory();
  }, [refetchAttendanceHistory, templateId]);

  const { isRefreshing, onRefresh } = usePullToRefresh({
    onRefresh: handleRefresh,
    minimumRefreshDuration: 800,
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black dark:text-white">Attendance History</Text>
        <View className="w-6" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.background}
          />
        }>
        <View className="px-4 pt-4">
          {/* Filter Dropdown */}
          <View className="mb-6">
            <DropdownSelect
              items={filterOptions}
              value={selectedFilter}
              onChange={setSelectedFilter}
              placeholder="Select filter"
            />
          </View>

          {/* Attendance Summary Section */}
          <View className="mb-6 rounded-lg bg-white p-6 dark:bg-gray-800">
            <Text className="mb-4 text-lg font-bold text-black dark:text-white">
              Attendance Summary
            </Text>
            <View className="flex-row justify-between">
              <View className="flex-1 items-center">
                <Text className="text-3xl font-bold text-[#FF6B9D]">
                  {isLoadingAttendanceHistory ? '...' : `${attendanceRate}%`}
                </Text>
                <Text className="mt-1 text-sm text-slate-600 dark:text-gray-300">
                  Attendance Rate
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-3xl font-bold text-[#FF6B9D]">
                  {isLoadingAttendanceHistory ? '...' : meetingsAttended}
                </Text>
                <Text className="mt-1 text-sm text-slate-600 dark:text-gray-300">
                  Meetings Attended
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-3xl font-bold text-[#FF6B9D]">
                  {isLoadingAttendanceHistory ? '...' : totalMeetings}
                </Text>
                <Text className="mt-1 text-sm text-slate-600 dark:text-gray-300">
                  Total Meetings
                </Text>
              </View>
            </View>
          </View>

          {/* Attendance Records List */}
          {!templateId ? (
            <View className="items-center justify-center rounded-lg bg-white py-16 dark:bg-gray-800">
              <Ionicons name="calendar-outline" size={80} color="#9CA3AF" />
              <Text className="mt-6 text-xl font-semibold text-gray-400">Select a template</Text>
              <Text className="mt-2 text-center text-sm text-gray-500">
                Open this screen from a meeting template to view attendance history.
              </Text>
            </View>
          ) : isLoadingAttendanceHistory ? (
            <View className="items-center justify-center rounded-lg bg-white py-16 dark:bg-gray-800">
              <Text className="text-base text-gray-400">Loading attendance history...</Text>
            </View>
          ) : attendanceRecords.length === 0 ? (
            <View className="items-center justify-center rounded-lg bg-white py-16 dark:bg-gray-800">
              <Ionicons name="calendar-outline" size={80} color="#9CA3AF" />
              <Text className="mt-6 text-xl font-semibold text-gray-400">No Attendance Records</Text>
              <Text className="mt-2 text-center text-sm text-gray-500">
                Your attendance history will appear here once you start marking attendance for
                meetings.
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {attendanceRecords.map((record) => (
                <TouchableOpacity
                  key={record.id}
                  onPress={() =>
                    router.push({
                      pathname: '/attendance/summary',
                      params: {
                        serviceName: record.serviceName,
                        date: record.date,
                        time: record.time,
                        status: record.status,
                      },
                    })
                  }
                  className="flex-row items-center justify-between rounded-lg bg-white p-4 dark:bg-gray-800">
                  <View className="flex-1 flex-row items-center">
                    <Text className="mr-3 text-xl text-white">•</Text>
                    <View className="flex-1">
                      <View className="mb-1 flex-row items-center">
                        <Text className="text-base font-semibold text-black dark:text-white">
                          {record.serviceName}
                        </Text>
                        <View className="ml-2">
                          {record.status === 'Present' ? (
                            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                          ) : (
                            <Ionicons name="close-circle" size={20} color="#D32F2F" />
                          )}
                        </View>
                      </View>
                      <View className="flex-row items-center">
                        <Text className="text-sm text-gray-400">{record.date}</Text>
                        <View className="mx-2 flex-row items-center">
                          <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                          <Text className="ml-1 text-sm text-gray-400">{record.time}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    className={`rounded-lg px-3 py-1.5 ${record.status === 'Present' ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                    <Text className="text-xs font-semibold text-white">{record.status}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push('/attendance/main')}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-[#FF007F] shadow-lg"
        style={{
          shadowColor: '#FF007F',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}


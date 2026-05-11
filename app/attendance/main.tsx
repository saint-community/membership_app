import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '~/lib/useColorScheme';
import { useAllMeetings, useAttendanceWorkerStats } from '~/hooks/data/attendance';
import { useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { usePullToRefresh } from '~/hooks/common/usePullToRefresh';

export default function AttendanceMain() {
  const router = useRouter();
  const colors = useColors();
  const { data: meetingsData, isLoading: isLoadingMeetings, refetch: refetchMeetings } = useAllMeetings();
  const {
    data: statsData,
    isLoading: isLoadingStats,
    refetch: refetchWorkerStats,
  } = useAttendanceWorkerStats();
  console.log('meetingsData main', JSON.stringify(meetingsData, null, 2));

  const handleRefresh = useCallback(async () => {
    await Promise.all([refetchMeetings(), refetchWorkerStats()]);
  }, [refetchMeetings, refetchWorkerStats]);

  const { isRefreshing, onRefresh } = usePullToRefresh({
    onRefresh: handleRefresh,
    minimumRefreshDuration: 800,
  });

  const upcomingMeetings = useMemo(() => {
    if (!meetingsData?.data) return [];
    return meetingsData.data.map((meeting) => {
      const meetingDate = dayjs(meeting.date);
      return {
        id: meeting.id,
        title: meeting.title,
        subtitle: `${meeting.type} - ${meeting.scope_type}`,
        time: meetingDate.format('hh:mm A'),
        date: meetingDate.format('MM/DD/YY'),
        meeting,
      };
    });
  }, [meetingsData]);

  const attendanceStats = useMemo(() => {
    if (!statsData?.data) {
      return {
        meetingsAttended: 0,
        firstTimersBrought: 0,
      };
    }

    return {
      meetingsAttended: statsData.data.meetings_attended,
      firstTimersBrought: statsData.data.first_timers_invited,
    };
  }, [statsData]);

  const quickActions = [
    {
      icon: <FontAwesome5 name="book-open" size={24} color="#FF6B6B" />,
      title: 'Manage First Timers',
      subtitle: 'Add first timers to mark attendance',
      onPress: () => console.log('Manage First Timers pressed'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black dark:text-white"></Text>
        <View />
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
          {/* Summary Cards */}
          <View className="mb-6 flex-row gap-3">
            <View className="flex-1 rounded-lg bg-white px-4 py-6 dark:bg-gray-800">
              <View className="gap-3">
                <View>
                  <Ionicons name="people" size={24} color="#FF6B9D" />
                </View>
                <Text className="text-2xl font-bold">
                  {isLoadingStats ? '...' : attendanceStats.meetingsAttended}
                </Text>
                <Text className="text-md text-slate-600 dark:text-gray-300">Meetings Attended</Text>
              </View>
            </View>
            <View className="flex-1 rounded-lg bg-white px-4 py-6 dark:bg-gray-800">
              <View className="gap-3">
                <View>
                  <Ionicons name="people" size={24} color="#FFD93D" />
                </View>
                <Text className="text-2xl font-bold">
                  {isLoadingStats ? '...' : attendanceStats.firstTimersBrought}
                </Text>
                <Text className="text-md text-slate-600 dark:text-gray-300">
                  First Timers Brought
                </Text>
              </View>
            </View>
          </View>

          {/* Upcoming Meetings Section */}
          <View className="mb-6">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold">Upcoming Meetings</Text>
              <TouchableOpacity onPress={() => router.push('/attendance/meetings')}>
                <Text className="text-[#FF6B9D] underline">Past meetings</Text>
              </TouchableOpacity>
            </View>

            {isLoadingMeetings ? (
              <View className="rounded-lg bg-white p-4 dark:bg-gray-800">
                <Text className="text-center text-gray-400">Loading meetings...</Text>
              </View>
            ) : upcomingMeetings.length === 0 ? (
              <View className="rounded-lg bg-white p-4 dark:bg-gray-800">
                <Text className="text-center text-gray-400">No upcoming meetings</Text>
              </View>
            ) : (
              <View className="gap-3">
                {upcomingMeetings.map((meeting) => (
                  <View key={meeting.id} className="rounded-lg bg-white p-4 dark:bg-gray-800">
                    <View className="mb-4 flex-row items-start">
                      <View className="mr-4">
                        <FontAwesome5 name="church" size={24} color="#FFD93D" />
                      </View>
                      <View className="flex-1">
                        <Text className="mb-1 text-base font-semibold">{meeting.title}</Text>
                        <Text className="text-sm text-gray-400">{meeting.subtitle}</Text>
                      </View>
                      <View className="items-end">
                        <View className="mb-1 flex-row items-center">
                          <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                          <Text className="ml-1 text-sm text-gray-400">{meeting.time}</Text>
                        </View>
                        <Text className="text-sm text-gray-400">{meeting.date}</Text>
                      </View>
                    </View>
                    <View className="flex-row gap-3">
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: '/attendance/mark-attendance',
                            params: { title: meeting.title, subtitle: meeting.subtitle },
                          })
                        }
                        className="flex-1 rounded-lg bg-[#FF007F] px-4 py-3">
                        <Text className="text-center text-sm font-semibold text-white">
                          Mark Attendance
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => router.push({
                          pathname: '/attendance/history',
                          params: {
                            meeting: JSON.stringify({
                              id: meeting.meeting.id,
                              title: meeting.meeting.title,
                              subtitle: `${meeting.meeting.type} - ${meeting.meeting.scope_type}`,
                              type: meeting.meeting.type,
                              time: dayjs(meeting.date).format('hh:mm A'),
                              date: dayjs(meeting.meeting.date).format('MM/DD/YY'),
                              dateObj: dayjs(meeting.meeting.date).toDate(),
                              location: meeting.meeting.scope_type,
                              templateId: meeting.meeting.template_id,
                            })
                          },
                        })}
                        className="flex-1 rounded-lg border border-gray-600 px-4 py-3">
                        <Text className="text-center text-sm font-semibold dark:text-white">
                          Details
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Quick Actions Section */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold">Quick actions</Text>
            <View className="gap-3">
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={action.onPress}
                  className="flex-row items-center justify-between rounded-lg bg-white p-4 dark:bg-gray-800">
                  <View className="flex-1 flex-row items-center">
                    <View className="mr-4">{action.icon}</View>
                    <View className="flex-1">
                      <Text className="mb-1 text-base font-semibold">{action.title}</Text>
                      <Text className="text-sm text-gray-400">{action.subtitle}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

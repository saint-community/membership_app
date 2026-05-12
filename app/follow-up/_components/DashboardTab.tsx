import { RefreshControl, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFollowUpWorkerStats, useFollowUpWorkerHistory } from '~/hooks/data/followUp';
import { useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { usePullToRefresh } from '~/hooks/common/usePullToRefresh';
import { useColors } from '~/lib/useColorScheme';

interface DashboardTabProps {
  onNavigateToHistory?: () => void;
}

export default function DashboardTab({ onNavigateToHistory }: DashboardTabProps) {
  const router = useRouter();
  const colors = useColors();
  const { data: statsData, isLoading: isLoadingStats, refetch: refetchStats } = useFollowUpWorkerStats();
  const { data: historyData, refetch: refetchHistory } = useFollowUpWorkerHistory();

  // console.log('historyData', JSON.stringify(statsData, null, 2));

  const metrics = useMemo(() => {
    const stats = statsData?.data;

    return [
      {
        icon: <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />,
        value: isLoadingStats ? '...' : (stats?.total_sessions || 0).toString(),
        label: 'Total Follow-ups',
      },
      {
        icon: <Ionicons name="time-outline" size={24} color="#4ECDC4" />,
        value: isLoadingStats ? '...' : `${stats?.total_duration || 0}mins`,
        label: 'Total Hours',
      },
      {
        icon: <Ionicons name="people-outline" size={24} color="#4ECDC4" />,
        value: isLoadingStats ? '...' : (stats?.this_week_count || 0).toString(),
        label: 'New People',
      },
      {
        icon: <MaterialIcons name="hourglass-empty" size={24} color="#4ECDC4" />,
        value: isLoadingStats ? '...' : `${stats?.average_duration || 0}mins`,
        label: 'Average Duration',
      },
    ];
  }, [statsData, isLoadingStats]);

  const recentActivities = useMemo(() => {
    const history = historyData?.data || [];
    if (history.length === 0) return [];

    // Get the most recent records with record ID
    const recentRecords = history
      .flatMap((record) =>
        record.records?.map((r) => ({
          recordId: record._id,
          name: r.members_taught?.map((m) => m.name).join(', '),
          subject: r?.subject,
          duration: `${r.duration_minutes} minutes`,
          badge: 'Today' as const,
          date: dayjs(record?.date).format('DD/MM/YYYY'),
        }))
      )
      .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
      .slice(0, 3);

    return recentRecords;
  }, [historyData]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([refetchStats(), refetchHistory()]);
  }, [refetchStats, refetchHistory]);

  const { isRefreshing, onRefresh } = usePullToRefresh({
    onRefresh: handleRefresh,
    minimumRefreshDuration: 800,
  });

  return (
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
        {/* Metric Cards Grid */}
        <View className="mb-6 gap-3">
          <View className="flex-row gap-3">
            <View className="flex-1 rounded-lg bg-white p-4 dark:bg-gray-800">
              <View className="mb-3">{metrics[0].icon}</View>
              <Text className="mb-1 text-2xl font-bold text-black dark:text-white">
                {metrics[0].value}
              </Text>
              <Text className="text-sm text-slate-600 dark:text-gray-300">{metrics[0].label}</Text>
            </View>
            <View className="flex-1 rounded-lg bg-white p-4 dark:bg-gray-800">
              <View className="mb-3">{metrics[1].icon}</View>
              <Text className="mb-1 text-2xl font-bold text-black dark:text-white">
                {metrics[1].value}
              </Text>
              <Text className="text-sm text-slate-600 dark:text-gray-300">{metrics[1].label}</Text>
            </View>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1 rounded-lg bg-white p-4 dark:bg-gray-800">
              <View className="mb-3">{metrics[2].icon}</View>
              <Text className="mb-1 text-2xl font-bold text-black dark:text-white">
                {metrics[2].value}
              </Text>
              <Text className="text-sm text-slate-600 dark:text-gray-300">{metrics[2].label}</Text>
            </View>
            <View className="flex-1 rounded-lg bg-white p-4 dark:bg-gray-800">
              <View className="mb-3">{metrics[3].icon}</View>
              <Text className="mb-1 text-2xl font-bold text-black dark:text-white">
                {metrics[3].value}
              </Text>
              <Text className="text-sm text-slate-600 dark:text-gray-300">{metrics[3].label}</Text>
            </View>
          </View>
        </View>

        {/* Weekly Goal Progress */}
        {/* <View className="mb-6 rounded-lg bg-white p-6 dark:bg-gray-800">
          <View className="mb-4 flex-row items-center">
            <Ionicons name="flag-outline" size={24} color="#4ECDC4" />
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-black dark:text-white">
                Weekly Goal Progress
              </Text>
              <Text className="mt-1 text-sm text-gray-400">
                6 of 11 members followed-up this week
              </Text>
            </View>
          </View>
          <View className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <View className="h-full w-[68%] bg-[#FF007F]" />
          </View>
          <View className="flex-row justify-end">
            <Text className="text-sm font-semibold text-green-500">68%</Text>
          </View>
        </View> */}

        {/* Recent Activities */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-black dark:text-white">
              Recent Activities
            </Text>
            <TouchableOpacity
              onPress={() => {
                // Navigate to History tab
                onNavigateToHistory?.();
              }}>
              <Text className="text-sm text-[#FF007F]">See All</Text>
            </TouchableOpacity>
          </View>
          <View className="gap-3">
            {recentActivities.map((activity, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  router.push({
                    pathname: '/follow-up/detail-view',
                    params: { recordId: activity.recordId },
                  })
                }
                className="rounded-lg bg-white p-4 dark:bg-gray-800">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="mb-1 text-base font-semibold text-black dark:text-white">
                      {activity.name}
                    </Text>
                    <Text className="mb-1 text-sm text-gray-400">{activity.subject}</Text>
                    <Text className="text-xs text-gray-500">{activity.duration}</Text>
                  </View>
                  <View className="rounded bg-blue-500 px-2 py-1">
                    <Text className="text-xs font-semibold text-white">{activity.badge}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

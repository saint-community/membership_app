import { RefreshControl, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColors } from '~/lib/useColorScheme';
import { useEvangelismWorkerHistory, useEvangelismWorkerStats } from '~/hooks/data/evangelism';
import { useCallback, useMemo } from 'react';
import { formatTimeDisplay } from '~/utils';
import dayjs from 'dayjs';
import { usePullToRefresh } from '~/hooks/common/usePullToRefresh';

interface ReportSession {
  id: string;
  name: string;
  date: string;
  time: string;
  iconColor: string;
  location: string;
  reportId: string;
}

const iconColors = [
  '#3B82F6', // Blue
  '#A855F7', // Purple
  '#F97316', // Orange
  '#22C55E', // Green
  '#EF4444', // Red
  '#EC4899', // Magenta
  '#10B981', // Emerald
  '#F59E0B', // Amber
];

export default function SessionsList() {
  const router = useRouter();
  const colors = useColors();
  const { timeframe } = useLocalSearchParams<{
    timeframe?: string;
    startDate?: string;
    endDate?: string;
  }>();
  const { data: historyData, isLoading, refetch: refetchHistory } = useEvangelismWorkerHistory();
  const {
    data: statsData,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useEvangelismWorkerStats();

  console.log('statsData', JSON.stringify(statsData, null, 2));
  console.log('historyData', JSON.stringify(historyData, null, 2));

  // Use worker stats instead of admin stats
  const summaryStats = useMemo(() => {
    if (!statsData?.data) {
      return [
        { label: 'Saved', value: '0' },
        { label: 'Filled', value: '0' },
        { label: 'Healed', value: '0' },
      ];
    }

    return [
      { label: 'Saved', value: statsData.data.total_saved.toString() },
      { label: 'Filled', value: statsData.data.total_filled.toString() },
      { label: 'Healed', value: statsData.data.total_healed.toString() },
    ];
  }, [statsData]);

  // Transform API data to sessions format
  const sessions = useMemo<ReportSession[]>(() => {
    if (!historyData?.data) return [];

    return historyData.data.map((report, index) => {
      const reportDate = dayjs(report.date);

      // Get first team member name or use location as identifier
      const teamMemberName =
        report.participants && report.participants.length > 0
          ? report.participants[0].name
          : 'Evangelism Session';

      return {
        id: report._id,
        name: teamMemberName,
        date: reportDate.format('MM/DD/YYYY'),
        time: report.start_time || '',
        iconColor: iconColors[index % iconColors.length],
        location: report.location_area,
        reportId: report._id,
      };
    });
  }, [historyData]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([refetchHistory(), refetchStats()]);
  }, [refetchHistory, refetchStats]);

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
        <Text className="text-lg font-semibold text-black dark:text-white">View Report</Text>
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
          {/* Filter Button */}
          <TouchableOpacity
            onPress={() => router.push('/evangelism/report-filter')}
            className="mb-4 self-start rounded-lg border border-[#FF007F] px-4 py-2">
            <Text className="text-sm font-medium text-foreground">{timeframe}</Text>
          </TouchableOpacity>

          {/* Summary Cards */}
          <View className="mb-6 flex-row gap-3">
            {summaryStats.map((stat, index) => (
              <View key={index} className="flex-1 rounded-lg bg-white px-4 py-4 dark:bg-gray-800">
                <Text className="mb-2 text-sm text-gray-400">{stat.label}</Text>
                <Text className="text-2xl font-bold text-black dark:text-white">
                  {isLoading || isLoadingStats ? '...' : stat.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Report Sessions List */}
          {isLoading ? (
            <View className="items-center justify-center rounded-lg bg-white py-12 dark:bg-gray-800">
              <Text className="text-gray-400">Loading reports...</Text>
            </View>
          ) : sessions.length === 0 ? (
            <View className="items-center justify-center rounded-lg bg-white py-12 dark:bg-gray-800">
              <Ionicons name="document-outline" size={48} color="#9CA3AF" />
              <Text className="mt-4 text-base text-gray-400">No reports found</Text>
              <Text className="mt-1 text-sm text-gray-500">
                Submit your first evangelism report
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {sessions.map((session, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    router.push({
                      pathname: '/evangelism/session-details',
                      params: { reportId: session.id },
                    })
                  }
                  className="flex-row items-center justify-between rounded-lg bg-white p-4 dark:bg-gray-800">
                  <View className="flex-1 flex-row items-center">
                    <View
                      className="mr-4 h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: session.iconColor }}>
                      <Ionicons name="person" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <View className="mb-1 flex-row items-center">
                        <Text className="mr-2 text-base font-semibold text-black dark:text-white">
                          {session.name}
                        </Text>
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            router.push({
                              pathname: '/evangelism/edit',
                              params: { reportId: session.reportId },
                            });
                          }}>
                          <Text className="text-sm text-[#FF007F]">Edit</Text>
                        </TouchableOpacity>
                      </View>
                      <Text className="text-xs text-gray-400">
                        {session.location} • {session.date}{session.time ? `, ${formatTimeDisplay(session.time)}` : ''}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { RefreshControl, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColors } from '~/lib/useColorScheme';
import { useTemplateHistory } from '~/hooks/data/attendance';
import type { TemplateHistoryItem } from '~/services/api/attendance';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { usePullToRefresh } from '~/hooks/common/usePullToRefresh';

function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (hours === undefined) return timeStr;
  const period = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${minutes !== undefined ? String(minutes).padStart(2, '0') : '00'} ${period}`;
}

export default function TemplateHistory() {
  const router = useRouter();
  const colors = useColors();
  const { templateId, templateTitle } = useLocalSearchParams<{
    templateId?: string;
    templateTitle?: string;
  }>();

  const {
    data: historyData,
    isLoading,
    refetch: refetchHistory,
  } = useTemplateHistory(templateId ?? null);
  const meetings = historyData?.data ?? [];

  const sortedMeetings = [...meetings].sort(
    (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  );

  const handleRefresh = useCallback(async () => {
    if (!templateId) return;
    await refetchHistory();
  }, [refetchHistory, templateId]);

  const { isRefreshing, onRefresh } = usePullToRefresh({
    onRefresh: handleRefresh,
    minimumRefreshDuration: 800,
  });

  const renderMeetingCard = ({ item }: { item: TemplateHistoryItem }) => {
    const meetingDate = dayjs(item.date);
    const timeDisplay = item.time ? formatTime(item.time) : meetingDate.format('hh:mm A');
    return (
      <View className="mb-3 rounded-lg bg-white p-4 dark:bg-gray-800">
        <View className="flex-row items-start">
          <View className="mr-4">
            <FontAwesome5 name="church" size={24} color="#FFD93D" />
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-base font-semibold">{item.title}</Text>
            <Text className="mb-1 text-sm text-gray-400">
              {item.type} - {item.scope_type}
            </Text>
            <View className="mt-1 flex-row items-center">
              <Ionicons name="time-outline" size={14} color="#9CA3AF" />
              <Text className="ml-1 text-xs text-gray-400">
                {meetingDate.format('MM/DD/YY')} • {timeDisplay}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/attendance/mark-attendance',
              params: {
                title: item.title,
                subtitle: `${item.type} - ${item.scope_type}`,
              },
            })
          }
          className="mt-3 rounded-lg bg-[#FF007F] px-4 py-3">
          <Text className="text-center text-sm font-semibold text-white">Mark Attendance</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black dark:text-white" numberOfLines={1}>
          {templateTitle ?? 'Meeting History'}
        </Text>
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
          {isLoading ? (
            <View className="items-center justify-center rounded-lg bg-white py-12 dark:bg-gray-800">
              <Text className="text-base text-gray-400">Loading meeting history...</Text>
            </View>
          ) : sortedMeetings.length > 0 ? (
            <FlatList
              data={sortedMeetings}
              renderItem={renderMeetingCard}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View className="items-center justify-center rounded-lg bg-white py-12 dark:bg-gray-800">
              <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
              <Text className="mt-4 text-base text-gray-400">No meetings for this template yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

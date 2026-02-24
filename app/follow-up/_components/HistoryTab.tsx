import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { cn } from '~/lib/cn';
import { useFollowUpWorkerHistory } from '~/hooks/data/followUp';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';



export default function HistoryTab() {
  const router = useRouter();
  const { data: historyData, isLoading } = useFollowUpWorkerHistory();

  console.log('historyData', JSON.stringify(historyData, null, 2));

  const reports = useMemo(() => {
    if (!historyData?.data) return [];

    return historyData.data.flatMap((record) => {
      const sessionDate = new Date(record.date);
      const formattedDate = sessionDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const totalDuration = record.records.reduce((sum, r) => sum + r.duration_minutes, 0);

      return record.records.map((r, index) => {
        const memberNames = r.members_taught.map((m) => m.name).join(', ');
        return {
          id: record._id,
          name: memberNames,
          reportTitle: r.topic,
          session_summary: record.session_summary,
          duration: `${r.duration_minutes} minutes`,
          date: formattedDate,
          totalDuration: `${totalDuration} minutes`,
          badge: 'Member' as const,
          additionalComments: r.comments,
        };
      });
    });
  }, [historyData]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400">Loading history...</Text>
      </View>
    );
  }

  if (reports.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-400">No follow-up records found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-4">
        {/* Report Cards */}
        <View className="gap-4">
          {reports.map((report) => (
            <TouchableOpacity
              key={report.id}
              onPress={() =>
                router.push({
                  pathname: '/follow-up/detail-view',
                  params: { recordId: report.id },
                })
              }
              className="rounded-lg bg-white p-4 dark:bg-gray-800">
              <View className="mb-2 flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="mb-1 text-base font-semibold text-black dark:text-white">
                    {report.name}
                  </Text>
                  <Text className="mb-1 text-sm font-medium text-black dark:text-white">
                    {report.reportTitle}
                  </Text>
                  {report.session_summary && (
                    <Text className="mb-1 text-xs text-gray-400">{report.session_summary}</Text>
                  )}
                  <Text className="text-xs text-gray-500">{report.duration}</Text>
                </View>
                {report.badge && (
                  <View
                    className={cn('rounded px-2 py-1', {
                      // 'bg-green-500': report.badge === 'New Person',
                      'bg-blue-600': report.badge === 'Member',
                    })}>
                    <Text className="text-xs font-semibold text-white">{report.badge}</Text>
                  </View>
                )}
              </View>

              {report.additionalComments && (
                <View className="mb-3 mt-3">
                  <Text className="mb-2 text-sm font-semibold text-black dark:text-white">
                    Additional Comments:
                  </Text>
                  <View className="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
                    <Text className="text-sm text-black dark:text-gray-300">
                      {report.additionalComments}
                    </Text>
                  </View>
                </View>
              )}

              <View className="mt-2 flex-row items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
                <Text className="text-xs text-gray-500">
                  {report.date}
                </Text>
                <TouchableOpacity>
                  <Text className="text-xs text-[#FF007F]">View Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

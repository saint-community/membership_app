import { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColors } from '~/lib/useColorScheme';
import { cn } from '~/lib/cn';
import { useEvangelismReport } from '~/hooks/data/evangelism';

interface ReportEntry {
  id: string;
  name: string;
  age: number;
  phone: string;
  address: string;
  statuses: ('Saved' | 'Filled' | 'Healed')[];
}

export default function SessionDetails() {
  const router = useRouter();
  const colors = useColors();
  const { reportId } = useLocalSearchParams<{ reportId?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: reportData, isLoading } = useEvangelismReport(reportId || '');

  console.log(JSON.stringify(reportData, null, 2));

  // Transform API souls data to ReportEntry format
  const reports = useMemo<ReportEntry[]>(() => {
    if (!reportData?.data?.souls) return [];

    return reportData.data.souls.map((soul, index) => {
      return {
        id: `${reportId}-${index}`,
        name: soul.name,
        age: soul.age,
        phone: soul.phone,
        address: soul.address,
        statuses: soul.impact_types,
      };
    });
  }, [reportData, reportId]);

  // Filter reports by search query
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports;
    const query = searchQuery.toLowerCase();
    return reports.filter((report) => report.name.toLowerCase().includes(query));
  }, [reports, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'saved':
        return 'bg-pink-500';
      case 'filled':
        return 'bg-[#FF007F]';
      case 'healed':
        return 'bg-[#FF007F]';
      default:
        return 'bg-gray-500';
    }
  };

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
        showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          {/* Search Bar */}
          <View className="mb-4">
            <View className="flex-row items-center rounded-lg border border-gray-400 bg-transparent px-4 py-3 dark:border-gray-600">
              <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by name"
                placeholderTextColor="#9CA3AF"
                className="flex-1"
                style={{ color: colors.foreground }}
              />
            </View>
          </View>

          {/* Filter Buttons */}
          <View className="mb-6 flex-row gap-3">
            <TouchableOpacity className="flex-1 rounded-lg border border-gray-400 bg-transparent px-4 py-3 dark:border-gray-600">
              <Text className="text-center text-sm font-medium text-white">All Status</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 rounded-lg border border-gray-400 bg-transparent px-4 py-3 dark:border-gray-600">
              <Text className="text-center text-sm font-medium text-white">All Dates</Text>
            </TouchableOpacity>
          </View>

          {/* Report Entries List */}
          {isLoading ? (
            <View className="items-center justify-center rounded-lg bg-white py-12 dark:bg-gray-800">
              <Text className="text-gray-400">Loading session details...</Text>
            </View>
          ) : filteredReports.length === 0 ? (
            <View className="items-center justify-center rounded-lg bg-white py-12 dark:bg-gray-800">
              <Ionicons name="people-outline" size={48} color="#9CA3AF" />
              <Text className="mt-4 text-base text-gray-400">
                {searchQuery
                  ? 'No souls found matching your search'
                  : 'No souls recorded in this session'}
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {filteredReports.map((report) => {
                // Find the original index in the reports array (before filtering)
                const originalIndex = reports.findIndex((r) => r.id === report.id);
                return (
                  <TouchableOpacity
                    key={report.id}
                    onPress={() =>
                      router.push({
                        pathname: '/evangelism/detail-view',
                        params: {
                          reportId: reportId || '',
                          soulIndex: originalIndex.toString(),
                        },
                      })
                    }
                    className="rounded-lg bg-white p-4 dark:bg-gray-800">
                    <View className="mb-3">
                      <Text className="mb-2 text-base font-semibold text-black dark:text-white">
                        {report.name}
                      </Text>
                      <Text className="mb-1 text-sm text-black dark:text-white">
                        Age: {report.age} {report.phone}
                      </Text>
                      <Text className="text-sm text-black dark:text-white">{report.address}</Text>
                    </View>

                    {/* Status Tags */}
                    <View className="mb-2 flex-row flex-wrap gap-2">
                      {report.statuses.map((status, index) => (
                        <View
                          key={index}
                          className={cn(
                            'min-w-fit rounded-full px-2 py-1',
                            getStatusColor(status)
                          )}>
                          <Text className="text-xs font-medium capitalize text-white">
                            {status}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <View className="items-end">
                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

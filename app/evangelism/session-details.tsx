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
      // Map impact_types to the correct type
      const statuses: ('Saved' | 'Filled' | 'Healed')[] = soul.impact_types
        .map((t) => {
          const capitalized = t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
          if (capitalized === 'Saved' || capitalized === 'Filled' || capitalized === 'Healed') {
            return capitalized as 'Saved' | 'Filled' | 'Healed';
          }
          return 'Saved' as const;
        })
        .filter((s, i, arr) => arr.indexOf(s) === i); // Remove duplicates

      return {
        id: `${reportId}-${index}`,
        name: soul.name,
        age: soul.age,
        phone: soul.phone,
        address: soul.address,
        statuses: statuses.length > 0 ? statuses : (['Saved'] as const),
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
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/evangelism/edit',
              params: { reportId: reportId || '' },
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
          {reportData?.data && (
            <View className="mb-6 rounded-lg bg-white p-4 dark:bg-gray-800">
              <Text className="mb-4 text-lg font-semibold text-black dark:text-white">
                Session Information
              </Text>

              {/* Session Date */}
              <View className="mb-3">
                <Text className="mb-1 text-sm text-gray-400">Date</Text>
                <Text className="text-base text-black dark:text-white">
                  {new Date(reportData.data.session_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>

              {/* Start Time */}
              <View className="mb-3">
                <Text className="mb-1 text-sm text-gray-400">Start Time</Text>
                <Text className="text-base text-black dark:text-white">
                  {(() => {
                    const time24 = reportData.data.start_time;
                    const [hours, minutes] = time24.split(':').map(Number);
                    const period = hours >= 12 ? 'PM' : 'AM';
                    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
                    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
                  })()}
                </Text>
              </View>

              {/* Location */}
              <View className="mb-3">
                <Text className="mb-1 text-sm text-gray-400">Location</Text>
                <Text className="text-base text-black dark:text-white">
                  {reportData.data.location_area}
                </Text>
              </View>

              {/* Team Members/Participants */}
              {reportData.data.team_members && reportData.data.team_members.length > 0 && (
                <View className="mb-3">
                  <Text className="mb-2 text-sm text-gray-400">Participants</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {reportData.data.team_members.map((member, index) => (
                      <View key={index} className="rounded-full bg-[#FF007F]/10 px-3 py-1">
                        <Text className="text-sm text-[#FF007F]">{member.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Session Details/Notes */}
              {reportData.data.details && (
                <View className="mb-3">
                  <Text className="mb-2 text-sm text-gray-400">Session Details</Text>
                  <View className="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
                    <Text className="text-sm text-black dark:text-gray-300">
                      {reportData.data.details}
                    </Text>
                  </View>
                </View>
              )}

              {/* Summary Stats */}
              <View className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                <View className="flex-row flex-wrap gap-4">
                  <View>
                    <Text className="text-xs text-gray-400">Saved</Text>
                    <Text className="text-base font-semibold text-black dark:text-white">
                      {reportData.data.saved_count || 0}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs text-gray-400">Filled</Text>
                    <Text className="text-base font-semibold text-black dark:text-white">
                      {reportData.data.filled_count || 0}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs text-gray-400">Healed</Text>
                    <Text className="text-base font-semibold text-black dark:text-white">
                      {reportData.data.healed_count || 0}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs text-gray-400">Total Souls</Text>
                    <Text className="text-base font-semibold text-black dark:text-white">
                      {reportData.data.souls?.length || 0}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

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

import { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColors } from '~/lib/useColorScheme';
import { cn } from '~/lib/cn';
import { useEvangelismReport } from '~/hooks/data/evangelism';

type StatusType = 'Saved' | 'Filled' | 'Healed';

export default function DetailView() {
  const router = useRouter();
  const colors = useColors();
  const { reportId, soulIndex } = useLocalSearchParams<{ reportId?: string; soulIndex?: string }>();
  const { data: reportData, isLoading } = useEvangelismReport(reportId || '');
  const [statuses, setStatuses] = useState<StatusType[]>([]);

  // Get the specific soul data
  const soulData = useMemo(() => {
    if (!reportData?.data?.souls || !soulIndex) return null;
    const index = parseInt(soulIndex);
    if (isNaN(index) || index < 0 || index >= reportData.data.souls.length) return null;
    return reportData.data.souls[index];
  }, [reportData, soulIndex]);

  // Initialize statuses from soul data
  useMemo(() => {
    if (soulData) {
      const soulStatuses: StatusType[] = [];
      if (soulData.status === 'saved' || soulData.impact_types?.includes('saved')) {
        soulStatuses.push('Saved');
      }
      if (soulData.status === 'filled' || soulData.impact_types?.includes('filled')) {
        soulStatuses.push('Filled');
      }
      if (soulData.status === 'healed' || soulData.impact_types?.includes('healed')) {
        soulStatuses.push('Healed');
      }
      if (soulStatuses.length === 0) {
        soulStatuses.push('Saved');
      }
      setStatuses(soulStatuses);
    }
  }, [soulData]);

  const reportDataFormatted = useMemo(() => {
    if (!soulData) {
      return {
        name: '',
        gender: '',
        age: '',
        address: '',
        phoneNumber: '',
        complaint: '',
        resolution: '',
        additionalComments: '',
      };
    }

    return {
      name: soulData.name,
      gender: soulData.gender,
      age: soulData.age.toString(),
      address: soulData.address,
      phoneNumber: soulData.phone,
      complaint: soulData.note || 'No complaint recorded',
      resolution: soulData.status === 'healed' ? 'Healed' : 'No resolution recorded',
      additionalComments: soulData.note || 'No additional comments',
    };
  }, [soulData]);

  const removeStatus = (statusToRemove: StatusType) => {
    setStatuses(statuses.filter((s) => s !== statusToRemove));
  };

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'Saved':
        return 'bg-pink-500';
      case 'Filled':
        return 'bg-[#FF007F]';
      case 'Healed':
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
        <View className="px-4 pt-6">
          {isLoading ? (
            <View className="items-center justify-center py-12">
              <Text className="text-gray-400">Loading soul details...</Text>
            </View>
          ) : !soulData ? (
            <View className="items-center justify-center py-12">
              <Ionicons name="person-outline" size={48} color="#9CA3AF" />
              <Text className="mt-4 text-base text-gray-400">Soul data not found</Text>
            </View>
          ) : (
            <>
              {/* Personal Information Fields */}
              <View className="mb-4 gap-4">
                <View className="rounded-lg border border-gray-400 bg-transparent px-4 py-3 dark:border-gray-600">
                  <Text className="text-sm text-gray-400">Name</Text>
                  <Text className="mt-1 text-base text-black dark:text-white">
                    {reportDataFormatted.name}
                  </Text>
                </View>

                <View className="rounded-lg border border-gray-400 bg-transparent px-4 py-3 dark:border-gray-600">
                  <Text className="text-sm text-gray-400">Gender</Text>
                  <Text className="mt-1 text-base text-black dark:text-white">
                    {reportDataFormatted.gender}
                  </Text>
                </View>

                <View className="rounded-lg border border-gray-400 bg-transparent px-4 py-3 dark:border-gray-600">
                  <Text className="text-sm text-gray-400">Age</Text>
                  <Text className="mt-1 text-base text-black dark:text-white">
                    {reportDataFormatted.age}
                  </Text>
                </View>

                <View className="rounded-lg border border-gray-400 bg-transparent px-4 py-3 dark:border-gray-600">
                  <Text className="text-sm text-gray-400">Address</Text>
                  <Text className="mt-1 text-base text-black dark:text-white">
                    {reportDataFormatted.address}
                  </Text>
                </View>

                <View className="rounded-lg border border-gray-400 bg-transparent px-4 py-3 dark:border-gray-600">
                  <Text className="text-sm text-gray-400">Phone Number</Text>
                  <Text className="mt-1 text-base text-black dark:text-white">
                    {reportDataFormatted.phoneNumber}
                  </Text>
                </View>
              </View>

              {/* Status Tags */}
              <View className="mb-4 rounded-lg border border-gray-400 bg-transparent px-4 py-3 dark:border-gray-600">
                <View className="flex-row flex-wrap gap-2">
                  {statuses.map((status, index) => (
                    <View
                      key={index}
                      className={cn(
                        'flex-row items-center gap-2 rounded-full px-3 py-1',
                        getStatusColor(status)
                      )}>
                      <Text className="text-xs font-medium text-white">{status}</Text>
                      <TouchableOpacity onPress={() => removeStatus(status)}>
                        <Ionicons name="close" size={14} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>

              {/* Report Content Fields */}
              <View className="gap-4">
                {soulData.status === 'healed' && (
                  <>
                    <View className="rounded-lg border border-gray-400 bg-transparent px-4 py-3 dark:border-gray-600">
                      <Text className="text-sm text-gray-400">Condition Before</Text>
                      <Text className="mt-1 text-base text-black dark:text-white">
                        {reportDataFormatted.complaint}
                      </Text>
                    </View>

                    <View className="rounded-lg border border-gray-400 bg-transparent px-4 py-3 dark:border-gray-600">
                      <Text className="text-sm text-gray-400">Condition After</Text>
                      <Text className="mt-1 text-base text-black dark:text-white">
                        {reportDataFormatted.resolution}
                      </Text>
                    </View>
                  </>
                )}

                <View className="rounded-lg border border-gray-400 bg-transparent px-4 py-3 dark:border-gray-600">
                  <Text className="text-sm text-gray-400">Additional Comments</Text>
                  <Text className="mt-1 text-base text-black dark:text-white">
                    {reportDataFormatted.additionalComments}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

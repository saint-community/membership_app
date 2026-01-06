import { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '~/lib/useColorScheme';
import { DatePicker } from '~/components/common/DatePicker';
import { cn } from '~/lib/cn';

type TimeframeType = 'This Week' | 'Yesterday' | 'Today';

export default function ReportFilter() {
  const router = useRouter();
  const colors = useColors();
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeType>('This Week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const timeframes: TimeframeType[] = ['This Week', 'Yesterday', 'Today'];

  const handleContinue = () => {
    router.push({
      pathname: '/evangelism/sessions-list',
      params: { timeframe: selectedTimeframe, startDate, endDate },
    });
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
          {/* Timeframe Selection */}
          <View className="mb-6">
            <Text className="mb-3 text-base font-semibold text-[#FF007F]">Timeframe</Text>
            <View className="flex-row gap-3">
              {timeframes.map((timeframe) => (
                <TouchableOpacity
                  key={timeframe}
                  onPress={() => setSelectedTimeframe(timeframe)}
                  className={cn(
                    'flex-1 rounded-lg border px-4 py-3',
                    selectedTimeframe === timeframe
                      ? 'border-[#FF007F] bg-[#FF007F]'
                      : 'border-gray-400 bg-transparent dark:border-gray-600'
                  )}>
                  <Text
                    className={cn(
                      'text-center text-sm font-medium',
                      selectedTimeframe === timeframe
                        ? 'text-white'
                        : 'text-gray-400 dark:text-gray-400'
                    )}>
                    {timeframe}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Dashed Separator */}
          <View className="mb-6 border-b border-dashed border-gray-400 dark:border-gray-600" />

          {/* Date Range Inputs */}
          <View className="mb-6">
            <View className="mb-4 flex-row gap-3">
              <View className="flex-1">
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Start Date"
                  disabled={selectedTimeframe !== 'This Week'}
                />
              </View>
              <View className="flex-1">
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="End Date"
                  disabled={selectedTimeframe !== 'This Week'}
                />
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity onPress={handleContinue} className="rounded-lg bg-[#FF007F] px-4 py-4">
            <Text className="text-center text-base font-semibold text-white">Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

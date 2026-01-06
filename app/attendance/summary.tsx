import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColors } from '~/lib/useColorScheme';

export default function AttendanceSummary() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams<{
    serviceName?: string;
    date?: string;
    time?: string;
    status?: 'Present' | 'Absent';
  }>();

  const serviceName = params.serviceName || 'Sunday Service';
  const date = params.date || 'Sep 15th, 2025';
  const time = params.time || '9:00 AM';
  const status = (params.status as 'Present' | 'Absent') || 'Present';

  // Extract day from service name (e.g., "Sunday Service" -> "Sunday")
  const serviceDay = serviceName.includes('Sunday')
    ? 'Sunday'
    : serviceName.includes('Midweek')
      ? 'Wednesday'
      : serviceName.includes('Prayer')
        ? 'Friday'
        : 'Sunday';

  // Parse time to get start and end time (e.g., "9:00 AM" -> "9:00 - 11:00 am")
  const startTime = time;
  const endTime = time.includes('9:00')
    ? '11:00 am'
    : time.includes('6:00')
      ? '8:00 pm'
      : '11:00 am';
  const timeRange = `${startTime} - ${endTime}`;

  // Calculate duration (2 hours for most services)
  const duration = '2 Hours';

  // Dummy data - separate members and first timers
  const members = [
    'Elizabeth Osuwa (Myself)',
    'Temitope Sanusi',
    'John Doe',
    'Emmanuel Adek',
  ];

  const firstTimers = ['Jacob Caleb', 'John John'];

  const totalAttendees = members.length + firstTimers.length;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black dark:text-white">Report Summary</Text>
        <View className="w-6" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          {/* Report Summary Card */}
          <View className="mb-6 rounded-lg bg-white p-6 dark:bg-gray-800">
            <View className="mb-3">
              <Text className="text-base text-black dark:text-white">
                Service Day Selected : <Text className="font-semibold">{serviceDay}</Text>
              </Text>
            </View>
            <View className="mb-3">
              <Text className="text-base text-black dark:text-white">
                Time of Service : <Text className="font-semibold">{timeRange}</Text>
              </Text>
            </View>
            <View className="mb-3">
              <Text className="text-base text-black dark:text-white">
                Time Duration : <Text className="font-semibold">{duration}</Text>
              </Text>
            </View>
            <View>
              <Text className="text-base text-black dark:text-white">
                Total Attendee : <Text className="font-semibold">{totalAttendees}</Text>
              </Text>
            </View>
          </View>

          {/* Names of those in attendance Section */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-bold text-black dark:text-white">
              Names of those in attendance
            </Text>

            {/* Members Subsection */}
            <View className="mb-4 rounded-lg bg-white p-6 dark:bg-gray-800">
              <Text className="mb-4 text-base font-semibold text-black dark:text-white">Members</Text>
              <View className="gap-2">
                {members.map((member, index) => (
                  <View key={index} className="flex-row items-start">
                    <Text className="mr-3 text-lg text-black dark:text-white">•</Text>
                    <Text className="flex-1 text-base text-black dark:text-white">{member}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* First Timers Subsection */}
            <View className="rounded-lg bg-white p-6 dark:bg-gray-800">
              <Text className="mb-4 text-base font-semibold text-black dark:text-white">
                First Timer(s)
              </Text>
              {firstTimers.length > 0 ? (
                <View className="gap-2">
                  {firstTimers.map((firstTimer, index) => (
                    <View key={index} className="flex-row items-start">
                      <Text className="mr-3 text-lg text-black dark:text-white">•</Text>
                      <Text className="flex-1 text-base text-black dark:text-white">{firstTimer}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-sm text-gray-400">No first timers</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


import { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '~/lib/useColorScheme';
import { DropdownSelect } from '~/components/common/DropdownSelect';

interface AttendanceRecord {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'Present' | 'Absent';
}

export default function AttendanceHistory() {
  const router = useRouter();
  const colors = useColors();
  const [selectedFilter, setSelectedFilter] = useState('All Records');

  const filterOptions = ['All Records', 'Present', 'Absent', 'This Month', 'This Year'];

  // Dummy attendance records data
  const allAttendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      serviceName: 'Sunday Service',
      date: 'Sep 15th, 2025',
      time: '9:00 AM',
      status: 'Present',
    },
    {
      id: '2',
      serviceName: 'Sunday Service',
      date: 'Sep 8th, 2025',
      time: '9:00 AM',
      status: 'Present',
    },
    {
      id: '3',
      serviceName: 'Sunday Service',
      date: 'Sep 1st, 2025',
      time: '9:00 AM',
      status: 'Present',
    },
    {
      id: '4',
      serviceName: 'Sunday Service',
      date: 'Aug 25th, 2025',
      time: '9:00 AM',
      status: 'Present',
    },
    {
      id: '5',
      serviceName: 'Sunday Service',
      date: 'Aug 18th, 2025',
      time: '9:00 AM',
      status: 'Absent',
    },
    {
      id: '6',
      serviceName: 'Midweek Service',
      date: 'Sep 12th, 2025',
      time: '6:00 PM',
      status: 'Present',
    },
    {
      id: '7',
      serviceName: 'Midweek Service',
      date: 'Sep 5th, 2025',
      time: '6:00 PM',
      status: 'Present',
    },
    {
      id: '8',
      serviceName: 'Prayer Vigil',
      date: 'Sep 10th, 2025',
      time: '9:00 PM',
      status: 'Present',
    },
    {
      id: '9',
      serviceName: 'Sunday Service',
      date: 'Aug 11th, 2025',
      time: '9:00 AM',
      status: 'Present',
    },
    {
      id: '10',
      serviceName: 'Fellowship Meeting',
      date: 'Sep 3rd, 2025',
      time: '4:00 PM',
      status: 'Present',
    },
  ];

  // Summary metrics (matching the design)
  const totalMeetings = 50;
  const meetingsAttended = 25;
  const attendanceRate = 67; // 67% as shown in the design

  // Filter records based on selected filter
  const attendanceRecords = useMemo(() => {
    if (selectedFilter === 'All Records') {
      return allAttendanceRecords;
    }
    if (selectedFilter === 'Present') {
      return allAttendanceRecords.filter((record) => record.status === 'Present');
    }
    if (selectedFilter === 'Absent') {
      return allAttendanceRecords.filter((record) => record.status === 'Absent');
    }
    // For "This Month" and "This Year", return all for now
    return allAttendanceRecords;
  }, [selectedFilter]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black dark:text-white">Attendance History</Text>
        <View className="w-6" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          {/* Filter Dropdown */}
          <View className="mb-6">
            <DropdownSelect
              items={filterOptions}
              value={selectedFilter}
              onChange={setSelectedFilter}
              placeholder="Select filter"
            />
          </View>

          {/* Attendance Summary Section */}
          <View className="mb-6 rounded-lg bg-white p-6 dark:bg-gray-800">
            <Text className="mb-4 text-lg font-bold text-black dark:text-white">
              Attendance Summary
            </Text>
            <View className="flex-row justify-between">
              <View className="flex-1 items-center">
                <Text className="text-3xl font-bold text-[#FF6B9D]">{attendanceRate}%</Text>
                <Text className="mt-1 text-sm text-slate-600 dark:text-gray-300">
                  Attendance Rate
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-3xl font-bold text-[#FF6B9D]">{meetingsAttended}</Text>
                <Text className="mt-1 text-sm text-slate-600 dark:text-gray-300">
                  Meetings Attended
                </Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-3xl font-bold text-[#FF6B9D]">{totalMeetings}</Text>
                <Text className="mt-1 text-sm text-slate-600 dark:text-gray-300">
                  Total Meetings
                </Text>
              </View>
            </View>
          </View>

          {/* Attendance Records List - Empty State */}
          {attendanceRecords.length === 0 ? (
            <View className="items-center justify-center rounded-lg bg-white py-16 dark:bg-gray-800">
              <Ionicons name="calendar-outline" size={80} color="#9CA3AF" />
              <Text className="mt-6 text-xl font-semibold text-gray-400">No Attendance Records</Text>
              <Text className="mt-2 text-center text-sm text-gray-500">
                Your attendance history will appear here once you start marking attendance for
                meetings.
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {attendanceRecords.map((record) => (
                <TouchableOpacity
                  key={record.id}
                  onPress={() =>
                    router.push({
                      pathname: '/attendance/summary',
                      params: {
                        serviceName: record.serviceName,
                        date: record.date,
                        time: record.time,
                        status: record.status,
                      },
                    })
                  }
                  className="flex-row items-center justify-between rounded-lg bg-white p-4 dark:bg-gray-800">
                  <View className="flex-1 flex-row items-center">
                    <Text className="mr-3 text-xl text-white">•</Text>
                    <View className="flex-1">
                      <View className="mb-1 flex-row items-center">
                        <Text className="text-base font-semibold text-black dark:text-white">
                          {record.serviceName}
                        </Text>
                        <View className="ml-2">
                          {record.status === 'Present' ? (
                            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                          ) : (
                            <Ionicons name="close-circle" size={20} color="#D32F2F" />
                          )}
                        </View>
                      </View>
                      <View className="flex-row items-center">
                        <Text className="text-sm text-gray-400">{record.date}</Text>
                        <View className="mx-2 flex-row items-center">
                          <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                          <Text className="ml-1 text-sm text-gray-400">{record.time}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    className={`rounded-lg px-3 py-1.5 ${
                      record.status === 'Present' ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                    <Text className="text-xs font-semibold text-white">{record.status}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push('/attendance/main')}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-[#FF007F] shadow-lg"
        style={{
          shadowColor: '#FF007F',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}


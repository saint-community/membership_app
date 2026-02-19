import { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { DropdownSelect } from '~/components/common/DropdownSelect';
import { useRouter } from 'expo-router';
import { useColors } from '~/lib/useColorScheme';
import { cn } from '~/lib/cn';
import { useAllMeetings } from '~/hooks/data/attendance';

interface Meeting {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  time: string;
  date: string;
  dateObj: Date;
  location?: string;
}

export default function AttendanceMeetings() {
  const router = useRouter();
  const colors = useColors();
  const { data: meetingsData, isLoading: isLoadingMeetings } = useAllMeetings();
  const [selectedFilter, setSelectedFilter] = useState<string>('All Meetings');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique meeting types from API data and format them nicely
  const meetingTypes = useMemo(() => {
    if (!meetingsData?.data) return [];
    const types = new Set(meetingsData.data.map((m) => m.type));
    return Array.from(types).map((type) => {
      // Format type for display (capitalize first letter)
      return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');
    });
  }, [meetingsData]);

  const filterOptions: string[] = ['All Meetings', ...meetingTypes];

  // Transform API meetings to UI format and filter past meetings
  const allMeetings = useMemo<Meeting[]>(() => {
    if (!meetingsData?.data) return [];

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

    return meetingsData.data
      .map((meeting) => {
        const meetingDate = new Date(meeting.date);
        meetingDate.setHours(0, 0, 0, 0);

        // Only include past meetings (meetings that have already occurred)
        if (meetingDate >= now) return null;

        return {
          id: meeting.id,
          title: meeting.title,
          subtitle: `${meeting.type} - ${meeting.scope_type}`,
          type: meeting.type,
          time: new Date(meeting.date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          date: meetingDate.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit',
          }),
          dateObj: meetingDate,
          location: meeting.scope_type,
        };
      })
      .filter((meeting): meeting is Meeting => meeting !== null)
      .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime()); // Sort by date, most recent first
  }, [meetingsData]);

  const filteredMeetings = useMemo(() => {
    let filtered = allMeetings;

    // Filter by type
    if (selectedFilter !== 'All Meetings') {
      // Convert display format back to API format for comparison
      const filterType = selectedFilter.toLowerCase().replace(/\s/g, '_');
      filtered = filtered.filter((meeting) => meeting.type === filterType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (meeting) =>
          meeting.title.toLowerCase().includes(query) ||
          meeting.subtitle.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedFilter, allMeetings, searchQuery]);

  const renderMeetingCard = ({ item }: { item: Meeting }) => (
    <View className="mb-3 rounded-lg bg-white p-4 dark:bg-gray-800">
      <View className="mb-4 flex-row items-start">
        <View className="mr-4">
          <FontAwesome5 name="church" size={24} color="#FFD93D" />
        </View>
        <View className="flex-1">
          <Text className="mb-1 text-base font-semibold">{item.title}</Text>
          <Text className="mb-1 text-sm text-gray-400">{item.subtitle}</Text>
          {item.location && (
            <View className="mt-1 flex-row items-center">
              <Ionicons name="location-outline" size={14} color="#9CA3AF" />
              <Text className="ml-1 text-xs text-gray-400">{item.location}</Text>
            </View>
          )}
        </View>
        <View className="items-end">
          <View className="mb-1 flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#9CA3AF" />
            <Text className="ml-1 text-sm text-gray-400">{item.time}</Text>
          </View>
          <Text className="text-sm text-gray-400">{item.date}</Text>
        </View>
      </View>
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/attendance/mark-attendance',
              params: { title: item.title, subtitle: item.subtitle },
            })
          }
          className="flex-1 rounded-lg bg-[#FF007F] px-4 py-3">
          <Text className="text-center text-sm font-semibold text-white">Mark Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/attendance/history')}
          className="flex-1 rounded-lg border border-gray-600 px-4 py-3">
          <Text className="text-center text-sm font-semibold dark:text-white">Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black dark:text-white">Meetings</Text>
        <View />
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          {/* Filter Section */}
          <View className="mb-6">
            {/* <Text className="mb-3 text-lg font-semibold">Filter Meetings</Text> */}
            <TextInput
              className={cn(
                'mb-4 h-14 w-full rounded-xl border border-[#8A8A8A] bg-transparent px-4 py-3 text-base text-foreground dark:text-white'
              )}
              placeholder="Search meetings"
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <DropdownSelect
              items={filterOptions}
              value={selectedFilter}
              onChange={(value) => setSelectedFilter(value)}
              placeholder="Select meeting type"
            />
          </View>

          {/* Meetings List */}
          <View className="mb-6">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold">
                Past Meetings ({filteredMeetings.length})
              </Text>
            </View>

            {isLoadingMeetings ? (
              <View className="items-center justify-center rounded-lg bg-white py-12 dark:bg-gray-800">
                <Text className="text-base text-gray-400">Loading meetings...</Text>
              </View>
            ) : filteredMeetings.length > 0 ? (
              <FlatList
                data={filteredMeetings}
                renderItem={renderMeetingCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View className="items-center justify-center rounded-lg bg-white py-12 dark:bg-gray-800">
                <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
                <Text className="mt-4 text-base text-gray-400">No past meetings found</Text>
                <Text className="mt-1 text-sm text-gray-500">
                  {searchQuery ? 'Try a different search term' : 'Try selecting a different filter'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

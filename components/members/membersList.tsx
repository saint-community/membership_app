import { Ionicons } from '@expo/vector-icons';
import { Text, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import MemberCard from './memberCard';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useColors } from '~/lib/useColorScheme';
import { useGetAllMembers } from '~/hooks/queries/members/useGetAllMembers';
import { usePullToRefresh } from '~/hooks/common/usePullToRefresh';
import { useMemo, useCallback } from 'react';
import { AddedMember } from '~/services/api/member';
import Toast from 'react-native-toast-message';

const MembersList = () => {
  // Sample data - replace with your actual data source
  // const members: Member[] = [
  //   { id: '1', name: 'John Doe', created_at: '2023-01-01', image: 'https://placeholder.com/user1' },
  //   {
  //     id: '2',
  //     name: 'Jane Smith',
  //     created_at: '2023-01-02',
  //     image: 'https://placeholder.com/user2',
  //   },
  //   {
  //     id: '3',
  //     name: 'Alice Johnson',
  //     created_at: '2023-01-03',
  //     image: 'https://placeholder.com/user3',
  //   },
  //   {
  //     id: '4',
  //     name: 'Bob Brown',
  //     created_at: '2023-01-04',
  //     image: 'https://placeholder.com/user4',
  //   },
  //   {
  //     id: '5',
  //     name: 'Charlie Davis',
  //     created_at: '2023-01-05',
  //     image: 'https://placeholder.com/user5',
  //   },
  //   {
  //     id: '6',
  //     name: 'Diana Evans',
  //     created_at: '2023-01-06',
  //     image: 'https://placeholder.com/user6',
  //   },
  //   {
  //     id: '7',
  //     name: 'Frank Green',
  //     created_at: '2023-01-07',
  //     image: 'https://placeholder.com/user7',
  //   },
  //   {
  //     id: '8',
  //     name: 'Grace Harris',
  //     created_at: '2023-01-08',
  //     image: 'https://placeholder.com/user8',
  //   },
  //   {
  //     id: '9',
  //     name: 'Hank Irving',
  //     created_at: '2023-01-09',
  //     image: 'https://placeholder.com/user9',
  //   },
  //   {
  //     id: '10',
  //     name: 'Ivy Jackson',
  //     created_at: '2023-01-10',
  //     image: 'https://placeholder.com/user10',
  //   },
  // ];

  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();
  const { data, isLoading, refresh, error, isError } = useGetAllMembers();

  const membersList = useMemo(() => (Array.isArray(data?.data) ? data.data : []), [data?.data]);

  const handleRefreshMembers = useCallback(async () => {
    try {
      const result = await refresh();
      if (result.data?.success || result.data?.data) {
        Toast.show({
          text1: 'Members list updated',
          type: 'success',
        });
      }
    } catch (error: any) {
      console.error('Failed to refresh members:', error);
      Toast.show({
        text1: error?.message || 'Failed to refresh members',
        type: 'error',
      });
    }
  }, [refresh]);

  const { isRefreshing, onRefresh } = usePullToRefresh({
    onRefresh: handleRefreshMembers,
    minimumRefreshDuration: 800,
  });

  // Show initial loading state or error message with debug info
  console.log('Members list state:', { 
    isLoading, 
    isRefreshing, 
    isError, 
    dataExists: !!data, 
    memberCount: membersList.length,
    error: error?.message 
  });

  return (
    <View className="flex-1 px-4 ">
      {isLoading && !isRefreshing ? (
        <FlatList
          data={[1, 2, 3, 4, 5]} // Show 5 skeleton items
          keyExtractor={(item) => item.toString()}
          renderItem={() => (
            <View className="mb-4 h-24 rounded-xl bg-white/10 p-4">
              <View className="flex-row items-center">
                <View className="h-12 w-12 rounded-full bg-white/20" />
                <View className="ml-4 flex-1">
                  <View className="h-4 w-32 rounded bg-white/20" />
                  <View className="mt-2 h-3 w-24 rounded bg-white/20" />
                </View>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
              progressBackgroundColor={colors.background}
            />
          }
        />
      ) : membersList.length > 0 ? (
        <FlatList<AddedMember>
          data={membersList}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <MemberCard
              name={item.full_name}
              date_joined_church={item.date_joined_church}
              id={item._id}
              image={item.full_name}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
              progressBackgroundColor={colors.background}
            />
          }
        />
      ) : (
        <View className="flex-1 items-center justify-center px-4 text-center">
          {isError ? (
            <>
              <Ionicons name="warning-outline" size={48} color="#ef4444" />
              <Text className="mt-4 text-lg font-medium text-red-500">
                Failed to Load Members
              </Text>
              <Text className="mt-2 text-center text-sm dark:text-white/60">
                {error?.message || 'Something went wrong while loading the members list.'}
              </Text>
              <TouchableOpacity
                onPress={onRefresh}
                className="mt-6 rounded-lg bg-red-500/20 px-6 py-3"
                disabled={isRefreshing}>
                <Text className="text-center font-medium text-red-500">
                  {isRefreshing ? 'Retrying...' : 'Retry'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Ionicons name="people-outline" size={48} color="#6b7280" />
              <Text className="mt-4 text-lg font-medium dark:text-white/80">
                No Members Found
              </Text>
              <Text className="mt-2 text-center text-sm dark:text-white/60">
                {data?.message || t('members.no_members') || 'Your members list is empty. Add some members to get started.'}
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/add-member')}
                className="mt-6 rounded-lg bg-blue-500/20 px-6 py-3">
                <Text className="text-center font-medium text-blue-500">
                  Add First Member
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
      <View className="absolute bottom-16 right-8">
        <TouchableOpacity
          onPress={() => router.push('/add-member')}
          className="h-14 w-14 items-center justify-center rounded-xl border border-white/20 bg-[#2A2A2A]/90 bg-opacity-20 shadow-lg backdrop-blur-2xl">
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MembersList;

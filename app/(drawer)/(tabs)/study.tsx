import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import TabBar from '~/components/studyGroup/TabBar';
import AssignmentCardList from '~/components/studyGroup/AssignmentCardList';
import { AssignmentSubmission, AssignmentUpload } from '~/models/studygroupmodels';
import { useCurrentWeekStudyGroup, useSubmissions } from '~/hooks/data/study';
import { RefreshControl, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePullToRefresh } from '~/hooks/common/usePullToRefresh';
import { useColors } from '~/lib/useColorScheme';

export default function Study() {
  const colorScheme = useColorScheme();
  const { tab = 'assignments' } = useLocalSearchParams<{ tab: 'assignments' | 'submissions' }>();
  const {
    data: assignments,
    refetch: refetchAssignments,
  } = useCurrentWeekStudyGroup();
  const {
    data: submissions,
    refetch: refetchSubmissions,
  } = useSubmissions();
  const router = useRouter();
  const colors = useColors();

  const studyGroup = useMemo(() => (assignments ? [assignments] : []), [assignments]);

  const setTab = (t: 'assignments' | 'submissions') => {
    router.replace(`/(drawer)/(tabs)/study?tab=${t}`);
  };

  const handleOpenAssignment = (selectAssignment: AssignmentUpload | AssignmentSubmission) => {
    console.log('Selected assignment:', selectAssignment);
    router.push({
      pathname: '/(drawer)/studygroup/[assignment]',
      params: { assignment: selectAssignment.id + "&&" + (tab === 'assignments' ? "true" : "false") },
    });
  };

  useFocusEffect(
    useCallback(() => {
      // Keep data fresh when user returns to this screen.
      if (tab === 'assignments') refetchAssignments();
      else refetchSubmissions();
    }, [refetchAssignments, refetchSubmissions, tab])
  );

  const { isRefreshing, onRefresh } = usePullToRefresh({
    onRefresh: async () => {
      if (tab === 'assignments') await refetchAssignments();
      else await refetchSubmissions();
    },
    minimumRefreshDuration: 800,
  });

  return (
    <SafeAreaView className="flex-1 items-center px-6">
      <View className="mb-4 w-full flex-row items-center justify-between">
        <View className="w-[25px]" />
        <Text className="text-2xl font-bold">Study Group</Text>
        <View className="w-[25px]">
          <TouchableOpacity>
            <Ionicons name="filter" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
      </View>
      <TabBar tab={tab} setTab={setTab} />
      <AssignmentCardList
        data={tab === 'assignments' ? studyGroup : submissions}
        tab={tab}
        onPress={handleOpenAssignment}
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
    </SafeAreaView>
  );
}

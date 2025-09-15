import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import TabBar from '~/components/studyGroup/TabBar';
import AssignmentCardList from '~/components/studyGroup/AssignmentCardList';
import { AssignmentSubmission, AssignmentUpload } from '~/models/studygroupmodels';
import { useCurrentWeekStudyGroup, useSubmissions } from '~/hooks/data/study';

export default function Study() {
  const { tab = 'assignments' } = useLocalSearchParams<{ tab: 'assignments' | 'submissions' }>();
  const {
    data: assignments,
    refetch: refetchAssignments,
    isRefetching: isRefetchingAssignments,
  } = useCurrentWeekStudyGroup();
  const {
    data: submissions,
    refetch: refetchSubmissions,
    isRefetching: isRefetchingSubmissions,
  } = useSubmissions();
  const router = useRouter();

  const studyGroup = useMemo(() => (assignments ? [assignments] : []), [assignments]);

  const setTab = (t: 'assignments' | 'submissions') => {
    router.replace(`/(drawer)/(tabs)/study?tab=${t}`);
  };

  const handleOpenAssignment = (selectAssignment: AssignmentUpload | AssignmentSubmission) => {
    console.log('Selected assignment:', selectAssignment);
    router.push({
      pathname: '/(drawer)/studygroup/[assignment]',
      params: { assignment: encodeURIComponent(JSON.stringify(selectAssignment)) },
    });
  };

  const handleRefresh = () => {
    if (tab === 'assignments') {
      refetchAssignments();
    } else {
      refetchSubmissions();
    }
  };

  useFocusEffect(handleRefresh);

  return (
    <SafeAreaView className="flex-1 items-center px-6">
      <Text className="mb-4 text-2xl font-bold">Study Group</Text>
      <TabBar tab={tab} setTab={setTab} />
      <AssignmentCardList
        data={tab === 'assignments' ? studyGroup : submissions}
        tab={tab}
        onPress={handleOpenAssignment}
        onRefresh={handleRefresh}
        refreshing={false} //isRefetchingAssignments || isRefetchingSubmissions}
      />
    </SafeAreaView>
  );
}

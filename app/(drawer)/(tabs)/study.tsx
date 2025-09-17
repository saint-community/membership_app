import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import TabBar from '~/components/studyGroup/TabBar';
import AssignmentCardList from '~/components/studyGroup/AssignmentCardList';
import { AssignmentSubmission, AssignmentUpload } from '~/models/studygroupmodels';
import { useCurrentWeekStudyGroup, useSubmissions } from '~/hooks/data/study';
import { TouchableOpacity, useColorScheme, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Study() {
  const colorScheme = useColorScheme();
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
        onRefresh={handleRefresh}
        refreshing={false} //isRefetchingAssignments || isRefetchingSubmissions}
      />
    </SafeAreaView>
  );
}

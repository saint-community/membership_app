import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '~/components/nativewindui/Text';
import TabBar from '~/components/studyGroup/TabBar';
import AssignmentCardList from '~/components/studyGroup/AssignmentCardList';
import {
  AssignmentSubmission,
  AssignmentUpload,
  mockAssignments,
  mockAssignmentsSubmit,
} from '~/models/studygroupmodels';
import { useCurrentWeekStudyGroup } from '~/hooks/data/study';

export default function Study() {
  const [tab, setTab] = useState<'assignments' | 'submissions'>('assignments');
  const { data: studyGroup } = useCurrentWeekStudyGroup();
  console.log(studyGroup);
  const [selectedAssignment, setSelectedAssignment] = useState<
    AssignmentUpload | AssignmentSubmission | null
  >(null);
  const [uploadVisible, setUploadVisible] = useState(false);
  const router = useRouter();

  const handleOpenAssignment = (selectAssignment: AssignmentUpload | AssignmentSubmission) => {
    console.log('Selected assignment:', selectAssignment);
    router.push({
      pathname: '/(drawer)/studygroup/[assignment]',
      params: { assignment: encodeURIComponent(JSON.stringify(selectAssignment)) },
    });
  };

  return (
    <SafeAreaView className="flex-1 items-center px-6">
      <Text className="mb-4 text-2xl font-bold">Study Group</Text>
      <TabBar tab={tab} setTab={setTab} />
      {tab === 'assignments' ? (
        <AssignmentCardList
          data={mockAssignments}
          tab="assignments"
          onPress={handleOpenAssignment}
        />
      ) : (
        <AssignmentCardList
          data={mockAssignmentsSubmit}
          tab="submissions"
          onPress={handleOpenAssignment}
        />
      )}
    </SafeAreaView>
  );
}

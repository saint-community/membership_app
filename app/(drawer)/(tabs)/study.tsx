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

export default function Study() {
  const [tab, setTab] = useState<'assignments' | 'submissions'>('assignments');
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentUpload | AssignmentSubmission | null>(null);
  const [uploadVisible, setUploadVisible] = useState(false);
  const router = useRouter();

  const handleOpenUpload = (assignment: AssignmentUpload | AssignmentSubmission) => {
    setSelectedAssignment(assignment);
    setUploadVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 items-center px-6 bg-black">
      <Text className="mb-4 text-2xl font-bold text-white">Study Group</Text>
      <TabBar tab={tab} setTab={setTab} />
      {tab === 'assignments' ? (
        <AssignmentCardList
          data={mockAssignments}
          tab="assignments"
          onPress={handleOpenUpload}
        />
      ) : (
        <AssignmentCardList
          data={mockAssignmentsSubmit}
          tab="submissions"
          onPress={handleOpenUpload}
        />
      )}
    </SafeAreaView>
  );
}

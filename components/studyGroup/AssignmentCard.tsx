import { TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { cn } from '~/lib/cn';
import { Text } from '~/components/nativewindui/Text';
import { isLate } from '~/utils/studyGroupUtils';
import { AssignmentUpload, AssignmentSubmission } from '~/models/studygroupmodels';

type AssignmentCardProps = {
  item: AssignmentUpload | AssignmentSubmission;
  tab: 'assignments' | 'submissions';
  onPress: () => void;
};

export default function AssignmentCard({ item, tab, onPress }: AssignmentCardProps) {
  const isSubmission = tab === 'submissions';
  const lateSubmission =
    isSubmission &&
    isLate((item as AssignmentSubmission).dueDate, (item as AssignmentSubmission).submissionTime);

  return (
    <TouchableOpacity onPress={() => onPress()} className="mb-3 rounded-xl bg-[#1f1f1f] p-4">
      {lateSubmission && (
        <View className="mb-2 flex-row items-center">
          <Text className="rounded-md bg-[#551c1c] px-2 py-1 font-poppins text-xs text-[#d32f2f]">
            Late submission
          </Text>
        </View>
      )}

      <View className="flex-row items-center justify-between">
        <View className="w-8/12">
          <Text numberOfLines={1} ellipsizeMode="tail" className="text-sm font-medium text-white">
            {item.title}
          </Text>
          <Text className="mt-1 text-xs text-zinc-400">
            Due:{' '}
            {isSubmission
              ? (item as AssignmentSubmission).dueDate
              : (item as AssignmentUpload).dueDate}
          </Text>
          <Text className="mt-1 text-xs text-zinc-400">
            {isSubmission
              ? `Submitted: ${(item as AssignmentSubmission).submissionTime}`
              : `Uploaded: ${(item as AssignmentUpload).uploadTime}`}
          </Text>
        </View>

        <View className=" ml-1 flex-1 flex-row items-center justify-between">
          <Text
            className={cn(
              'mt-1 -translate-y-5 rounded-md p-1 text-xs font-bold',
              tab === 'submissions' ? 'font-poppins' : '',
              {
                'bg-[#1a2550] text-[#b8c7ff]':
                  item.status === 'Overdue' || item.status === 'Approved',
                'bg-[#294e3c] text-[#4CAF50]':
                  item.status === 'Active' || item.status === 'Submitted',
              }
            )}>
            {item.status}
            {isSubmission && 'percentage' in item && item.percentage !== undefined
              ? `: ${item.percentage}%`
              : ''}
          </Text>
          <Entypo name="chevron-right" size={24} color="white" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

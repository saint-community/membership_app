import { AssignmentSubmission } from '~/models/studygroupmodels';
import { TouchableOpacity, View } from 'react-native';

import { Entypo } from '@expo/vector-icons';
import { Text } from '~/components/nativewindui/Text';
import { cn } from '~/lib/cn';
import { isLate } from '~/utils/studyGroupUtils';
import dayjs from 'dayjs';

type AssignmentCardProps = {
  item: any; // AssignmentUpload | AssignmentSubmission;
  tab: 'assignments' | 'submissions';
  onPress: () => void;
};

export default function AssignmentCard({ item, tab, onPress }: AssignmentCardProps) {
  const isSubmission = tab === 'submissions';
  const lateSubmission =
    isSubmission &&
    isLate((item as AssignmentSubmission).dueDate, (item as AssignmentSubmission).submissionTime);

  return (
    <TouchableOpacity
      onPress={() => onPress()}
      className="mb-3 rounded-xl bg-white p-4 dark:bg-gray-800">
      {lateSubmission && (
        <View className="mb-2 flex-row items-center">
          <Text className="rounded-md px-2 py-1 font-poppins text-xs text-[#d32f2f]">
            Late submission
          </Text>
        </View>
      )}

      <View className="flex-row items-center justify-between">
        <View className="w-8/12">
          <Text numberOfLines={1} ellipsizeMode="tail" className="text-sm font-medium">
            {item.title || item.study_group_title}
          </Text>
          <Text className="mt-1 text-xs ">Due: {dayjs(item.due_date).format('DD MMM, YYYY')}</Text>
          <Text className="mt-1 text-xs text-zinc-400">
            {isSubmission
              ? `Submitted: ${dayjs(item.created_at).format('DD MMM, YYYY hh:mmA')}`
              : `Uploaded: ${dayjs(item.created_at).format('DD MMM, YYYY hh:mmA')}`}
          </Text>
        </View>

        <View className=" ml-1 flex-1 flex-row items-center justify-between">
          <Text
            className={cn(
              'mt-1 -translate-y-5 rounded-md p-1 text-xs font-bold',
              tab === 'submissions' ? 'font-poppins' : '',
              {
                'bg-[#1a2550] text-[#b8c7ff]':
                  item.status === 'overdue' || item.status === 'approved',
                'bg-[#294e3c] text-[#4CAF50]':
                  item.status === 'active' || item.status === 'submitted',
                'bg-[#d32f2f] text-[#d32f2f]': item.status === 'rejected',
                'bg-[#d1d5c9] text-[#e69c14]': item.status === 'late',
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

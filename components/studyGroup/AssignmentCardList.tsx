import type { ReactElement } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import AssignmentCard from './AssignmentCard';
import { AssignmentUpload, AssignmentSubmission } from '~/models/studygroupmodels';

type AssignmentCardProps = {
  data: AssignmentUpload[] | AssignmentSubmission[];
  tab: 'assignments' | 'submissions';
  onPress: (item: AssignmentUpload | AssignmentSubmission) => void;
  refreshControl?: ReactElement<typeof RefreshControl>;
};

export default function AssignmentCardList({
  data,
  tab,
  onPress,
  refreshControl,
}: AssignmentCardProps) {
  return (
    <View className="w-full flex-1">
      <FlatList<AssignmentUpload | AssignmentSubmission>
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AssignmentCard item={item} tab={tab} onPress={() => onPress(item)} />
        )}
        refreshControl={refreshControl}
      />
    </View>
  );
}

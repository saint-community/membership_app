import { FlatList, View } from 'react-native';
import AssignmentCard from './AssignmentCard';
import { AssignmentUpload, AssignmentSubmission } from '~/models/studygroupmodels';

type AssignmentCardProps = {
  data: AssignmentUpload[] | AssignmentSubmission[];
  tab: 'assignments' | 'submissions';
  onPress: (item: AssignmentUpload | AssignmentSubmission) => void;
};

export default function AssignmentCardList({ data, tab, onPress }: AssignmentCardProps) {
  console.log(data.length);
  return (
    <View className="w-full flex-1">
      <FlatList<AssignmentUpload | AssignmentSubmission>
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AssignmentCard item={item} tab={tab} onPress={() => onPress(item)} />
        )}
      />
    </View>
  );
}

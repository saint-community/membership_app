import MembersList from '~/components/members/membersList';
import { View } from 'react-native';

export default function Members() {
  return (
    <View className="p-safe flex-1 ">
      <MembersList />
    </View>
  );
}

import { View, Text, TouchableOpacity } from 'react-native';
import EditMemberForm from '~/components/members/editMemberForm';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColors } from '~/lib/useColorScheme';

const EditMember = () => {
  const router = useRouter();
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="p-safe flex-1 bg-background ">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold dark:text-white">Edit Member</Text>
        <View />
      </View>
      <EditMemberForm memberId={id || ''} />
    </View>
  );
};

export default EditMember;

import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import AddMemberForm from '~/components/members/addMemberForm';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '~/theme/colors';

const AddMember = () => {
  const router = useRouter();
  const colors = useColors();
  return (
    <View className="p-safe flex-1 bg-black ">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-white">Add Member Form</Text>
        <View />
      </View>
      <AddMemberForm />
    </View>
  );
};

export default AddMember;

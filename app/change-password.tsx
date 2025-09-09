import ChangePasswordForm from '~/components/forms/ChangePasswordForm';
import { TouchableOpacity, View } from 'react-native';
import { useChangePassword } from '~/hooks/mutations/auth/useChangePassword';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS } from '~/theme/colors';

export default function ChangePassword() {
  const { isLoading, onSubmit } = useChangePassword();
  return (
    <View className="p-safe h-full flex-1 bg-[#141414] !px-6 ">
      <View className=" flex flex-row items-center justify-between">
        <View className="flex-row items-center py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <Text className="my-8 text-center text-xl font-bold text-white">Change Password</Text>
        <View />
      </View>

      <ChangePasswordForm onSubmit={onSubmit} isLoading={isLoading} />
    </View>
  );
}

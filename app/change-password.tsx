import ChangePasswordForm from '~/components/forms/ChangePasswordForm';
import { View, ScrollView, Text } from 'react-native';
import { useChangePassword } from '~/hooks/mutations/auth/useChangePassword';
import { Header } from '@/components/Header';

export default function ChangePassword() {
  const { isLoading, onSubmit } = useChangePassword();

  return (
    <View className="flex-1 bg-background">
      <Header title="Change Password" />
      <ScrollView 
        className="flex-1 px-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View className="py-8">
          <Text className="text-2xl font-poppins font-bold text-foreground">
            Reset Password
          </Text>
          <Text className="text-base font-inter text-muted-foreground mt-2 opacity-80">
            Secure your account by choosing a new, strong password.
          </Text>
        </View>

        <ChangePasswordForm onSubmit={onSubmit} isLoading={isLoading} />
      </ScrollView>
    </View>
  );
}

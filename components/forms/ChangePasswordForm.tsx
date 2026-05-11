import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View , Text } from 'react-native';
import { Input, Button } from 'heroui-native';
import { Ionicons } from '@expo/vector-icons';
import { STORAGE_KEYS } from '~/utils/constants';
import { getObjectData } from '~/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useColors } from '@/lib/useColorScheme';

// Zod schema for form validation
const changePasswordSchema = z
  .object({
    otp: z.string().min(1, 'OTP is required').length(6, 'OTP must be 6 digits'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    password_confirmation: z
      .string()
      .min(1, 'Password confirmation is required')
      .min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordFormData) => void;
  isLoading: boolean;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSubmit, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const colors = useColors();
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const fetchEmail = async () => {
      const user = await getObjectData(STORAGE_KEYS.USER);
      setEmail(user?.email || '');
    };
    fetchEmail();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View className="space-y-6 gap-y-6">
      <View className="bg-primary/5 p-5 rounded-2xl border border-primary/10 mb-2">
        <View className="flex-row items-center gap-2 mb-1">
          <Ionicons name="mail-unread-outline" size={20} color={colors.primary} />
          <Text className="text-primary font-poppins font-bold">Verification Needed</Text>
        </View>
        <Text className="text-primary/70 font-inter text-sm leading-relaxed">
          Please enter the 6-digit OTP sent to your email: <Text className="font-bold">{email}</Text>
        </Text>
      </View>

      <View>
        <Controller
          control={control}
          name="otp"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="OTP Code"
              placeholder="Enter 6-digit code"
              value={value}
              onChangeText={onChange}
              keyboardType="number-pad"
              maxLength={6}
              variant="bordered"
              color={errors.otp ? 'danger' : 'primary'}
              style={{ borderRadius: 14 }}
              className="font-poppins font-bold text-lg tracking-[8px]"
            />
          )}
        />
        {errors.otp && <Text className="mt-1.5 ml-1 text-xs font-inter text-destructive font-medium">{errors.otp.message}</Text>}
      </View>

      <View>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="New Password"
              placeholder="Set new password"
              value={value}
              onChangeText={onChange}
              variant="bordered"
              color={errors.password ? 'danger' : 'primary'}
              secureTextEntry={!showPassword}
              style={{ borderRadius: 14 }}
              endContent={
                <TouchableOpacity onPress={togglePasswordVisibility} className="px-2">
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color={colors.mutedForeground} 
                  />
                </TouchableOpacity>
              }
            />
          )}
        />
        {errors.password && (
          <Text className="mt-1.5 ml-1 text-xs font-inter text-destructive font-medium">{errors.password.message}</Text>
        )}
      </View>

      <View>
        <Controller
          control={control}
          name="password_confirmation"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={value}
              onChangeText={onChange}
              variant="bordered"
              color={errors.password_confirmation ? 'danger' : 'primary'}
              secureTextEntry={!showPassword}
              style={{ borderRadius: 14 }}
              endContent={
                <TouchableOpacity onPress={togglePasswordVisibility} className="px-2">
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color={colors.mutedForeground} 
                  />
                </TouchableOpacity>
              }
            />
          )}
        />
        {errors.password_confirmation && (
          <Text className="mt-1.5 ml-1 text-xs font-inter text-destructive font-medium">{errors.password_confirmation.message}</Text>
        )}
      </View>

      <Button
        className={`mt-6 shadow-xl ${isValid && !isLoading ? 'shadow-primary/30' : ''}`}
        color="primary"
        size="lg"
        isLoading={isLoading}
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
        style={{ borderRadius: 16, height: 56 }}
      >
        Set New Password
      </Button>
    </View>
  );
};

export default ChangePasswordForm;

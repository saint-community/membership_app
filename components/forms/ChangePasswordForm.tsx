import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STORAGE_KEYS } from '~/utils/constants';
import { getObjectData } from '~/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useColors } from '~/lib/useColorScheme';
import { cn } from '~/lib/cn';
import { Button } from '~/components/Button';

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

  const inputBorder = (hasError: boolean) =>
    cn(
      'flex-row items-center rounded-xl border bg-transparent px-4',
      hasError ? 'border-red-500' : 'border-[#8A8A8A] dark:border-gray-600'
    );

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
        <Text className="mb-2 text-sm font-medium text-foreground">OTP Code</Text>
        <Controller
          control={control}
          name="otp"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={cn(
                'h-14 w-full rounded-xl border bg-transparent px-4 py-3 text-base font-poppins font-bold tracking-[8px] text-foreground dark:text-white',
                errors.otp ? 'border-red-500' : 'border-[#8A8A8A] dark:border-gray-600'
              )}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#666"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="number-pad"
              maxLength={6}
            />
          )}
        />
        {errors.otp && (
          <Text className="mt-1.5 ml-1 text-xs font-inter text-destructive font-medium">{errors.otp.message}</Text>
        )}
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium text-foreground">New Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className={inputBorder(!!errors.password)}>
              <TextInput
                className="flex-1 py-3 text-base text-foreground dark:text-white"
                placeholder="Set new password"
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.grey ?? '#9CA3AF'}
                />
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.password && (
          <Text className="mt-1.5 ml-1 text-xs font-inter text-destructive font-medium">{errors.password.message}</Text>
        )}
      </View>

      <View>
        <Text className="mb-2 text-sm font-medium text-foreground">Confirm New Password</Text>
        <Controller
          control={control}
          name="password_confirmation"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className={inputBorder(!!errors.password_confirmation)}>
              <TextInput
                className="flex-1 py-3 text-base text-foreground dark:text-white"
                placeholder="Confirm new password"
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.grey ?? '#9CA3AF'}
                />
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.password_confirmation && (
          <Text className="mt-1.5 ml-1 text-xs font-inter text-destructive font-medium">
            {errors.password_confirmation.message}
          </Text>
        )}
      </View>

      <Button
        className="mt-6 rounded-2xl"
        title="Set New Password"
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || isLoading}
        isLoading={isLoading}
      />
    </View>
  );
};

export default ChangePasswordForm;

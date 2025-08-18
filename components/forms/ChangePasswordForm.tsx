import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { STORAGE_KEYS } from '~/utils/constants';
import { getObjectData } from '~/utils';
import { useGetOtp } from '~/hooks/mutations/useGetOTP';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
  useGetOtp();


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
    <React.Fragment>
      <View className="mb-6">
        <View className="mb-12 rounded-md border-l-2 border-[#333] border-l-yellow-600 bg-[#2a2a2a4d] p-4">
          <Text className="text-sm text-white">
            Please enter the OTP sent to your email: {email}
          </Text>
        </View>
        <Text className="text-md mb-4 font-semibold text-white">Enter OTP</Text>

        <View className="relative">
          <Controller
            control={control}
            name="otp"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`h-16 w-full rounded-xl border border-[#333] bg-[#2A2A2A] px-4 py-3.5 text-base text-white ${
                  errors.otp ? 'border-2 border-red-500' : ''
                }`}
                placeholder="Enter OTP code"
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChange}
                keyboardType="number-pad"
                maxLength={6}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                
              />
            )}
          />
        </View>
        {errors.otp && <Text className="mt-1 text-xs text-red-500">{errors.otp.message}</Text>}
      </View>

     

      <View className="mb-6">
        <Text className="text-md mb-4 font-semibold text-white">Password</Text>

        <View className="relative">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`h-16 w-full rounded-xl border border-[#333] bg-[#2A2A2A] px-4 py-3.5 pr-12 text-base text-white ${
                  errors.password ? 'border-2 border-red-500' : ''
                }`}
                placeholder="Set new password"
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChange}
                // onFocus={onPasswordFocus}
                onBlur={(e) => {
                  onBlur();
                  // onFieldBlur();
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
               
              />
            )}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="absolute bottom-0 right-3 top-0 w-8 items-center justify-center">
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#666" />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text className="mt-1 text-xs text-red-500">{errors.password.message}</Text>
        )}
      </View>
      <View className="mb-6">
        <Text className="text-md mb-4 font-semibold text-white">Confirm password</Text>

        <View className="relative">
          <Controller
            control={control}
            name="password_confirmation"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`h-16 w-full rounded-xl border border-[#333] bg-[#2A2A2A] px-4 py-3.5 pr-12 text-base text-white ${
                  errors.password_confirmation ? 'border-2 border-red-500' : ''
                }`}
                placeholder="Confirm new password"
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChange}
                // onFocus={onPasswordFocus}
                onBlur={(e) => {
                  onBlur();
                  // onFieldBlur();
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
             
              />
            )}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="absolute bottom-0 right-3 top-0 w-8 items-center justify-center">
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#666" />
          </TouchableOpacity>
        </View>
        {errors.password_confirmation && (
          <Text className="mt-1 text-xs text-red-500">{errors.password_confirmation.message}</Text>
        )}
      </View>

      <TouchableOpacity
        className={`h-12 w-full items-center justify-center rounded-lg ${
          isValid && !isLoading ? 'bg-[#FF007F]' : 'bg-[#353535]'
        }`}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading || !isValid}>
        <Text className="text-base font-semibold text-white">
          {isLoading ? 'Loading...' : 'Set New Password'}
        </Text>
      </TouchableOpacity>
    </React.Fragment>
  );
};

export default ChangePasswordForm;

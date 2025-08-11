import { Controller, useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod schema for form validation
const changePasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface LoginFormProps {
  onSubmit: (data: ChangePasswordFormData) => Promise<void>;
  isLoading: boolean;
  onPasswordFocus: () => void;
  onFieldBlur: () => void;
}

const ChangePasswordForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  onPasswordFocus,
  onFieldBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false);

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
        <Text className="mb-4 text-center text-lg font-bold text-white">Set a new password</Text>

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
                onFocus={onPasswordFocus}
                onBlur={(e) => {
                  onBlur();
                  onFieldBlur();
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
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

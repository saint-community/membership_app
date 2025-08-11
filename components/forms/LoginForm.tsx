import { Controller, useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod schema for form validation
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  onEmailFocus: () => void;
  onPasswordFocus: () => void;
  onFieldBlur: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  onEmailFocus,
  onPasswordFocus,
  onFieldBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <React.Fragment>
      <Text className="mb-4 text-lg font-bold text-white">
        Enter your Email Address
      </Text>

      <View className="mb-4">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`h-14 w-full rounded-xl border border-[#333] bg-[#2A2A2A] px-4 py-3 text-base text-white ${
                errors.email ? 'border-2 border-red-500' : ''
              }`}
              placeholder="e.g. temitopesanusi@example.com"
              placeholderTextColor="#666"
              value={value}
              onChangeText={onChange}
              onFocus={onEmailFocus}
              onBlur={(e) => {
                onBlur();
                onFieldBlur();
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          )}
        />
        {errors.email && <Text className="mt-1 text-xs text-red-500">{errors.email.message}</Text>}
      </View>

      <Text className="mb-4 text-lg font-bold text-white">
        Enter your Password
      </Text>

      <View className="mb-6">
        <View className="relative">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`h-14 w-full rounded-xl border border-[#333] bg-[#2A2A2A] px-4 py-3.5 pr-12 text-base text-white ${
                  errors.password ? 'border-2 border-red-500' : ''
                }`}
                placeholder="******"
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
            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#666" />
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
          {isLoading ? 'Signing In...' : 'Next'}
        </Text>
      </TouchableOpacity>
    </React.Fragment>
  );
};

export default LoginForm;

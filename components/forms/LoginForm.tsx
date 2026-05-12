import { Controller, useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useColors } from '~/lib/useColorScheme';
import { cn } from '~/lib/cn';
import { Button } from '~/components/Button';

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
  onSubmit: (data: LoginFormData) => void;
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
  const colors = useColors();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: 'worker1@example.com',
      password: 'password',
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <React.Fragment>
      <View className="mb-8">
        <Text className="text-2xl font-poppins font-bold text-foreground">Welcome Back</Text>
        <Text className="text-sm font-inter text-muted-foreground mt-1 opacity-70">
          Sign in to your account to continue
        </Text>
      </View>

      <View className="space-y-6 gap-y-6">
        <View>
          <Text className="mb-2 text-sm font-medium text-foreground">Email Address</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={cn(
                  'h-14 w-full rounded-xl border bg-transparent px-4 py-3 text-base text-foreground dark:text-white',
                  errors.email ? 'border-red-500' : 'border-[#8A8A8A] dark:border-gray-600'
                )}
                placeholder="temitopesanusi@example.com"
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChange}
                onFocus={onEmailFocus}
                onBlur={() => {
                  onBlur();
                  onFieldBlur();
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && (
            <Text className="mt-1.5 ml-1 text-xs font-inter text-destructive font-medium">{errors.email.message}</Text>
          )}
        </View>

        <View>
          <Text className="mb-2 text-sm font-medium text-foreground">Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                className={cn(
                  'flex-row items-center rounded-xl border bg-transparent px-4',
                  errors.password ? 'border-red-500' : 'border-[#8A8A8A] dark:border-gray-600'
                )}>
                <TextInput
                  className="flex-1 py-3 text-base text-foreground dark:text-white"
                  placeholder="******"
                  placeholderTextColor="#666"
                  value={value}
                  onChangeText={onChange}
                  onFocus={onPasswordFocus}
                  onBlur={() => {
                    onBlur();
                    onFieldBlur();
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.grey}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && (
            <Text className="mt-1.5 ml-1 text-xs font-inter text-destructive font-medium">{errors.password.message}</Text>
          )}
        </View>

        <Button
          className="mt-4 rounded-2xl"
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || isLoading}
          isLoading={isLoading}
        />
      </View>
    </React.Fragment>
  );
};

export default LoginForm;

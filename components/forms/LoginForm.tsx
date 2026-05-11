import { Controller, useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Input, Button } from 'heroui-native';
import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useColors } from '@/lib/useColorScheme';

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
        <Text className="text-2xl font-poppins font-bold text-foreground">
          Welcome Back
        </Text>
        <Text className="text-sm font-inter text-muted-foreground mt-1 opacity-70">
          Sign in to your account to continue
        </Text>
      </View>

      <View className="space-y-6 gap-y-6">
        <View>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email Address"
                placeholder="temitopesanusi@example.com"
                value={value}
                onChangeText={onChange}
                onFocus={onEmailFocus}
                onBlur={() => {
                  onBlur();
                  onFieldBlur();
                }}
                variant="bordered"
                color={errors.email ? 'danger' : 'primary'}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ borderRadius: 14 }}
              />
            )}
          />
          {errors.email && <Text className="mt-1.5 ml-1 text-xs font-inter text-destructive font-medium">{errors.email.message}</Text>}
        </View>

        <View>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="******"
                value={value}
                onChangeText={onChange}
                onFocus={onPasswordFocus}
                onBlur={() => {
                  onBlur();
                  onFieldBlur();
                }}
                variant="bordered"
                color={errors.password ? 'danger' : 'primary'}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
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

        <Button
          className={`mt-4 shadow-xl ${isValid && !isLoading ? 'shadow-primary/30' : ''}`}
          color="primary"
          size="lg"
          isLoading={isLoading}
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
          style={{ borderRadius: 16, height: 56 }}
        >
          Sign In
        </Button>
      </View>
    </React.Fragment>
  );
};

export default LoginForm;

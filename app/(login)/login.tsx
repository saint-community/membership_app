import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { FontAwesome6 } from '@expo/vector-icons';
import { swipeList } from '~/lib/constants';
import { useRouter } from 'expo-router';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  // Bottom sheet ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Variables
  const snapPoints = useMemo(() => ['60%', '85%'], []);

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Password validation function
  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  // Handle email change with validation
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (isEmailTouched) {
      const error = validateEmail(text);
      setEmailError(error);
    }
  };

  // Handle password change with validation
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (isPasswordTouched) {
      const error = validatePassword(text);
      setPasswordError(error);
    }
  };

  // Handle email blur (when user finishes typing)
  const handleEmailBlur = () => {
    setIsEmailTouched(true);
    const error = validateEmail(email);
    setEmailError(error);
  };

  // Handle password blur (when user finishes typing)
  const handlePasswordBlur = () => {
    setIsPasswordTouched(true);
    const error = validatePassword(password);
    setPasswordError(error);
  };

  // Callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleLogin = async () => {
    // Validate both email and password before proceeding
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setEmailError(emailError);
    setPasswordError(passwordError);
    setIsEmailTouched(true);
    setIsPasswordTouched(true);

    if (emailError || passwordError) {
      return;
    }

    setIsLoading(true);

    // Simulate login API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to main app after successful login
      router.replace('/(drawer)/(tabs)');
    }, 1500);
  };

  const hasErrors = !!(emailError || passwordError);

  return (
    <ImageBackground
      source={swipeList[2].source}
      resizeMode="cover"
      className="h-full w-full items-center justify-center">
      <View className="absolute inset-0 flex-1 items-center justify-center bg-black/70">
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{
            backgroundColor: '#1F1F1F',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
          handleIndicatorStyle={{
            backgroundColor: '#666',
            width: 40,
            height: 4,
          }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1">
            <BottomSheetView className="flex-1 px-6 pb-8 pt-5">
              <View className="mb-6">
                <Text className="mb-4 text-center text-lg font-bold text-white">
                  Enter your Email Address
                </Text>

                <View className="mb-4">
                  <TextInput
                    className={`h-12 w-full rounded-xl border border-[#333] bg-[#2A2A2A] px-4 py-3.5 text-base text-white ${
                      emailError && isEmailTouched ? 'border-2 border-red-500' : ''
                    }`}
                    placeholder="e.g. temitopesanusi@example.com"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={handleEmailChange}
                    onBlur={handleEmailBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {emailError && isEmailTouched && (
                    <Text className="mt-1 text-xs text-red-500">{emailError}</Text>
                  )}
                </View>

                <View className="mb-6">
                  <TextInput
                    className={`h-12 w-full rounded-xl border border-[#333] bg-[#2A2A2A] px-4 py-3.5 text-base text-white ${
                      passwordError && isPasswordTouched ? 'border-2 border-red-500' : ''
                    }`}
                    placeholder="Enter your password"
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {passwordError && isPasswordTouched && (
                    <Text className="mt-1 text-xs text-red-500">{passwordError}</Text>
                  )}
                </View>

                <TouchableOpacity
                  className={`h-12 w-full items-center justify-center rounded-lg bg-[#FF007F]`}
                  onPress={handleLogin}
                  disabled={isLoading || hasErrors}>
                  <Text className="text-base font-semibold text-white">Next</Text>
                </TouchableOpacity>
              </View>
            </BottomSheetView>
          </KeyboardAvoidingView>
        </BottomSheet>
      </View>
    </ImageBackground>
  );
};

export default Login;

import { useCallback, useMemo, useRef, useState } from 'react';

import Toast from 'react-native-toast-message';
import { loginUser } from '~/services/api/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

interface UseLoginReturn {
  isLoading: boolean;
  isAnyFieldFocused: boolean;
  snapPoints: string[];
  handleEmailFocus: () => void;
  handlePasswordFocus: () => void;
  handleFieldBlur: () => void;
  onSubmit: (data: any) => void;
  bottomSheetRef: React.RefObject<any>;
}

export const useLogin = (): UseLoginReturn => {
  const router = useRouter();
  const [isAnyFieldFocused, setIsAnyFieldFocused] = useState(false);

  // Bottom sheet ref
  const bottomSheetRef = useRef<any>(null);

  // Variables
  const snapPoints = useMemo(() => ['70%', '90%'], []);

  const handleEmailFocus = useCallback(() => {
    if (!isAnyFieldFocused) {
      setIsAnyFieldFocused(true);
      // Snap to 90% when email field is focused
      bottomSheetRef.current?.snapToIndex(1);
    }
  }, [isAnyFieldFocused]);

  const handlePasswordFocus = useCallback(() => {
    if (!isAnyFieldFocused) {
      setIsAnyFieldFocused(true);
      // Snap to 90% when password field is focused
      bottomSheetRef.current?.snapToIndex(1);
    }
  }, [isAnyFieldFocused]);

  const handleFieldBlur = useCallback(() => {
    // This would need to be passed the form values from the component
    // For now, we'll handle this in the component
    setIsAnyFieldFocused(false);
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: any) => {
      Toast.show({
        text1: 'Login is successful',
        type: 'success',
      });
      // Return snap point to default (70%) when form is submitted
      bottomSheetRef.current?.snapToIndex(0);
      setIsAnyFieldFocused(false);

      // Navigate to main app after successful login
      router.replace('/(drawer)/(tabs)');
    },

    onError: (error: any) => {
      Toast.show({
        text1: 'Invalid login credentials',
        type: 'error',
      });
    },
  });

  return {
    isLoading: loginMutation.isPending,
    isAnyFieldFocused,
    snapPoints,
    handleEmailFocus,
    handlePasswordFocus,
    handleFieldBlur,
    onSubmit: loginMutation.mutate,
    bottomSheetRef,
  };
};

import { useCallback, useMemo, useRef, useState } from 'react';

import { useRouter } from 'expo-router';

interface UseChangePasswordReturn {
  isLoading: boolean;
  isAnyFieldFocused: boolean;
  snapPoints: string[];
  handlePasswordFocus: () => void;
  handleFieldBlur: () => void;
  onSubmit: (data: any) => Promise<void>;
  bottomSheetRef: React.RefObject<any>;
}

export const useChangePassword = (): UseChangePasswordReturn => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAnyFieldFocused, setIsAnyFieldFocused] = useState(false);

  // Bottom sheet ref
  const bottomSheetRef = useRef<any>(null);

  // Variables
  const snapPoints = useMemo(() => ['70%', '90%'], []);


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

  const onSubmit = useCallback(async (data: any) => {
    setIsLoading(true);

    try {
      // Return snap point to default (70%) when form is submitted
      bottomSheetRef.current?.snapToIndex(0);
      setIsAnyFieldFocused(false);

      // Simulate change password API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to main app after successful change password 
      router.replace('/(drawer)/(tabs)');
    } catch (error) {
      console.error('Change Password error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return {
    isLoading,
    isAnyFieldFocused,
    snapPoints,
    handlePasswordFocus,
    handleFieldBlur,
    onSubmit,
    bottomSheetRef,
  };
}; 
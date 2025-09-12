import { useEffect, useState } from 'react';

import { STORAGE_KEYS } from '~/utils/constants';
import Toast from 'react-native-toast-message';
import { getObjectData } from '~/utils';
import { resetPassword } from '~/services/api/auth';
import { useMutation } from '@tanstack/react-query';

interface UseChangePasswordReturn {
  isLoading: boolean;
  onSubmit: (data: any) => void;
}

export const useChangePassword = (): UseChangePasswordReturn => {
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const fetchEmail = async () => {
      const user = await getObjectData(STORAGE_KEYS.USER);
      setEmail(user?.email || '');
    };
    fetchEmail();
  }, []);

  const changePasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      Toast.show({
        text1: 'Password change is successful',
        type: 'success',
      });
    },
    onError: (error: any) => {
      Toast.show({
        text1: 'Password change failed',
        text2: error?.response?.data?.message || 'An error occurred',
        type: 'error',
      });
    },
  });

  return {
    isLoading: changePasswordMutation.isPending,
    onSubmit: (data) => changePasswordMutation.mutate({ email: email, ...data }), // Use mutate directly
  };
};

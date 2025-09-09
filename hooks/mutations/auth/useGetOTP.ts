import { useEffect, useState } from 'react';

import { STORAGE_KEYS } from '~/utils/constants';
import Toast from 'react-native-toast-message';
import { getObjectData } from '~/utils';
import { requestOtp } from '~/services/api/auth';
import { useMutation } from '@tanstack/react-query';

interface IGetOTP {
  isLoading: boolean;
  onSubmit: (data: any) => void;
}

export const useGetOtp = (): IGetOTP => {
  
 
   const [email, setEmail] = useState<string>('');

  useEffect(() => {
    const fetchEmail = async () => {
      const user = await getObjectData(STORAGE_KEYS.USER);
      setEmail(user?.email || '');
    };
    fetchEmail();
  }, []);
  
   const requestOtpMutation = useMutation({
    mutationFn: requestOtp,
    onSuccess: (data: any) => {
      Toast.show({
        text1: "OTP request is successful",
        text2: "Please check your email for the OTP",
        type: 'success'
      });
    },
    onError: (error: any) => {
      Toast.show({
        text1: "OTP request failed",
        text2: error.response?.data?.message,
        type: 'error'
      });
      
    }
  });

  useEffect(() => {
    if(email) requestOtpMutation.mutate({ email: email}); // Automatically request OTP when the hook is used
    // Optionally, you can handle side effects here when the component mounts
    return () => {
      // Cleanup if needed
    };
  }, [email]);

  return {
    isLoading: requestOtpMutation.isPending,
    onSubmit: requestOtpMutation.mutate,
  };
}; 
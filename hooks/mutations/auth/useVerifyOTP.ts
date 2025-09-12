import Toast from 'react-native-toast-message';
import { verifyOtp } from '~/services/api/auth';
import { useMutation } from '@tanstack/react-query';

interface IVerifyOTP {
  isLoading: boolean;
  onSubmit: (data: any) => void;
}

export const useVerifyOtp = (): IVerifyOTP => {
  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      Toast.show({
        text1: 'OTP verification is successful',
        type: 'success',
      });
    },
    onError: () => {
      Toast.show({
        text1: 'OTP verification failed',
        type: 'error',
      });
    },
  });

  return {
    isLoading: verifyOtpMutation.isPending,
    onSubmit: verifyOtpMutation.mutate,
  };
};

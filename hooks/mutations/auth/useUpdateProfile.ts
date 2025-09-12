import { useMutation } from '@tanstack/react-query';
// import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { updateProfile, UpdateProfileRequest } from '~/services/api/auth';
import { useGlobalInvalidator } from '~/lib/react-query/query-client';
import { STORAGE_KEYS } from '~/utils/constants';
import { getObjectData, storeObjectData } from '~/utils';

interface UseUpdateProfileReturn {
  isLoading: boolean;
  onSubmit: (data: UpdateProfileRequest | FormData) => void; 
}

export const useUpdateProfile = (): UseUpdateProfileReturn  => {
  // const router = useRouter();
  const { invalidateByKey } = useGlobalInvalidator();

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest | FormData) => {
      const id = getObjectData(STORAGE_KEYS.USER)?.id;
      if (!id) {
        throw new Error('User ID not found');
      }
      return updateProfile(data, id);
    },
    onSuccess: (data: any) => {

      Toast.show({
        text1: 'Profile updated successfully',
        type: 'success',
      });

      // Invalidate and refetch user data - following editMemberForm pattern
      invalidateByKey(['me']);

      // set the updated user in local storage
      if (data) {
        storeObjectData(STORAGE_KEYS.USER, data.data);
      }

      // Navigate back to previous screen
      // router.back();
    },

    onError: (error: any) => {
      console.log('Profile update error:', error);
      Toast.show({
        text1: error?.message || 'Failed to update profile',
        type: 'error',
      });
    },
  });

  return {
    isLoading: updateProfileMutation.isPending,
    onSubmit: (data: UpdateProfileRequest | FormData) => {
      console.log('useUpdateProfile onSubmit called with:', data);
      updateProfileMutation.mutate(data);
    },
  };
};
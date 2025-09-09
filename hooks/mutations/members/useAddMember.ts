import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { addMember, CreateMemberRequest } from '~/services/api/member';
import { useGlobalInvalidator } from '~/lib/react-query/query-client';

interface UseAddMemberReturn {
  isLoading: boolean;
  onSubmit: (data: CreateMemberRequest) => void;
}

export const useAddMember = (): UseAddMemberReturn => {
  const router = useRouter();
  const { invalidateByUrl } = useGlobalInvalidator();

  const addMemberMutation = useMutation({
    mutationFn: addMember,
    onSuccess: (data: any) => {
      Toast.show({
        text1: 'Member added successfully',
        type: 'success',
      });

      // Invalidate and refetch members list using the global invalidator
      invalidateByUrl('THIS_MEMBER');

      // Navigate back to members list
      router.back();
    },

    onError: (error: any) => {
      Toast.show({
        text1: error?.message || 'Failed to add member',
        type: 'error',
      });
    },
  });

  return {
    isLoading: addMemberMutation.isPending,
    onSubmit: addMemberMutation.mutate,
  };
};
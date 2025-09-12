import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { deleteMember } from '~/services/api/member';
import { useGlobalInvalidator } from '~/lib/react-query/query-client';

interface UseDeleteMemberReturn {
  isLoading: boolean;
  onSubmit: (memberId: string) => void;
}

export const useDeleteMember = (): UseDeleteMemberReturn => {
  const router = useRouter();
  const { invalidateByUrl, invalidateByKey } = useGlobalInvalidator();

  const deleteMemberMutation = useMutation({
    mutationFn: (memberId: string) => deleteMember(memberId),
    onSuccess: (data: any, memberId: string) => {
      Toast.show({
        text1: 'Member deleted successfully',
        type: 'success',
      });

      // Invalidate and refetch members list
      invalidateByUrl('THIS_MEMBER');
      invalidateByKey(['member', memberId]);

      // Navigate back to members list
      router.back();
    },

    onError: (error: any) => {
      Toast.show({
        text1: error?.message || 'Failed to delete member',
        type: 'error',
      });
    },
  });

  return {
    isLoading: deleteMemberMutation.isPending,
    onSubmit: (memberId: string) => deleteMemberMutation.mutate(memberId),
  };
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { updateMember, UpdateMemberRequest } from '~/services/api/member';

interface UseUpdateMemberReturn {
  isLoading: boolean;
  onSubmit: (memberId: string, data: UpdateMemberRequest) => void;
}

export const useUpdateMember = (): UseUpdateMemberReturn => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateMemberMutation = useMutation({
    mutationFn: ({ memberId, data }: { memberId: string; data: UpdateMemberRequest }) => 
      updateMember(memberId, data),
    onSuccess: (data: any, variables) => {
      Toast.show({
        text1: 'Member updated successfully',
        type: 'success',
      });

      // Invalidate and refetch members list and specific member
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member', variables.memberId] });

      // Navigate back to previous screen
      router.back();
    },

    onError: (error: any) => {
      Toast.show({
        text1: error?.message || 'Failed to update member',
        type: 'error',
      });
    },
  });

  return {
    isLoading: updateMemberMutation.isPending,
    onSubmit: (memberId: string, data: UpdateMemberRequest) => 
      updateMemberMutation.mutate({ memberId, data }),
  };
};
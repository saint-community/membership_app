import { useQuery } from '@tanstack/react-query';
import { getMemberById } from '~/services/api/member';

export const useGetMember = (memberId: string) => {
  return useQuery({
    queryKey: ['member', memberId],
    queryFn: () => getMemberById(memberId),
    enabled: !!memberId,
  });
};

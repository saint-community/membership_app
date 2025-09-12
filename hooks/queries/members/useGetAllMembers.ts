import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAllMembers } from '~/services/api/member';
import { QUERY_PATHS } from '~/utils/constants';

export const useGetAllMembers = (page: number = 1) => {
  const query = useQuery({
    queryKey: [QUERY_PATHS.THIS_MEMBER, page],
    queryFn: getAllMembers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2, // Retry failed requests up to 2 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  return {
    ...query,
    refresh: query.refetch,
  };
};

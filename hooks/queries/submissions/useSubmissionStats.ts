import { useQuery } from '@tanstack/react-query';
import { getSubmissionStats } from '~/services/api/submission';

export const useSubmissionStats = () => {
  return useQuery({
    queryKey: ['submissionStats'],
    queryFn: getSubmissionStats,
  });
};

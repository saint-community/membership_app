import { useQuery } from '@tanstack/react-query';
import { getCurrentWeekStudyGroup } from '~/services/api/studyGroup';
import { useMe } from './me';

export const useCurrentWeekStudyGroup = () => {
  const { data: user } = useMe();
  return useQuery({
    queryKey: ['currentWeekStudyGroup'],
    queryFn: () => getCurrentWeekStudyGroup(user?.church_id),
  });
};

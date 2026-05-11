import { useQuery } from '@tanstack/react-query';
import { getCurrentWeekStudyGroup, getStudyGroupById } from '~/services/api/studyGroup';
import { useMe } from './me';
import { getSubmissionById, getSubmissions } from '~/services/api/submission';

export const useCurrentWeekStudyGroup = () => {
  const { data: user } = useMe();
  return useQuery({
    queryKey: ['currentWeekStudyGroup'],
    queryFn: () => getCurrentWeekStudyGroup(user?.church_id),
  });
};

export const useStudyGroupById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['studyGroupById', id],
    queryFn: () => getStudyGroupById(id),
    enabled,
  });
};

export const useSubmissions = () => {
  return useQuery({
    queryKey: ['submissions'],
    queryFn: () => getSubmissions(),
  });
};

export const useSubmissionById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['submissionById', id],
    queryFn: () => getSubmissionById(id),
    enabled,
  });
};

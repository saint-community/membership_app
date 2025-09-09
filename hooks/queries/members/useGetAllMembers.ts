import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllMembers } from "~/services/api/member";
import { QUERY_PATHS } from "~/utils/constants";

export const useGetAllMembers = (page: number = 1) => {
  const query = useQuery({
    queryKey: [QUERY_PATHS.THIS_MEMBER, page],
    queryFn: getAllMembers,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    refresh: query.refetch,
  };
};

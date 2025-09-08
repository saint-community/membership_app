import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllMembers } from "~/services/api/member";
import { QUERY_PATHS } from "~/utils/constants";

export const useGetAllMembers = (page: number = 1) => {
  return useQuery({
    queryKey: [QUERY_PATHS.THIS_MEMBER],
    queryFn: getAllMembers,
    placeholderData: keepPreviousData,
  });
};

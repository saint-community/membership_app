import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { QUERY_PATHS } from '~/utils/constants';
import { queryClient } from './query-client';

export const useGlobalInvalidator = () => {
  const qc = useQueryClient();

  const invalidateByKey = (queryKey: string | string[]) => {
    const normalizedKey = Array.isArray(queryKey) ? queryKey : [queryKey];
    qc.invalidateQueries({ queryKey: normalizedKey });
  };

  const invalidateByUrl = (url: keyof typeof QUERY_PATHS) => {
    const queryKey = QUERY_PATHS[url];
    qc.invalidateQueries({ queryKey: [queryKey] });
  };

  const invalidateMultiple = (keys: (string | keyof typeof QUERY_PATHS)[]) => {
    keys.forEach((key) => {
      if (typeof key === 'string' && key in QUERY_PATHS) {
        invalidateByUrl(key as keyof typeof QUERY_PATHS);
      } else {
        invalidateByKey(key as string);
      }
    });
  };

  const invalidateAll = () => {
    qc.invalidateQueries();
  };

  return {
    invalidateByKey,
    invalidateByUrl,
    invalidateMultiple,
    invalidateAll,
    queryClient: qc,
  };
};

export const globalInvalidator = {
  invalidateByKey: (queryKey: string | string[]) => {
    const normalizedKey = Array.isArray(queryKey) ? queryKey : [queryKey];
    queryClient.invalidateQueries({ queryKey: normalizedKey });
  },

  invalidateByUrl: (url: keyof typeof QUERY_PATHS) => {
    const key = QUERY_PATHS[url];
    queryClient.invalidateQueries({ queryKey: [key] });
  },

  invalidateMultiple: (keys: (string | keyof typeof QUERY_PATHS)[]) => {
    keys.forEach((key) => {
      if (typeof key === 'string' && key in QUERY_PATHS) {
        globalInvalidator.invalidateByUrl(key as keyof typeof QUERY_PATHS);
      } else {
        globalInvalidator.invalidateByKey(key as string);
      }
    });
  },

  invalidateAll: () => {
    queryClient.invalidateQueries();
  },

  queryClient,
};

export type GlobalInvalidator = ReturnType<typeof useGlobalInvalidator>;

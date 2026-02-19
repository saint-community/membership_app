import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useGlobalInvalidator } from '~/lib/react-query/invalidator';
import {
  createEvangelismReport,
  getEvangelismWorkerHistory,
  getAllEvangelismReports,
  getEvangelismStats,
  getEvangelismReportById,
  updateEvangelismReport,
  deleteEvangelismReport,
  getEvangelismWorkerStats,
  type CreateEvangelismDto,
  type UpdateEvangelismDto,
} from '~/services/api/evangelism';

// Query keys
export const evangelismKeys = {
  all: ['evangelism'] as const,
  workerHistory: () => [...evangelismKeys.all, 'worker-history'] as const,
  workerStats: () => [...evangelismKeys.all, 'worker-stats'] as const,
  adminAll: () => [...evangelismKeys.all, 'admin-all'] as const,
  adminStats: () => [...evangelismKeys.all, 'admin-stats'] as const,
  detail: (id: string) => [...evangelismKeys.all, 'detail', id] as const,
};

// Hook to get worker's evangelism history
export const useEvangelismWorkerHistory = () => {
  return useQuery({
    queryKey: evangelismKeys.workerHistory(),
    queryFn: getEvangelismWorkerHistory,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get all evangelism reports (Admin)
export const useAllEvangelismReports = () => {
  return useQuery({
    queryKey: evangelismKeys.adminAll(),
    queryFn: getAllEvangelismReports,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get evangelism stats (Admin)
export const useEvangelismStats = () => {
  return useQuery({
    queryKey: evangelismKeys.adminStats(),
    queryFn: getEvangelismStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get evangelism worker stats
export const useEvangelismWorkerStats = () => {
  return useQuery({
    queryKey: evangelismKeys.workerStats(),
    queryFn: getEvangelismWorkerStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get a specific evangelism report by ID
export const useEvangelismReport = (id: string) => {
  return useQuery({
    queryKey: evangelismKeys.detail(id),
    queryFn: () => getEvangelismReportById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id,
  });
};

// Hook to create evangelism report
export const useCreateEvangelismReport = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { invalidateByUrl } = useGlobalInvalidator();

  return useMutation({
    mutationFn: (data: CreateEvangelismDto) => createEvangelismReport(data),
    onSuccess: (data) => {
      console.log('create res data', data);
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: evangelismKeys.workerHistory() });
      queryClient.invalidateQueries({ queryKey: evangelismKeys.workerStats() });
      queryClient.invalidateQueries({ queryKey: evangelismKeys.adminAll() });
      queryClient.invalidateQueries({ queryKey: evangelismKeys.adminStats() });
      invalidateByUrl('EVANGELISM');
      router.back();
      Toast.show({
        text1: 'Evangelism report submitted successfully',
        type: 'success',
      });
    },
    onError: (error: any) => {
      console.log('create error', error);
      Toast.show({
        text1: error.response?.data?.message || 'Failed to submit evangelism report',
        type: 'error',
      });
    },
  });
};

// Hook to update evangelism report
export const useUpdateEvangelismReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEvangelismDto }) =>
      updateEvangelismReport(id, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: evangelismKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: evangelismKeys.workerHistory() });
      queryClient.invalidateQueries({ queryKey: evangelismKeys.workerStats() });
      queryClient.invalidateQueries({ queryKey: evangelismKeys.adminAll() });
      queryClient.invalidateQueries({ queryKey: evangelismKeys.adminStats() });
    },
  });
};

// Hook to delete evangelism report
export const useDeleteEvangelismReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEvangelismReport(id),
    onSuccess: (_, id) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: evangelismKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: evangelismKeys.workerHistory() });
      queryClient.invalidateQueries({ queryKey: evangelismKeys.workerStats() });
      queryClient.invalidateQueries({ queryKey: evangelismKeys.adminAll() });
      queryClient.invalidateQueries({ queryKey: evangelismKeys.adminStats() });
    },
  });
};

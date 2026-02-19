import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createFollowUpRecord,
  getFollowUpWorkerHistory,
  getAllFollowUpRecords,
  getFollowUpStats,
  getFollowUpRecordById,
  updateFollowUpRecord,
  deleteFollowUpRecord,
  getFollowUpWorkerStats,
  type CreateFollowUpDto,
  type UpdateFollowUpDto,
} from '~/services/api/followUp';

// Query keys
export const followUpKeys = {
  all: ['follow-up'] as const,
  workerHistory: () => [...followUpKeys.all, 'worker-history'] as const,
  workerStats: () => [...followUpKeys.all, 'worker-stats'] as const,
  adminAll: () => [...followUpKeys.all, 'admin-all'] as const,
  adminStats: () => [...followUpKeys.all, 'admin-stats'] as const,
  detail: (id: string) => [...followUpKeys.all, 'detail', id] as const,
};

// Hook to get worker's follow-up history
export const useFollowUpWorkerHistory = () => {
  return useQuery({
    queryKey: followUpKeys.workerHistory(),
    queryFn: getFollowUpWorkerHistory,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get all follow-up records (Admin)
export const useAllFollowUpRecords = () => {
  return useQuery({
    queryKey: followUpKeys.adminAll(),
    queryFn: getAllFollowUpRecords,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get follow-up stats (Admin)
export const useFollowUpStats = () => {
  return useQuery({
    queryKey: followUpKeys.adminStats(),
    queryFn: getFollowUpStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get follow-up worker stats
export const useFollowUpWorkerStats = () => {
  return useQuery({
    queryKey: followUpKeys.workerStats(),
    queryFn: getFollowUpWorkerStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get a specific follow-up record by ID
export const useFollowUpRecord = (id: string) => {
  return useQuery({
    queryKey: followUpKeys.detail(id),
    queryFn: () => getFollowUpRecordById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id,
  });
};

// Hook to create follow-up record
export const useCreateFollowUpRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFollowUpDto) => createFollowUpRecord(data),
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: followUpKeys.workerHistory() });
      queryClient.invalidateQueries({ queryKey: followUpKeys.workerStats() });
      queryClient.invalidateQueries({ queryKey: followUpKeys.adminAll() });
      queryClient.invalidateQueries({ queryKey: followUpKeys.adminStats() });
    },
    throwOnError: true,
  });
};

// Hook to update follow-up record
export const useUpdateFollowUpRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFollowUpDto }) =>
      updateFollowUpRecord(id, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: followUpKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: followUpKeys.workerHistory() });
      queryClient.invalidateQueries({ queryKey: followUpKeys.workerStats() });
      queryClient.invalidateQueries({ queryKey: followUpKeys.adminAll() });
      queryClient.invalidateQueries({ queryKey: followUpKeys.adminStats() });
    },
  });
};

// Hook to delete follow-up record
export const useDeleteFollowUpRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFollowUpRecord(id),
    onSuccess: (_, id) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: followUpKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: followUpKeys.workerHistory() });
      queryClient.invalidateQueries({ queryKey: followUpKeys.workerStats() });
      queryClient.invalidateQueries({ queryKey: followUpKeys.adminAll() });
      queryClient.invalidateQueries({ queryKey: followUpKeys.adminStats() });
    },
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMeeting,
  markAttendance,
  getAttendanceHistory,
  getAllMeetings,
  getAttendanceWorkerStats,
  type MarkAttendanceDto,
  type CreateMeetingDto,
} from '~/services/api/attendance';

// Query keys
export const attendanceKeys = {
  all: ['attendance'] as const,
  history: () => [...attendanceKeys.all, 'history'] as const,
  workerStats: () => [...attendanceKeys.all, 'worker-stats'] as const,
  adminMeetings: () => [...attendanceKeys.all, 'admin-meetings'] as const,
};

// Hook to get attendance history
export const useAttendanceHistory = () => {
  return useQuery({
    queryKey: attendanceKeys.history(),
    queryFn: getAttendanceHistory,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get all meetings (Admin)
export const useAllMeetings = () => {
  return useQuery({
    queryKey: attendanceKeys.adminMeetings(),
    queryFn: getAllMeetings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get attendance worker stats
export const useAttendanceWorkerStats = () => {
  return useQuery({
    queryKey: attendanceKeys.workerStats(),
    queryFn: getAttendanceWorkerStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to mark attendance
export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkAttendanceDto) => markAttendance(data),
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: attendanceKeys.history() });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.workerStats() });
    },
  });
};

// Hook to create meeting (Admin)
export const useCreateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMeetingDto) => createMeeting(data),
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: attendanceKeys.adminMeetings() });
    },
  });
};

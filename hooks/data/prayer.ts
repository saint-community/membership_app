import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPrayerParticipants,
  getPrayerMeetings,
  markPrayerAttendance,
  getPrayerAttendanceHistory,
  type PrayerAttendanceRequest,
} from '~/services/api/prayer';

// Query keys
export const prayerKeys = {
  all: ['prayer'] as const,
  participants: () => [...prayerKeys.all, 'participants'] as const,
  meetings: () => [...prayerKeys.all, 'meetings'] as const,
  attendance: () => [...prayerKeys.all, 'attendance'] as const,
  attendanceHistory: (meetingId?: string) =>
    [...prayerKeys.attendance(), 'history', meetingId] as const,
};

// Hook to get prayer participants
export const usePrayerParticipants = () => {
  return useQuery({
    queryKey: prayerKeys.participants(),
    queryFn: getPrayerParticipants,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get prayer meetings
export const usePrayerMeetings = () => {
  return useQuery({
    queryKey: prayerKeys.meetings(),
    queryFn: getPrayerMeetings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to mark prayer attendance
export const useMarkPrayerAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PrayerAttendanceRequest) => markPrayerAttendance(data),
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: prayerKeys.attendance() });
      queryClient.invalidateQueries({ queryKey: prayerKeys.attendanceHistory() });
    },
  });
};

// Hook to get prayer attendance history
export const usePrayerAttendanceHistory = (meetingId?: string) => {
  return useQuery({
    queryKey: prayerKeys.attendanceHistory(meetingId),
    queryFn: () => getPrayerAttendanceHistory(meetingId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!meetingId, // Only run if meetingId is provided
  });
};

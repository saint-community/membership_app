import { QUERY_PATHS } from '~/utils/constants';
import { ApiCaller } from './init';

export interface PrayerParticipant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface PrayerMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  code: string;
  isActive: boolean;
}

export interface PrayerAttendanceRequest {
  attendees: string[];
  prayer_code: string;
}

export interface PrayerAttendanceResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: {
    attendanceId: string;
    participants: PrayerParticipant[];
    meeting: PrayerMeeting;
    timestamp: string;
  };
}

export interface PrayerParticipantsResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: PrayerParticipant[];
}

export interface PrayerMeetingsResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: PrayerMeeting[];
}

// Get all prayer participants
export async function getPrayerParticipants(): Promise<PrayerParticipantsResponse> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.PRAYER_PARTICIPANTS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch participants',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get all prayer meetings
export async function getPrayerMeetings(): Promise<PrayerMeetingsResponse> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.PRAYER_MEETINGS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch meetings',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Mark prayer attendance
export async function markPrayerAttendance(
  body: PrayerAttendanceRequest
): Promise<PrayerAttendanceResponse> {
  const { data } = await ApiCaller.post(QUERY_PATHS.PRAYER_ATTENDANCE, body);
  return data;
}

// Get prayer attendance history (optional endpoint)
export async function getPrayerAttendanceHistory(meetingId?: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: any[];
}> {
  try {
    const endpoint = meetingId
      ? `${QUERY_PATHS.PRAYER_ATTENDANCE}?meetingId=${meetingId}`
      : QUERY_PATHS.PRAYER_ATTENDANCE;
    const { data } = await ApiCaller.get(endpoint);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch attendance history',
      error: error.response?.data?.error || error.message,
    };
  }
}

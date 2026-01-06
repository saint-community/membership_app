import { QUERY_PATHS } from '~/utils/constants';
import { ApiCaller } from './init';

export interface FirstTimerDto {
  name: string;
  phone: string;
  email: string;
}

export interface MarkAttendanceDto {
  attendance_code: string;
  first_timers_count: number;
  first_timers_details: FirstTimerDto[];
}

export interface CreateMeetingDto {
  title: string;
  type: string;
  scope_type: 'church' | 'fellowship' | 'cell' | 'global';
  scope_id: number;
  date: string;
  attendance_code: string;
  code_expires_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  type: string;
  scope_type: 'church' | 'fellowship' | 'cell' | 'global';
  scope_id: number;
  date: string;
  attendance_code: string;
  code_expires_at: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceRecord {
  id: string;
  meeting_id: string;
  member_id: string;
  attendance_code: string;
  first_timers_count: number;
  first_timers_details: FirstTimerDto[];
  marked_at: string;
  meeting?: Meeting;
}

// Create a new meeting (Admin)
export async function createMeeting(body: CreateMeetingDto): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: Meeting;
}> {
  try {
    const { data } = await ApiCaller.post(QUERY_PATHS.ATTENDANCE_ADMIN_MEETING, body);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create meeting',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Mark attendance using code
export async function markAttendance(body: MarkAttendanceDto): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: AttendanceRecord;
}> {
  try {
    const { data } = await ApiCaller.post(QUERY_PATHS.ATTENDANCE_MARK, body);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to mark attendance',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get my attendance history
export async function getAttendanceHistory(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: AttendanceRecord[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.ATTENDANCE_HISTORY);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch attendance history',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get all meetings (Admin)
export async function getAllMeetings(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: Meeting[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.ATTENDANCE_ADMIN_MEETINGS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch meetings',
      error: error.response?.data?.error || error.message,
    };
  }
}

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
  template_id?: string;
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

export interface AttendanceWorkerStats {
  meetings_attended: number; // Total number of meetings the worker has attended.
  first_timers_invited: number; // Total number of first timers the worker has brought.
}

export interface MeetingTemplate {
  id: string;
  title?: string;
  type?: string;
  scope_type?: 'church' | 'fellowship' | 'cell' | 'global';
  scope_id?: number;
  [key: string]: unknown;
}

/** Single meeting item from GET /attendance/template/:id/history */
export interface TemplateHistoryItem {
  _id: string;
  title: string;
  type: string;
  scope_type: string;
  scope_id: number;
  church_id?: number;
  fellowship_id?: number;
  template_id: string;
  date: string;
  time: string;
  is_active?: boolean;
  attended: boolean;
}

/** Overview from template history response */
export interface TemplateHistoryOverview {
  total_meetings: number;
  meetings_attended: number;
  attendance_rate: number;
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
  status?: boolean;
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
    const { data } = await ApiCaller.get(QUERY_PATHS.ATTENDANCE_UPCOMING_MEETINGS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch meetings',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get worker stats
export async function getAttendanceWorkerStats(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: AttendanceWorkerStats;
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.ATTENDANCE_WORKER_STATS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch attendance worker stats',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get meeting templates (worker; uses worker's church_id from JWT)
export async function getAttendanceTemplates(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: MeetingTemplate[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.ATTENDANCE_TEMPLATES);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch meeting templates',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get meeting history for a template (worker; uses worker's church_id from JWT)
export async function getTemplateHistory(templateId: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: TemplateHistoryItem[];
  overview?: TemplateHistoryOverview;
}> {
  try {
    const path = QUERY_PATHS.ATTENDANCE_TEMPLATE_HISTORY.replace(':id', templateId);
    const { data } = await ApiCaller.get(path);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch template meeting history',
      error: error.response?.data?.error || error.message,
    };
  }
}

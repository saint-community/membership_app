import { QUERY_PATHS } from '~/utils/constants';
import { ApiCaller } from './init';

export interface TeamMemberDto {
  member_id: string;
  type?: 'worker' | 'member';
  name: string;
}

export interface MemberTaughtDto {
  member_id: string;
  name: string;
}

export interface FollowUpRecordDto {
  members_taught: MemberTaughtDto[];
  subject: string;
  material_used: string;
  duration_minutes: number;
  comments: string;
}

export interface CreateFollowUpDto {
  session_date: string;
  start_time: string;
  location_area: string;
  participants: TeamMemberDto[];
  records: FollowUpRecordDto[];
}

export interface UpdateFollowUpDto {
  session_date?: string;
  start_time?: string;
  location_area?: string;
  participants?: TeamMemberDto[];
  records?: FollowUpRecordDto[];
}

export interface FollowUpRecord {
  _id: string;
  date: string;
  start_time: string;
  location_area: string;
  participants: TeamMemberDto[];
  records: FollowUpRecordDto[];
  details?: string; // Optional session summary/details
  session_summary?: string; // Alternative field name for session summary
  createdAt?: string;
  updatedAt?: string;
}

export interface FollowUpStats {
  total_records: number;
  total_sessions: number;
  total_participants: number;
  total_duration_minutes: number;
}

export interface FollowUpWorkerStats {
  total_sessions: number; // Total number of follow-up sessions.
  total_duration: number; // Total duration of all sessions (minutes).
  average_duration: number; // Average duration per session.
  this_week_count: number; // Number of sessions recorded this week.
}

// Record a new follow-up session
export async function createFollowUpRecord(body: CreateFollowUpDto): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: FollowUpRecord;
}> {
  console.log('body', JSON.stringify(body, null, 2));
  const { data } = await ApiCaller.post(QUERY_PATHS.FOLLOW_UP, body);
  return data;
}

// Get history for the logged-in worker
export async function getFollowUpWorkerHistory(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: FollowUpRecord[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.FOLLOW_UP_WORKER_HISTORY);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch follow-up history',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get all records (Admin usage)
export async function getAllFollowUpRecords(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: FollowUpRecord[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.FOLLOW_UP_ADMIN_ALL);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch follow-up records',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get aggregate stats (Admin usage)
export async function getFollowUpStats(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: FollowUpStats;
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.FOLLOW_UP_ADMIN_STATS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch follow-up stats',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get a specific record by ID
export async function getFollowUpRecordById(id: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: FollowUpRecord;
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.FOLLOW_UP_BY_ID.replace(':id', id));
    console.log('data', JSON.stringify(data, null, 2));
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch follow-up record',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Update a record
export async function updateFollowUpRecord(
  id: string,
  body: UpdateFollowUpDto
): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: FollowUpRecord;
}> {
  try {
    const { data } = await ApiCaller.patch(QUERY_PATHS.FOLLOW_UP_BY_ID.replace(':id', id), body);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update follow-up record',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Delete a record
export async function deleteFollowUpRecord(id: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    const { data } = await ApiCaller.delete(QUERY_PATHS.FOLLOW_UP_BY_ID.replace(':id', id));
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete follow-up record',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get worker stats
export async function getFollowUpWorkerStats(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: FollowUpWorkerStats;
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.FOLLOW_UP_WORKER_STATS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch follow-up worker stats',
      error: error.response?.data?.error || error.message,
    };
  }
}

import { QUERY_PATHS } from '~/utils/constants';
import { ApiCaller } from './init';

export interface TeamMemberDto {
  id: string;
  type: 'worker' | 'member';
  name: string;
}

export interface MemberTaughtDto {
  id: string;
  name: string;
}

export interface FollowUpRecordDto {
  members_taught: MemberTaughtDto[];
  topic: string;
  material: string;
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
  session_date: string;
  start_time: string;
  location_area: string;
  participants: TeamMemberDto[];
  records: FollowUpRecordDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FollowUpStats {
  total_records: number;
  total_sessions: number;
  total_participants: number;
  total_duration_minutes: number;
}

// Record a new follow-up session
export async function createFollowUpRecord(body: CreateFollowUpDto): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: FollowUpRecord;
}> {
  try {
    const { data } = await ApiCaller.post(QUERY_PATHS.FOLLOW_UP, body);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create follow-up record',
      error: error.response?.data?.error || error.message,
    };
  }
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

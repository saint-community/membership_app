import { QUERY_PATHS } from '~/utils/constants';
import { ApiCaller } from './init';

export interface TeamMemberDto {
  id: string;
  type: 'worker' | 'member';
  name: string;
}

export interface SoulDto {
  name: string;
  gender: 'Male' | 'Female';
  age: number;
  phone: string;
  address: string;
  status: 'saved' | 'filled' | 'healed' | 'other';
  impact_types: string[];
  note?: string;
  healed_condition_before?: string;
  healed_condition_after?: string;
}

export interface CreateEvangelismDto {
  date: string;
  start_time?: string;
  location_area: string;
  participants: TeamMemberDto[];
  saved_count: number;
  filled_count: number;
  healed_count: number;
  records: SoulDto[];
  details: string;
}

export interface UpdateEvangelismDto {
  date?: string;
  start_time?: string;
  location_area?: string;
  participants?: TeamMemberDto[];
  saved_count?: number;
  filled_count?: number;
  healed_count?: number;
  records?: SoulDto[];
  details?: string;
}

export interface EvangelismReport {
  _id: string;
  date: string;
  start_time: string;
  location_area: string;
  participants: TeamMemberDto[];
  saved_count: number;
  filled_count: number;
  healed_count: number;
  records: SoulDto[];
  details: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EvangelismStats {
  total_reports: number;
  total_saved: number;
  total_filled: number;
  total_healed: number;
  total_souls: number;
}

export interface EvangelismWorkerStats {
  total_saved: number; // Total individuals marked as saved.
  total_filled: number; // Total individuals marked as filled.
  total_healed: number; // Total individuals marked as healed.
  new_this_week: number; // Number of reports created in the current week (from Monday).
}

// Create a new evangelism report
export async function createEvangelismReport(body: CreateEvangelismDto): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: EvangelismReport;
}> {
  const { data } = await ApiCaller.post(QUERY_PATHS.EVANGELISM, body);
  return data;
}

// Get history for the logged-in worker
export async function getEvangelismWorkerHistory(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: EvangelismReport[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.EVANGELISM_WORKER_HISTORY);
    return data;
  } catch (error: any) {
    console.log('error ....', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch evangelism history',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get all reports (Admin usage)
export async function getAllEvangelismReports(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: EvangelismReport[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.EVANGELISM_ADMIN_ALL);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch evangelism reports',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get aggregate stats (Admin usage)
export async function getEvangelismStats(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: EvangelismStats;
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.EVANGELISM_ADMIN_STATS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch evangelism stats',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get a specific report by ID
export async function getEvangelismReportById(id: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: EvangelismReport;
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.EVANGELISM_BY_ID.replace(':id', id));
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch evangelism report',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Update a report
export async function updateEvangelismReport(
  id: string,
  body: UpdateEvangelismDto
): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: EvangelismReport;
}> {
  try {
    const { data } = await ApiCaller.patch(QUERY_PATHS.EVANGELISM_BY_ID.replace(':id', id), body);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update evangelism report',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Delete a report
export async function deleteEvangelismReport(id: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    const { data } = await ApiCaller.delete(QUERY_PATHS.EVANGELISM_BY_ID.replace(':id', id));
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete evangelism report',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get worker stats
export async function getEvangelismWorkerStats(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: EvangelismWorkerStats;
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.EVANGELISM_WORKER_STATS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch evangelism worker stats',
      error: error.response?.data?.error || error.message,
    };
  }
}

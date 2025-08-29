import { QUERY_PATHS } from '~/utils/constants';
import { ApiCaller } from './init';

export interface PastorMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  avatar?: string;
  fellowshipId?: string;
  fellowshipName?: string;
}

export interface PastorSubmission {
  id: string;
  memberId: string;
  memberName: string;
  assignmentId: string;
  assignmentTitle: string;
  content: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
}

export interface PastorSubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  thisWeek: number;
  lastWeek: number;
}

export interface PastorFellowship {
  id: string;
  name: string;
  description: string;
  location: string;
  meetingDay: string;
  meetingTime: string;
  leaderId: string;
  leaderName: string;
  isActive: boolean;
  memberCount: number;
}

export interface PastorFellowshipCell {
  id: string;
  name: string;
  description: string;
  location: string;
  meetingDay: string;
  meetingTime: string;
  leaderId: string;
  leaderName: string;
  isActive: boolean;
  memberCount: number;
  zoneId: string;
  zoneName: string;
}

// Get pastor members
export async function getPastorMembers(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: PastorMember[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.PASTOR_MEMBERS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch pastor members',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get current week submissions for pastor
export async function getPastorCurrentWeekSubmissions(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: PastorSubmission[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.PASTOR_SUBMISSIONS_CURRENT_WEEK);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch current week submissions',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get submission stats for pastor
export async function getPastorSubmissionStats(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: PastorSubmissionStats;
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.PASTOR_SUBMISSIONS_STATS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch submission stats',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get pastor fellowships
export async function getPastorFellowships(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: PastorFellowship[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.PASTOR_FELLOWSHIPS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch pastor fellowships',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get fellowship cells for pastor
export async function getPastorFellowshipCells(fellowshipId: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: PastorFellowshipCell[];
}> {
  try {
    const { data } = await ApiCaller.get(
      QUERY_PATHS.PASTOR_FELLOWSHIP_CELLS.replace(':fellowshipId', fellowshipId)
    );
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch fellowship cells',
      error: error.response?.data?.error || error.message,
    };
  }
}

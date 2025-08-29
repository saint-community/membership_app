import { QUERY_PATHS } from '~/utils/constants';
import { ApiCaller } from './init';

export interface FellowshipMember {
  id: string;
  fellowshipId: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  role: 'leader' | 'member';
  joinedAt: string;
  isActive: boolean;
}

export interface FellowshipSubmission {
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

export interface FellowshipSubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  thisWeek: number;
  lastWeek: number;
}

export interface FellowshipCell {
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

// Get fellowship members
export async function getFellowshipMembers(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: FellowshipMember[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.FELLOWSHIP_MEMBERS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch fellowship members',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get current week submissions for fellowship
export async function getFellowshipCurrentWeekSubmissions(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: FellowshipSubmission[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.FELLOWSHIP_SUBMISSIONS_CURRENT_WEEK);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch current week submissions',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get submission stats for fellowship
export async function getFellowshipSubmissionStats(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: FellowshipSubmissionStats;
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.FELLOWSHIP_SUBMISSIONS_STATS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch submission stats',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get fellowship cells
export async function getFellowshipCells(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: FellowshipCell[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.FELLOWSHIP_CELLS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch fellowship cells',
      error: error.response?.data?.error || error.message,
    };
  }
}

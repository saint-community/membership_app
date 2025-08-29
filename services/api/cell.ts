import { QUERY_PATHS } from '~/utils/constants';
import { ApiCaller } from './init';

export interface CellMember {
  id: string;
  cellId: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  role: 'leader' | 'member';
  joinedAt: string;
  isActive: boolean;
}

export interface CellSubmission {
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

export interface CellSubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  thisWeek: number;
  lastWeek: number;
}

// Get cell members
export async function getCellMembers(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: CellMember[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.CELL_MEMBERS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch cell members',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get current week submissions for cell
export async function getCellCurrentWeekSubmissions(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: CellSubmission[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.CELL_SUBMISSIONS_CURRENT_WEEK);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch current week submissions',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get submission stats for cell
export async function getCellSubmissionStats(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: CellSubmissionStats;
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.CELL_SUBMISSIONS_STATS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch submission stats',
      error: error.response?.data?.error || error.message,
    };
  }
}

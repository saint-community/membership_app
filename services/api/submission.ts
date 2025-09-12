import { QUERY_PATHS } from '~/utils/constants';
import { ApiCaller } from './init';

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  content: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  memberId: string;
  memberName: string;
}

export interface SubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  thisWeek: number;
  lastWeek: number;
}

export interface RecentAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  submissionCount: number;
}

export interface CreateSubmissionRequest {
  assignmentId: string;
  content: string;
}

export interface UpdateSubmissionRequest {
  content: string;
}

// Get all submissions
export async function getSubmissions() {
  const { data } = await ApiCaller.get(QUERY_PATHS.SUBMISSIONS);
  return data;
}

// Get submission by ID
export async function getSubmissionById(submissionId: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: Submission;
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.SUBMISSION.replace(':id', submissionId));
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch submission',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get current week submissions
export async function getCurrentWeekSubmissions(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: Submission[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.SUBMISSION_CURRENT_WEEK);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch current week submissions',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get submission stats
export async function getSubmissionStats(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: SubmissionStats;
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.SUBMISSION_STATS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch submission stats',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get recent assignments
export async function getRecentAssignments(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: RecentAssignment[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.SUBMISSION_RECENT_ASSIGNMENTS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch recent assignments',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Create submission
export async function createSubmission(body: CreateSubmissionRequest): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: Submission;
}> {
  try {
    const { data } = await ApiCaller.post(QUERY_PATHS.SUBMISSIONS, body);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create submission',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Update submission
export async function updateSubmission(
  submissionId: string,
  body: UpdateSubmissionRequest
): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: Submission;
}> {
  try {
    const { data } = await ApiCaller.put(QUERY_PATHS.SUBMISSION.replace(':id', submissionId), body);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update submission',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Delete submission
export async function deleteSubmission(submissionId: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    const { data } = await ApiCaller.delete(QUERY_PATHS.SUBMISSION.replace(':id', submissionId));
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete submission',
      error: error.response?.data?.error || error.message,
    };
  }
}

import { QUERY_PATHS } from '~/utils/constants';
import { ApiCaller } from './init';

export interface StudyGroup {
  id: string;
  title: string;
  description: string;
  week: number;
  year: number;
  isActive: boolean;
  assignments: StudyGroupAssignment[];
}

export interface StudyGroupAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isActive: boolean;
  trackId: string;
  trackName: string;
}

export interface StudyGroupSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  content: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
}

export interface StudyGroupTrack {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface CreateStudyGroupRequest {
  title: string;
  description: string;
  week: number;
  year: number;
  isActive?: boolean;
  assignments?: StudyGroupAssignment[];
}

export interface UpdateStudyGroupRequest {
  title?: string;
  description?: string;
  week?: number;
  year?: number;
  isActive?: boolean;
  assignments?: StudyGroupAssignment[];
}

export interface UpdateSubmissionRequest {
  content: string;
}

// Get all study groups
export async function getStudyGroups(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: StudyGroup[];
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.STUDY_GROUPS);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch study groups',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get study group by ID
export async function getStudyGroupById(studyGroupId: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: StudyGroup;
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.STUDY_GROUP.replace(':id', studyGroupId));
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch study group',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Create study group
export async function createStudyGroup(body: CreateStudyGroupRequest): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: StudyGroup;
}> {
  try {
    const { data } = await ApiCaller.post(QUERY_PATHS.STUDY_GROUPS, body);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create study group',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Update study group
export async function updateStudyGroup(
  studyGroupId: string,
  body: UpdateStudyGroupRequest
): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: StudyGroup;
}> {
  try {
    const { data } = await ApiCaller.patch(
      QUERY_PATHS.STUDY_GROUP.replace(':id', studyGroupId),
      body
    );
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update study group',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Delete study group
export async function deleteStudyGroup(studyGroupId: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    const { data } = await ApiCaller.delete(QUERY_PATHS.STUDY_GROUP.replace(':id', studyGroupId));
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete study group',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get current week study group
export async function getCurrentWeekStudyGroup(church_id?: number) {
  const { data } = await ApiCaller.get(QUERY_PATHS.STUDY_GROUP_CURRENT_WEEK, {
    params: {
      church_id,
    },
  });
  return data;
}

// Get study groups by year
export async function getStudyGroupsByYear(year: number): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: StudyGroup[];
}> {
  try {
    const { data } = await ApiCaller.get(
      QUERY_PATHS.STUDY_GROUP_YEAR.replace(':year', year.toString())
    );
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch study groups by year',
      error: error.response?.data?.error || error.message,
    };
  }
}

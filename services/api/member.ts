import { QUERY_PATHS } from '~/utils/constants';
import { ApiCaller } from './init';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  fellowshipId?: string;
  fellowshipName?: string;
  cellId?: string;
  cellName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberRequest {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  date_of_birth: string;
  church_id?: number;
  date_joined_church?: string;
  fellowship_id?: number;
  cell_id?: number;
}

export interface CreateMemberResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: Member;
}

export interface AddedMember {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  worker_id: number;
  address: string;
  date_of_birth: string;
  church_id: number;
  date_joined_church: string;
  fellowship_id: number;
  cell_id: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface UpdateMemberRequest {
  name?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  fellowshipId?: string;
  cellId?: string;
}

// Get all members
export async function getAllMembers(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: Member[];
}> {
  // try {
  const { data } = await ApiCaller.get(QUERY_PATHS.THIS_MEMBER);
  return data;
  // } catch (error: any) {
  //   console.log(JSON.stringify(error, null, 2));
  //   return {
  //     success: false,
  //     message: error.response?.data?.message || 'Failed to fetch members',
  //     error: error.response?.data?.error || error.message,
  //   };
  // }
}

// Get current member (logged in user)
export async function getThisMember(): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: Member;
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.THIS_MEMBER);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch member profile',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Get member by ID
export async function getMemberById(memberId: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: AddedMember;
}> {
  try {
    const { data } = await ApiCaller.get(QUERY_PATHS.MEMBER.replace(':id', memberId));
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch member',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Add new member
export async function addMember(body: CreateMemberRequest): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: Member;
}> {
  try {
    console.log('Adding member with data:', body); // Debug log

    const { data } = await ApiCaller.post(QUERY_PATHS.ADD_MEMBER, body);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add member',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Update member
export async function updateMember(
  memberId: string,
  body: UpdateMemberRequest
): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: Member;
}> {
  try {
    const { data } = await ApiCaller.patch(QUERY_PATHS.MEMBER.replace(':id', memberId), body);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update member',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Delete member
export async function deleteMember(memberId: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    const { data } = await ApiCaller.delete(QUERY_PATHS.MEMBER.replace(':id', memberId));
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete member',
      error: error.response?.data?.error || error.message,
    };
  }
}

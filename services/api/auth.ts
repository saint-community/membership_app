import { QUERY_PATHS, STORAGE_KEYS } from '~/utils/constants';
import {
  clearStorage,
  getObjectData,
  getStringData,
  storeObjectData,
  storeStringData,
} from '~/utils';

import { AdminApiCaller, ApiCaller } from './init';

export interface LoginResponse {
  error: string;
  message: string;
}

export async function loginUser(body: { email: string; password: string }): Promise<LoginResponse> {
  const { data } = await AdminApiCaller.post(QUERY_PATHS.LOGIN, body);

  console.log('data', data);

  if (data.access_token) {
    storeStringData(STORAGE_KEYS.TOKEN, data.access_token);
    storeObjectData(STORAGE_KEYS.USER, data.worker);
  }

  return data;
}

export async function resetPassword(body: { email: string }): Promise<{
  error: string;
  message: string;
}> {
  const { data } = await AdminApiCaller.post(QUERY_PATHS.RESET_PASSWORD, body);
  return data;
}

export async function requestOtp(body: { email: string }): Promise<{
  error: string;
  message: string;
}> {
  const { data } = await AdminApiCaller.post(QUERY_PATHS.OTP_REQUEST, body);
  return data;
}

export async function verifyOtp(body: { email: string; otp: string }): Promise<{
  error: string;
  message: string;
}> {
  const { data } = await AdminApiCaller.post(QUERY_PATHS.OTP_VERIFY, body);
  return data;
}

export async function logoutUser(): Promise<void> {
  clearStorage();
}

export async function getMe() {
  const token = getStringData(STORAGE_KEYS.TOKEN);
  const user = getObjectData(STORAGE_KEYS.USER);

  // If no token, return null (user is not authenticated)
  if (!token) {
    return null;
  }

  // If no user data but token exists, return null
  // (this will trigger re-authentication or token refresh if needed)
  if (!user) {
    return null;
  }

  return user as User;
}

// Upload profile image
export async function uploadProfileImage(imageUri: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
  imageUrl?: string;
}> {
  try {
    const formData = new FormData();
    
    // Create file object for upload
    const fileExtension = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;
    
    formData.append('profile_image', {
      uri: imageUri,
      type: mimeType,
      name: `profile_image.${fileExtension}`,
    } as any);

    const { data } = await AdminApiCaller.post(QUERY_PATHS.UPLOAD_PROFILE_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload profile image response:', data);
    return data;
  } catch (error: any) {
    console.error('Upload profile image error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to upload image',
      error: error.response?.data?.error || error.message,
    };
  }
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  house_address?: string;
  work_address?: string;
  facebook_username?: string;
  twitter_username?: string;
  instagram_username?: string;
  profile_image_url?: string;
}

// Update profile 
export async function updateProfile(body: UpdateProfileRequest | FormData, id: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
  data?: User;
}> {
  try {
    console.log('Updating profile with data:', body, body instanceof FormData ? 'as FormData' : 'as JSON');
    
    const { data } = await AdminApiCaller.put(QUERY_PATHS.UPDATE_PROFILE.replace(':id', id), body, {
      headers: body instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
    });
    
    console.log('update profile data', data);
    
    // Update local storage with new user data if successful
    if (data.worker) {
      storeObjectData(STORAGE_KEYS.USER, data.worker);
    }
    
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update profile',
      error: error.response?.data?.error || error.message,
    };
  }
}


interface User {
  id: number;
  church_id: number;
  fellowship_id: number;
  cell_id: number;
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  phone_number: string;
  email: string;
  facebook_username: string;
  twitter_username: string;
  instagram_username: string;
  house_address: string;
  work_address: string;
  member_since: string;
  worker_since: string;
  prayer_group_id: number;
  department_id: number;
  status: string;
  slug: string;
  approved: string;
  active: string;
  profile_image: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  profile_image_url: string | null;
  church_name: string;
  fellowship_name: string;
  cell_name: string;
}

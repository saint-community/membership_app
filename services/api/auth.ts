import { QUERY_PATHS, STORAGE_KEYS } from '~/utils/constants';
import { clearStorage, getObjectData, storeObjectData, storeStringData } from '~/utils';

import { AdminApiCaller } from './init';

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
  const user = getObjectData(STORAGE_KEYS.USER);

  if (!user) {
    return null;
  }

  return user as User;
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

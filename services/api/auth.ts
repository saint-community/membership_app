import { QUERY_PATHS, STORAGE_KEYS } from '~/utils/constants';
import { clearStorage, getObjectData, storeObjectData, storeStringData } from '~/utils';

import { ApiCaller } from './init';

export interface LoginResponse {
  error: string;
  message: string;
}

export async function loginUser(body: { email: string; password: string }): Promise<LoginResponse> {
  const { data } = await ApiCaller.post(QUERY_PATHS.LOGIN, body);

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
  const { data } = await ApiCaller.post(QUERY_PATHS.RESET_PASSWORD, body);
  return data;
}

export async function requestOtp(body: { email: string }): Promise<{
  error: string;
  message: string;
}> {
  const { data } = await ApiCaller.post(QUERY_PATHS.OTP_REQUEST, body);
  return data;
}

export async function verifyOtp(body: { email: string; otp: string }): Promise<{
  error: string;
  message: string;
}> {
  const { data } = await ApiCaller.post(QUERY_PATHS.OTP_VERIFY, body);
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

  return user;
}

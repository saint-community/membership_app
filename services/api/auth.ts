import { QUERY_PATHS, STORAGE_KEYS } from '~/utils/constants';
import { storeObjectData, storeStringData } from '~/utils';

import { ApiCaller } from './init';

export interface LoginResponse {
  error: string;
  message: string;
}

export async function loginUser(body: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const { data } = await ApiCaller.post(QUERY_PATHS.LOGIN, body);

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
  storeStringData(STORAGE_KEYS.IS_AUTHENTICATED, 'false');
  storeStringData(STORAGE_KEYS.TOKEN, '');
  storeObjectData(STORAGE_KEYS.USER, {});
}
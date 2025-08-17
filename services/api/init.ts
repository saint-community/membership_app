import { STORAGE_KEYS } from '~/utils/constants';
import axios from 'axios';
import { getStringData } from '~/utils';

const API_URL =
  process.env.API_URL || 'https://staging.lwmportal.com';

export const ApiCaller = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${storage.getString(StorageKeys.TOKEN)}`,
    'x-api-key': '2e4c9b93f5d18e72a1b0c6d4f8e7a9b1c3d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9'
  },
});

ApiCaller.interceptors.request.use(async (config) => {
  const token =  await getStringData(STORAGE_KEYS.TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  }

  return config;
});

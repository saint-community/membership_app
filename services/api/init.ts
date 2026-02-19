import { STORAGE_KEYS } from '~/utils/constants';
import axios from 'axios';
import { clearStorage, getStringData } from '~/utils';
import { router } from 'expo-router';

const ADMIN_API_URL =
  process.env.EXPO_PUBLIC_ADMIN_API_URL || 'https://admin-service.saintscommunityportal.com/';
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://analytics-service.saintscommunityportal.com/';
const X_API_KEY= process.env.EXPO_PUBLIC_X_API_KEY || '113c53c9e26574039e24ce0cc63a6f7b3be020e5'

export const AdminApiCaller = axios.create({
  baseURL: ADMIN_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': X_API_KEY,
  },
});

AdminApiCaller.interceptors.request.use((config) => {
  const token = getStringData(STORAGE_KEYS.TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  }

  return config;
});

export const ApiCaller = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': X_API_KEY,
  },
});

ApiCaller.interceptors.request.use((config) => {
  const token = getStringData(STORAGE_KEYS.TOKEN);
  console.log('token', token);

  if (token) {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  }

  return config;
});

// Add response interceptor to handle token expiration
ApiCaller.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, could clear storage and redirect to login
      console.log('API authentication failed - token may be expired');
      logOutAction();
    }
    return Promise.reject(error);
  }
);

const logOutAction = () => {
  clearStorage();
  router.replace('/(login)/login');
};

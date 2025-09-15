import { STORAGE_KEYS } from '~/utils/constants';
import axios from 'axios';
import { getStringData } from '~/utils';

const ADMIN_API_URL = process.env.ADMIN_API_URL || 'https://staging.lwmportal.com';
const API_URL = process.env.API_URL || 'https://memberapi.lwmportal.com/';

export const AdminApiCaller = axios.create({
  baseURL: ADMIN_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '2e4c9b93f5d18e72a1b0c6d4f8e7a9b1c3d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
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
    'x-api-key': '2e4c9b93f5d18e72a1b0c6d4f8e7a9b1c3d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
  },
});

ApiCaller.interceptors.request.use((config) => {
  const token = getStringData(STORAGE_KEYS.TOKEN);

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
    }
    return Promise.reject(error);
  }
);

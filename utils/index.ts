import { MMKV } from 'react-native-mmkv';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

export const storage = new MMKV({
  id: 'membership-app',
});

export const storeStringData = (key: string, value: string) => {
  try {
    storage.set(key, value);
  } catch (e) {
    // saving error
    console.log('error:', e);
  }
};

export const getStringData = (key: string) => {
  try {
    const value = storage.getString(key);
    return value ?? null;
  } catch (e) {
    // error reading value
    console.log('error:', e);
  }
};

export const storeObjectData = (key: string, value: Record<string, string>) => {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (e) {
    // saving error
    console.log('error:', e);
  }
};

export const getObjectData = (key: string) => {
  try {
    const value = storage.getString(key);
    if (value) {
      // value previously stored
      return JSON.parse(value);
    }
  } catch (e) {
    // error reading value
    console.log('error:', e);
  }
};

export const clearStorage = () => {
  storage.clearAll();
};

const storageFactory = {
  getItem: (key: string) => {
    return storage.getString(key);
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
  entries: (): [string, string][] => {
    return storage.getAllKeys().map((key) => [key, storage.getString(key) ?? '']);
  },
};

export const persister = createAsyncStoragePersister({
  storage: storageFactory,
});

export const parseTime = (timeStr: string) => {
  if (!timeStr) return { hour: 12, minute: 0, period: 'AM' as const };

  // Try 24-hour format first (HH:MM)
  const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    let hour24 = parseInt(match24[1]);
    const minute = parseInt(match24[2]);
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    return { hour: hour12, minute, period };
  }

  // Try 12-hour format (HH:MM AM/PM)
  const match12 = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    const hour = parseInt(match12[1]);
    const minute = parseInt(match12[2]);
    const period = match12[3].toUpperCase() as 'AM' | 'PM';
    return { hour, minute, period };
  }

  return { hour: 12, minute: 0, period: 'AM' as const };
};

export const formatTimeDisplay = (value: string) => {
  const parsed = parseTime(value);
  const minuteStr = parsed.minute.toString().padStart(2, '0');
  return `${parsed.hour}:${minuteStr} ${parsed.period}`;
};

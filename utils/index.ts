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

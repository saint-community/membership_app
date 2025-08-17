import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeStringData = async (value: string, key: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
      console.log('error:', e)
    }
  };


 export const getStringData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // value previously stored
        return value
      }
    } catch (e) {
      // error reading value
      console.log('error:', e)
    }
  };

export const storeObjectData = async (key: string, value: Record<string, string> ) => {
  try {
     await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
      // saving error
      console.log('error:', e)
    }
}

 export const getObjectData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // value previously stored
        return JSON.parse(value)
      }
    } catch (e) {
      // error reading value
      console.log('error:', e)
    }
  };
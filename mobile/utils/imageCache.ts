import AsyncStorage from '@react-native-async-storage/async-storage';

interface CachedImage {
  uri: string;
  timestamp: number;
  size: number;
}

const CACHE_PREFIX = 'image_cache_';
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export const cacheImage = async (key: string, uri: string, size: number = 0): Promise<void> => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cachedImage: CachedImage = {
      uri,
      timestamp: Date.now(),
      size,
    };

    await AsyncStorage.setItem(cacheKey, JSON.stringify(cachedImage));
    
    // Clean up old cache entries
    await cleanupCache();
  } catch (error) {
    console.error('Failed to cache image:', error);
  }
};

export const getCachedImage = async (key: string): Promise<string | null> => {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cached = await AsyncStorage.getItem(cacheKey);
    
    if (!cached) return null;

    const cachedImage: CachedImage = JSON.parse(cached);
    const isExpired = Date.now() - cachedImage.timestamp > CACHE_EXPIRY;

    if (isExpired) {
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }

    return cachedImage.uri;
  } catch (error) {
    console.error('Failed to get cached image:', error);
    return null;
  }
};

export const clearImageCache = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.error('Failed to clear image cache:', error);
  }
};

const cleanupCache = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    let totalSize = 0;
    const cacheEntries: Array<{ key: string; size: number; timestamp: number }> = [];

    for (const key of cacheKeys) {
      const cached = await AsyncStorage.getItem(key);
      if (cached) {
        const cachedImage: CachedImage = JSON.parse(cached);
        const isExpired = Date.now() - cachedImage.timestamp > CACHE_EXPIRY;
        
        if (!isExpired) {
          totalSize += cachedImage.size;
          cacheEntries.push({
            key: key as string,
            size: cachedImage.size,
            timestamp: cachedImage.timestamp,
          });
        } else {
          await AsyncStorage.removeItem(key);
        }
      }
    }

    // Remove oldest entries if cache is too large
    if (totalSize > MAX_CACHE_SIZE) {
      cacheEntries.sort((a, b) => a.timestamp - b.timestamp);
      
      for (const entry of cacheEntries) {
        await AsyncStorage.removeItem(entry.key);
        totalSize -= entry.size;
        
        if (totalSize <= MAX_CACHE_SIZE * 0.8) {
          break;
        }
      }
    }
  } catch (error) {
    console.error('Failed to cleanup cache:', error);
  }
}; 
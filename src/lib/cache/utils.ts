import { redis } from "@/lib/cache/radis";

export const cache = {
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const data = await redis.get<T>(key);
      return data ?? null;
    } catch (error) {
      console.error(`[Cache] Error getting key "${key}":`, error);
      return null;
    }
  },

  set: async <T>(key: string, value: T, ttl?: number): Promise<void> => {
    try {
      if (ttl) {
        await redis.set(key, value, { ex: ttl });
      } else {
        await redis.set(key, value);
      }
    } catch (error) {
      console.error(`[Cache] Error setting key "${key}":`, error);
    }
  },

  delete: async (key: string): Promise<void> => {
    try {
      await redis.del(key);
    } catch (error) {
      console.error(`[Cache] Error deleting key "${key}":`, error);
    }
  },

  wrap: async <T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> => {
    const cached = await cache.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const freshData = await factory();
    await cache.set(key, freshData, ttl);
    return freshData;
  },

  deleteByPattern: async (pattern: string): Promise<void> => {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error(`[Cache] Error deleting pattern "${pattern}":`, error);
    }
  },
};

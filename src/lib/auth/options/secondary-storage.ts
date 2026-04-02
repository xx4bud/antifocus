import type { BetterAuthOptions } from "better-auth";
import { cache } from "@/lib/cache";

export const secondaryStorage = {
  get: async (key) => {
    return await cache.get(key);
  },
  set: async (key, value, ttl) => {
    if (ttl === undefined) {
      await cache.set(key, value);
    } else {
      await cache.set(key, value, ttl);
    }
  },
  delete: async (key) => {
    await cache.delete(key);
  },
} satisfies BetterAuthOptions["secondaryStorage"];

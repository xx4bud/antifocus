import { Redis } from "@upstash/redis";
import { env } from "@/env";

let _redis: Redis | null = null;

export const getRedis = (): Redis => {
  if (!_redis) {
    _redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return _redis;
};

export const redis = new Proxy({} as Redis, {
  get: (_, prop) => getRedis()[prop as keyof Redis],
});

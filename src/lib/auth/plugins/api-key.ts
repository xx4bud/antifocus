import { apiKey } from "@better-auth/api-key";
import { APP_SHORT_NAME } from "@/lib/utils/constants";

export const apiKeyPlugin = apiKey({
  defaultPrefix: `${APP_SHORT_NAME}_`, // antifocus
  enableMetadata: true,
  enableSessionForAPIKeys: true, // Allows using API keys directly as session tokens
  keyExpiration: {
    defaultExpiresIn: 60 * 60 * 24 * 30, // 30 days default expiration
  },
  rateLimit: {
    enabled: true,
    maxRequests: 100,
    timeWindow: 60, // 100 requests per 60 seconds
  },
});

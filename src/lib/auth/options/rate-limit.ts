import type { BetterAuthOptions } from "better-auth";
import { isDevelopment } from "@/lib/utils";

export const rateLimit = {
  window: 60, // 1 minute
  max: isDevelopment ? 1000 : 5, // requests per minute
  storage: "secondary-storage",
  customRules: {
    "/api/auth/sign-in": {
      window: 60,
      max: isDevelopment ? 1000 : 5,
    },
    "/api/auth/sign-up": {
      window: 60,
      max: isDevelopment ? 1000 : 3,
    },
    "/api/auth/forgot-password": {
      window: 60,
      max: isDevelopment ? 1000 : 3,
    },
    "/api/auth/reset-password": {
      window: 60,
      max: isDevelopment ? 1000 : 3,
    },
  },
} satisfies BetterAuthOptions["rateLimit"];

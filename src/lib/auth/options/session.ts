import type { BetterAuthOptions } from "better-auth";

export const session = {
  expiresIn: 60 * 60 * 24 * 7, // 1 week
  updateAge: 60 * 60 * 24, // 1 day
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60, // 5 minutes
    strategy: "jwe",
  },
  freshAge: 60 * 15, // 15 minutes
  storeSessionInDatabase: true,

  additionalFields: {
    metadata: {
      type: "json",
      required: false,
    },
  },
} satisfies BetterAuthOptions["session"];

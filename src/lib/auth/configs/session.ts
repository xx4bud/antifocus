import type { BetterAuthOptions } from "better-auth";

export const session = {
  expiresIn: 60 * 60 * 24 * 7,
  updateAge: 60 * 60 * 24,
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60,
  },
  freshAge: 60 * 15,

  additionalFields: {
    // fields
    metadata: {
      type: "json",
      required: false,
    },
  },
} satisfies BetterAuthOptions["session"];

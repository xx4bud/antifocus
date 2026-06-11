import type { BetterAuthOptions } from "better-auth";

export const verification = {
  additionalFields: {
    metadata: {
      type: "json",
      required: false,
    },
  },
} as const satisfies BetterAuthOptions["verification"];

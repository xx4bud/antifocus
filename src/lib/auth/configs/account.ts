import type { BetterAuthOptions } from "better-auth";

export const account = {
  accountLinking: {
    enabled: true,
    trustedProviders: ["google"],
  },

  additionalFields: {
    metadata: {
      type: "json",
      required: false,
    },
  },
} satisfies BetterAuthOptions["account"];

import type { BetterAuthOptions } from "better-auth";

export const account: BetterAuthOptions["account"] = {
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
};

import type { BetterAuthOptions } from "better-auth";

export const account = {
  accountLinking: {
    enabled: true,
    trustedProviders: ["google"],
  },
} satisfies BetterAuthOptions["account"];

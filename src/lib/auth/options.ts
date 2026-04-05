import type { BetterAuthOptions } from "better-auth";

export const authOptions = {
  emailAndPassword: {
    enabled: true,
  },
} satisfies BetterAuthOptions;

import type { BetterAuthOptions } from "better-auth";

export const user = {
  changeEmail: {
    enabled: true,
  },
} satisfies BetterAuthOptions["user"];

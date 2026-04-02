import type { BetterAuthOptions } from "better-auth";
import { generateUsernameFromEmail } from "@/features/auth/utils/username";

export const databaseHooks = {
  user: {
    create: {
      before: async (user) => {
        if (!user.username && user.email) {
          user.username = generateUsernameFromEmail(user.email);
        }
        if (!user.displayUsername && user.username) {
          user.displayUsername = user.username;
        }
        return { data: user };
      },
    },
  },
} satisfies BetterAuthOptions["databaseHooks"];

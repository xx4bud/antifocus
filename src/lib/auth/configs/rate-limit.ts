import type { BetterAuthOptions } from "better-auth";
import { isDevelopment } from "~/utils/env";

export const rateLimit = {
  window: 60,
  max: isDevelopment ? 1000 : 100,
  storage: "memory",
} satisfies BetterAuthOptions["rateLimit"];

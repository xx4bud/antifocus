import type { BetterAuthPlugin } from "better-auth";
import { multiSession, oAuthProxy } from "better-auth/plugins";

export const authPlugins = [
  // utils
  multiSession(),
  oAuthProxy(),
] satisfies BetterAuthPlugin[];

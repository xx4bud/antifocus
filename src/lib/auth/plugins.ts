import type { BetterAuthPlugin } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";

export const authPlugins = [
  // auth
  username(),
  nextCookies(),
] satisfies BetterAuthPlugin[];

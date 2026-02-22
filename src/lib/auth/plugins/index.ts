import type { BetterAuthPlugin } from "better-auth";
import { multiSession, oAuthProxy } from "better-auth/plugins";
import { adminPlugin } from "~/lib/auth/plugins/admin";
import { phoneNumberPlugin } from "./phone-number";
import { usernamePlugin } from "./username";

export const authPlugins = [
  // authentication
  usernamePlugin(),
  phoneNumberPlugin(),

  // authorization
  adminPlugin(),

  // utils
  multiSession(),
  oAuthProxy(),
] satisfies BetterAuthPlugin[];

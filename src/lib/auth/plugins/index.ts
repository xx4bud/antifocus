import { expo } from "@better-auth/expo";
import type { BetterAuthPlugin } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { multiSession } from "better-auth/plugins";
import { adminPlugin } from "./admin";
import { apiKeyPlugin } from "./api-key";
import { organizationPlugin } from "./organization";
import { phoneNumberPlugin } from "./phone-number";
import { twoFactorPlugin } from "./two-factor";
import { usernamePlugin } from "./username";

export const authPlugins = [
  // authentication
  usernamePlugin(),
  phoneNumberPlugin(),
  twoFactorPlugin(),

  // authorization
  adminPlugin(),
  organizationPlugin(),
  apiKeyPlugin(),

  // utils
  expo(),
  nextCookies(),
  multiSession(),
] satisfies BetterAuthPlugin[];

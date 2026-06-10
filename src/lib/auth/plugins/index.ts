import type { BetterAuthPlugin } from "better-auth";
import { adminPlugin } from "./admin";
import { apiKeyPlugin } from "./api-key";
import { emailOTPPlugin } from "./email-otp";
import { organizationPlugin } from "./organization";
import { phoneNumberPlugin } from "./phone-number";
import { twoFactorPlugin } from "./two-factor";
import { usernamePlugin } from "./username";

export const authPlugins = [
  // authentication
  twoFactorPlugin,
  emailOTPPlugin,
  usernamePlugin,
  phoneNumberPlugin,

  // authorization
  apiKeyPlugin,
  adminPlugin,
  organizationPlugin,
] as const satisfies BetterAuthPlugin[];

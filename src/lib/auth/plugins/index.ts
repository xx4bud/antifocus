import { expo } from "@better-auth/expo";
import type { BetterAuthPlugin } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { multiSession, oAuthProxy } from "better-auth/plugins";
import { adminPlugin } from "~/lib/auth/plugins/admin";
import { apiKeyPlugin } from "~/lib/auth/plugins/api-key";
import { captchaPlugin } from "~/lib/auth/plugins/captcha";
import { emailOTPPlugin } from "~/lib/auth/plugins/email-otp";
import { organizationPlugin } from "~/lib/auth/plugins/organization";
import { twoFactorPlugin } from "~/lib/auth/plugins/two-factor";
import { phoneNumberPlugin } from "./phone-number";
import { usernamePlugin } from "./username";

export const authPlugins = [
  // authentication
  usernamePlugin(),
  phoneNumberPlugin(),

  // authorization
  adminPlugin(),
  organizationPlugin(),

  // utils
  multiSession(),
  oAuthProxy(),
  nextCookies(),

  // coming soon
  expo(),
  captchaPlugin(),
  twoFactorPlugin(),
  emailOTPPlugin(),
  apiKeyPlugin(),
] satisfies BetterAuthPlugin[];

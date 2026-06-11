import type { BetterAuthOptions } from "better-auth";
import { account } from "./account";
import { emailAndPassword } from "./email-and-password";
import { emailVerification } from "./email-verification";
import { hooks } from "./hooks";
import { session } from "./session";
import { user } from "./user";
import { verification } from "./verification";

export const authOptions = {
  emailAndPassword,
  emailVerification,
  user,
  session,
  account,
  verification,
  hooks,
} as const satisfies BetterAuthOptions;

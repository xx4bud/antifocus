import type { BetterAuthOptions } from "better-auth";
import { authPlugins } from "../plugins";
import { account } from "./account";
import { databaseHooks } from "./database-hooks";
import { emailAndPassword } from "./email-password";
import { emailVerification } from "./email-verification";
import { rateLimit } from "./rate-limit";
import { secondaryStorage } from "./secondary-storage";
import { session } from "./session";
import { user } from "./user";
import { verification } from "./verification";

export const authOptions = {
  plugins: [...authPlugins],

  account,
  emailAndPassword,
  session,
  user,
  verification,
  emailVerification,
  rateLimit,
  secondaryStorage,
  databaseHooks,
} satisfies BetterAuthOptions;

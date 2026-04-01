import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { phoneNumber, username } from "better-auth/plugins";
import { env } from "@/env";
import { generateUsernameFromEmail } from "@/features/auth/utils/username";
import { db, schema } from "@/lib/db";
import { baseURL, isProduction } from "@/lib/utils";
import { generateId } from "@/lib/utils/ids";
import { sendVerificationEmail } from "../notifications/email/send-verification-email";

interface InitAuthProps {
  baseURL: string;
  googleClientId?: string;
  googleClientSecret?: string;
  productionURL: string;
  secret: string;
}

export function initAuth(opts: InitAuthProps) {
  return betterAuth({
    appName: "antifocus",
    baseURL: opts.baseURL,
    secret: opts.secret,

    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
      usePlural: true,
    }),

    experimental: {
      joins: true,
    },

    plugins: [username(), phoneNumber()],

    emailAndPassword: {
      enabled: true,
    },

    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendVerificationEmail({
          email: user.email,
          url,
        });
      },
    },

    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            if (!user.username && user.email) {
              user.username = generateUsernameFromEmail(user.email);
            }
            return { data: user };
          },
        },
      },
    },

    advanced: {
      database: {
        generateId: () => generateId(),
      },
    },

    logger: {
      disabled: isProduction,
      level: "debug",
    },
  });
}

export const auth = initAuth({
  baseURL,
  productionURL: baseURL,
  secret: env.BETTER_AUTH_SECRET,
});

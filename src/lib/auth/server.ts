import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { phoneNumber, username } from "better-auth/plugins";
import { env } from "@/env";
import { generateUsernameFromEmail } from "@/features/auth/utils/username";
import { cache } from "@/lib/cache/utils";
import { db, schema } from "@/lib/db";
import { baseURL, isProduction } from "@/lib/utils";
import { generateId } from "@/lib/utils/ids";
import { sendVerificationEmail } from "../notifications/email/send-verification-email";

interface InitAuthProps {
  baseURL: string;
  googleClientId: string;
  googleClientSecret: string;
  productionURL: string;
  secret: string;
}

export function initAuth(opts: InitAuthProps) {
  return betterAuth({
    appName: "Antifocus",
    baseURL: opts.baseURL,
    secret: opts.secret,

    database: drizzleAdapter(db, {
      provider: "pg",
      schema,
      usePlural: true,
    }),

    socialProviders: {
      google: {
        clientId: opts.googleClientId,
        clientSecret: opts.googleClientSecret,
        scope: ["openid", "email", "profile"],
        accessType: "offline",
      },
    },

    secondaryStorage: {
      get: (key) => cache.get<string>(key),
      set: (key, value, ttl) => cache.set(key, value, ttl),
      delete: (key) => cache.delete(key),
    },

    rateLimit: {
      enabled: isProduction,
      window: 60, // 60 seconds
      max: 10, // 10 requests per window
      storage: "secondary-storage",
    },
    experimental: {
      joins: true,
    },

    plugins: [username(), phoneNumber(), nextCookies()],

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true, // enforce email verification before sign-in

      // custom password reset handler
      sendResetPassword: async ({ user, url }) => {
        const { resetPasswordEmail } = await import(
          "../notifications/email/send-reset-password"
        );
        await resetPasswordEmail.sendResetPassword({
          email: user.email,
          url,
        });
      },
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

    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5 minutes cache for sessions
      },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            // Ensure unique username exists
            if (!user.username && user.email) {
              user.username = generateUsernameFromEmail(user.email);
            }

            // Sync displayUsername with username if not provided
            if (!user.displayUsername && user.username) {
              user.displayUsername = user.username;
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
      // secure cookies in production
      useSecureCookies: isProduction,
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
  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,
});

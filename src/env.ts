import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod/v4";

export const env = createEnv({
  extends: [vercel()],

  shared: {
    // Runtime
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },

  server: {
    // Database (Neon PostgreSQL)
    DATABASE_URL: z.string().min(1),

    // Auth (Better Auth)
    BETTER_AUTH_SECRET: z.string().min(1),

    // OAuth (Google)
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    // Redis (Upstash)
    UPSTASH_REDIS_REST_URL: z.string().url().min(1),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

    // Inngest
    INNGEST_EVENT_KEY: z.string().min(1),
    INNGEST_SIGNING_KEY: z.string().min(1),

    // Uploadthing
    UPLOADTHING_TOKEN: z.string().min(1),

    // Resend
    RESEND_API_KEY: z.string().min(1),
  },

  client: {
    // App URL
    NEXT_PUBLIC_BASE_URL: z.string().min(1),
  },

  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },

  isServer: typeof window === "undefined",
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});

export const isClient = typeof window !== "undefined";
export const isServer = !isClient;

export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";

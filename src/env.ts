import { createEnv } from "@t3-oss/env-core";
import { vercel } from "@t3-oss/env-core/presets-zod";
import { z } from "zod";

export function appEnv() {
  return createEnv({
    extends: [vercel()],

    shared: {
      NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    },

    clientPrefix: "NEXT_PUBLIC_",

    client: {
      NEXT_PUBLIC_BASE_URL: z.string().min(1),
    },

    server: {
      // bundle analyzer
      ANALYZE: z
        .enum(["true", "false"])
        .optional()
        .transform((analyze) => analyze === "true"),

      // database
      DATABASE_URL: z.string().min(1),

      // auth
      BETTER_AUTH_SECRET: z.string().min(1),
      BETTER_AUTH_URL: z.string().min(1),

      // google
      GOOGLE_CLIENT_ID: z.string().min(1),
      GOOGLE_CLIENT_SECRET: z.string().min(1),

      // smtp
      SMTP_USER: z.string().min(1),
      SMTP_REFRESH_TOKEN: z.string().min(1),

      // storage
      CLOUDINARY_API_KEY: z.string().min(1),
      CLOUDINARY_API_SECRET: z.string().min(1),
      CLOUDINARY_CLOUD_NAME: z.string().min(1),
      CLOUDINARY_UPLOAD_PRESET: z.string().min(1),

      // cache
      UPSTASH_REDIS_REST_URL: z.string().min(1),
      UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
      UPSTASH_REDIS_URL: z.string().min(1),

      // queue
      INNGEST_EVENT_KEY: z.string().min(1),
      INNGEST_SIGNING_KEY: z.string().min(1),

      // monitoring
      SENTRY_AUTH_TOKEN: z.string().min(1),
      SENTRY_DSN: z.string().min(1),
    },

    runtimeEnv: process.env,
    isServer: typeof window === "undefined",
    emptyStringAsUndefined: true,
    skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
  });
}

export const env = appEnv();

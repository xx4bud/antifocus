import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const env = createEnv({
  extends: [vercel()],

  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },

  server: {
    // db (neon postgres)
    DATABASE_URL: z.string().min(1),

    // better-auth
    BETTER_AUTH_SECRET: z.string().min(1),

    // email (resend)
    RESEND_API_KEY: z.string().min(1),

    // cache (upstash redis)
    KV_REST_API_URL: z.string().min(1),
    KV_REST_API_TOKEN: z.string().min(1),

    // auth (google)
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    // payment (midtrans)
    MIDTRANS_SERVER_KEY: z.string().min(1),
    MIDTRANS_CLIENT_KEY: z.string().min(1),
    MIDTRANS_IS_PRODUCTION: z.string().default("false"),

    // shipping (biteship)
    BITESHIP_API_KEY: z.string().min(1),

    // storage (cloudflare r2)
    CLOUDFLARE_R2_ACCOUNT_ID: z.string().min(1),
    CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().min(1),
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1),
    CLOUDFLARE_R2_BUCKET_NAME: z.string().min(1),
    CLOUDFLARE_R2_PUBLIC_URL: z.string().min(1),

    // background jobs (inngest)
    INNGEST_EVENT_KEY: z.string().min(1),
    INNGEST_SIGNING_KEY: z.string().min(1),

    // web push
    VAPID_PUBLIC_KEY: z.string().min(1),
    VAPID_PRIVATE_KEY: z.string().min(1),

    // monitoring (sentry)
    SENTRY_DSN: z.string().min(1),
    SENTRY_AUTH_TOKEN: z.string().min(1),

    // feature flags
    FLAGS_SECRET: z.string().min(1),
  },

  client: {
    // public app url
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },

  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  isServer: typeof window === "undefined",
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});

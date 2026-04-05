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
    // database (neon)
    DATABASE_URL: z.url(),

    // better-auth
    BETTER_AUTH_SECRET: z.string(),

    // oauth (google)
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
  },

  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },

  isServer: typeof window === "undefined",
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});

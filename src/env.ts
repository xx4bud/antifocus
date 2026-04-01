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
  },

  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },

  isServer: typeof window === "undefined",
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || !!process.env.SKIP_ENV_VALIDATION,
});

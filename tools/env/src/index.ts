import { createEnv } from "@t3-oss/env-core";
import { vercel } from "@t3-oss/env-core/presets-zod";
import { z } from "zod/v4";

/**
 * Environment variable validation using @t3-oss/env-core
 */
export const env = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },

  server: {
    // DB URLs (Hybrid Multi-DB Architecture)
    DB_URL_AUTH: z.url().min(1),
    DB_URL_PRODUCT: z.url().min(1),
    DB_URL_ORDER: z.url().min(1),
    DB_URL_STORAGE: z.url().min(1),
    DB_URL_ANALYTICS: z.url().min(1),
    DB_URL_NOTIFICATION: z.url().min(1),

    // Authentication
    AUTH_SECRET: z.string().min(1),
    ARCJET_KEY: z.string().min(1),

    // Providers
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_USER_ID: z.string().min(1),
    GOOGLE_REFRESH_TOKEN: z.string().min(1),
  },

  clientPrefix: "PUBLIC_",

  client: {
    // Apps URLs
    PUBLIC_WWW_URL: z.url().min(1),
  },

  runtimeEnv: process.env,
});

/**
 * Environment type
 */
export type Env = typeof env;

/**
 * Environment helpers
 */
export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";

export const isServer = typeof window === "undefined";
export const isClient = typeof window !== "undefined";

/**
 * Get base URL based on environment
 */
export function baseUrl(appUrl: Env | string, port?: number) {
  if (isClient) {
    return window.location.origin;
  }

  if (env.VERCEL_ENV === "production") {
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (env.VERCEL_ENV === "preview") {
    return `https://${env.VERCEL_URL}`;
  }

  if (appUrl) {
    return appUrl;
  }

  return `http://localhost:${port}`;
}

/**
 * Get API base URL
 */
export function apiUrl(appUrl: Env | string, port?: number): string {
  return `${baseUrl(appUrl, port)}/api`;
}

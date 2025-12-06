import { type Env, env, isClient } from "./env";

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

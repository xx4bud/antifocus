import { env, isClient } from "@/env";

/**
 * Retrieves the base URL for the application depending on runtime environment (client, server, dev/prod).
 */
export const getBaseUrl = (): string => {
  if (isClient) {
    return window.location.origin;
  }

  if (env.NEXT_PUBLIC_BASE_URL) {
    return env.NEXT_PUBLIC_BASE_URL;
  }

  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

/**
 * Constructs an absolute URL from a relative path.
 */
export const getAbsoluteUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath === "/" ? "" : cleanPath}`;
};

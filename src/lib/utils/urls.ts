import { env, isClient } from "@/env";

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

export const getAbsoluteUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // Prevent returning 'http://localhost:3000/' (trailing slash) for root path
  return `${baseUrl}${cleanPath === "/" ? "" : cleanPath}`;
};

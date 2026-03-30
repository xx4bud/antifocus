import { env } from "@/env";
import { isClient } from "@/lib/utils/env";

export function getBaseURL() {
  if (isClient) {
    return window.location.origin;
  }

  if (env.VERCEL_ENV === "production") {
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (env.VERCEL_ENV === "preview") {
    return `https://${env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const baseURL = getBaseURL();

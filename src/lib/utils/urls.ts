import { env, isClient } from "@/env";

const TRAILING_SLASH_REGEX = /\/+$/;
const DEFAULT_PORT = 3000;

export const getBaseURL = (): string => {
  let url = "";

  if (isClient) {
    url = window.location.origin;
  } else if (env.VERCEL_ENV === "production") {
    url = `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  } else if (env.VERCEL_URL) {
    url = `https://${env.VERCEL_URL}`;
  } else {
    url =
      env.NEXT_PUBLIC_BASE_URL ||
      `http://localhost:${process.env.PORT ?? DEFAULT_PORT}`;
  }

  return url.replace(TRAILING_SLASH_REGEX, "");
};

import { env } from "~/env";
import { isClient } from "./env";

export function getBaseURL(): string {
  if (isClient) {
    return window.location.origin;
  }

  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }

  if (env.NEXT_PUBLIC_BASE_URL) {
    return env.NEXT_PUBLIC_BASE_URL;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const baseURL = getBaseURL();

export function getBasePath(path: string) {
  return `${baseURL}/${path}`;
}

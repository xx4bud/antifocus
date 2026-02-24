import { isClient } from "./env";

export function getBaseURL(): string {
  if (isClient) {
    return window.location.origin;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const baseURL = getBaseURL();

export function getBasePath(path: string) {
  return `${baseURL}/${path}`;
}

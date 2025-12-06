import { apiUrl, baseUrl, env } from "@antifocus/env";

export function getBaseUrl() {
  return baseUrl(env.PUBLIC_WWW_URL, 3000);
}

export function getApiUrl() {
  return apiUrl(env.PUBLIC_WWW_URL, 3000);
}

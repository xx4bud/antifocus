import { env } from "@antifocus/config/env";
import { apiUrl, baseUrl } from "@antifocus/config/url";

export function getBaseUrl() {
  return baseUrl(env.PUBLIC_WWW_URL, 3000);
}

export function getApiUrl() {
  return apiUrl(env.PUBLIC_WWW_URL, 3000);
}

import {
  env,
  apiUrl as envApiUrl,
  baseUrl as envBaseUrl,
} from "@antifocus/env";

export function getBaseUrl() {
  return envBaseUrl(env.PUBLIC_WWW_URL, 3000);
}

export function getApiUrl() {
  return envApiUrl(getBaseUrl());
}

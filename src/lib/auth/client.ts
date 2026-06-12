import { createAuthClient } from "better-auth/client";
import { getBaseUrl } from "@/lib/utils/urls";

/**
 * dont use this use auth via server
 */
export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});

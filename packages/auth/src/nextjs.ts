import { nextCookies, toNextJsHandler } from "better-auth/next-js";
import type { BetterAuth } from ".";

/**
 * Re-exported from `better-auth/next-js`
 */
export { nextCookies };

/**
 * Creates a Next.js handler for the given BetterAuth instance.
 */
export function createAuthNextJsHandler(auth: BetterAuth) {
  return toNextJsHandler(auth);
}

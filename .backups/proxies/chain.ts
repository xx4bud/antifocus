import type { NextRequest, NextResponse } from "next/server";
import type { ProxyHandler } from "../../utils/types";

/**
 * Chains multiple proxy handlers together with short-circuit logic.
 *
 * This function creates a middleware chain that executes proxy handlers in sequence.
 * If any handler returns a NextResponse, the chain short-circuits and immediately
 * returns that response. If no handler returns a response after all handlers have
 * been executed, the function returns null.
 *
 * @param handlers - Array of proxy handler functions to execute in order
 * @returns A function that takes a NextRequest and returns a NextResponse or null
 *
 * @example
 * ```typescript
 * const authHandler: ProxyHandler = async (request) => {
 *   // Check authentication
 *   if (!isAuthenticated(request)) {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 *   }
 *   return undefined;
 * };
 *
 * const loggingHandler: ProxyHandler = async (request) => {
 *   console.log('Request received:', request.url);
 *   return undefined;
 * };
 *
 * const middleware = chain([authHandler, loggingHandler]);
 * const result = await middleware(request);
 * if (result) {
 *   return result; // Short-circuited due to auth failure
 * }
 * // Continue with normal processing
 * ```
 *
 * @throws Propagates any errors thrown by individual handlers
 */
export function chain(handlers: ProxyHandler[]) {
  return async (request: NextRequest): Promise<NextResponse | undefined> => {
    for (const handler of handlers) {
      const result = await handler(request);
      if (result) {
        return result;
      }
    }

    return undefined;
  };
}

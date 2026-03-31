import { type NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "@/lib/i18n/routing";
import { errorResponse, parseError } from "@/lib/utils/errors";

/**
 * Authentication proxy handler that manages user sessions and route protection.
 *
 * This handler performs the following authentication logic:
 * - Redirects authenticated users away from auth routes (sign-in, sign-up, etc.) to home
 * - Redirects unauthenticated users away from protected routes to sign-in with callback URL
 * - Allows authenticated users to access protected routes
 * - Allows unauthenticated users to access public routes
 *
 * @param request - The incoming Next.js request object
 * @returns NextResponse for redirects when authentication actions are needed, undefined to continue the request chain
 */
export async function authHandler(
  request: NextRequest
): Promise<NextResponse | undefined> {
  const pathname = request.nextUrl.pathname;

  // Check if current route is an authentication route (sign-in, sign-up, etc.)
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname.endsWith(route) || pathname.includes(`${route}/`)
  );

  // Check if current route is a protected route (requires authentication)
  const isProtectedRoute =
    PROTECTED_ROUTES.some(
      (route) => pathname.endsWith(route) || pathname.includes(`${route}/`)
    ) && !isAuthRoute;

  // Only perform authentication checks for auth or protected routes
  if (isAuthRoute || isProtectedRoute) {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      // Redirect authenticated users away from auth routes to home page
      if (session && isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Redirect unauthenticated users away from protected routes to sign-in
      if (!session && isProtectedRoute) {
        const loginUrl = new URL("/sign-in", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error("Error getting session in auth proxy:", error);
      const appError = parseError(error);
      return errorResponse(appError);
    }
  }

  // Continue to next handler in the chain if no redirect is needed
  return undefined;
}

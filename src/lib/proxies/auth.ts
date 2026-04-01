import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "@/lib/i18n/routing";
import { toErrorHandler } from "@/lib/utils/api";
import { parseError } from "@/lib/utils/errors";
import type { ProxyHandler } from "@/lib/utils/types";

export const authHandler: ProxyHandler = async (
  request: NextRequest
): Promise<NextResponse | undefined> => {
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname.endsWith(route) || pathname.includes(`${route}/`)
  );

  const isProtectedRoute =
    PROTECTED_ROUTES.some(
      (route) => pathname.endsWith(route) || pathname.includes(`${route}/`)
    ) && !isAuthRoute;

  if (isAuthRoute || isProtectedRoute) {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (session && isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (!session && isProtectedRoute) {
        const loginUrl = new URL("/sign-in", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      return toErrorHandler(parseError(error));
    }
  }

  return undefined;
};

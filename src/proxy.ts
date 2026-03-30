import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

const i18nMiddleware = createMiddleware(routing);

export default function proxy(req: NextRequest) {
  try {
    const i18nResponse = i18nMiddleware(req);

    return i18nResponse;
  } catch (error) {
    console.error("PROXY", error);
  }
}

export const config = {
  matcher: [
    "/((?!api|static|assets|robots|sitemap|manifest|sw|service-worker|_next|_vercel|trpc|.*\\..*).*)",
  ],
};

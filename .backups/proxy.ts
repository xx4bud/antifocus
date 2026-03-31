import { type NextRequest, NextResponse } from "next/server";
import { authHandler, chain, i18nHandler } from "@/lib/proxies";
import { errorResponse, parseError } from "@/lib/utils/errors";

export default async function proxy(req: NextRequest) {
  try {
    const response = await chain([i18nHandler, authHandler])(req);
    return response || NextResponse.next();
  } catch (error) {
    return errorResponse(parseError(error));
  }
}

export const config = {
  matcher: [
    "/((?!api|static|assets|robots|sitemap|manifest|sw|service-worker|_next|_vercel|trpc|.*\\..*).*)",
  ],
};

import type { NextRequest } from "next/server";
import { i18nHandler } from "@/lib/i18n/middleware";
import { chain, toErrorHandler } from "@/lib/utils/api";
import { parseError } from "@/lib/utils/error";

const middleware = chain([i18nHandler]);

export default async function proxy(req: NextRequest) {
  try {
    return await middleware(req);
  } catch (error) {
    return toErrorHandler(parseError(error));
  }
}

export const config = {
  matcher: [
    "/((?!api|static|assets|robots|sitemap|manifest|sw|service-worker|_next|_vercel|trpc|.*\\..*).*)",
  ],
};

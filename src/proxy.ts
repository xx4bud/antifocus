import type { NextRequest } from "next/server";
import { authHandler, chain, i18nHandler } from "@/lib/proxies";
import { toErrorHandler } from "@/lib/utils/api";
import { parseError } from "@/lib/utils/errors";

const middleware = chain([authHandler, i18nHandler]);

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

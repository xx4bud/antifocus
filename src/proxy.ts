import { NextRequest } from "next/server";
import { authHandler, chain, i18nHandler } from "@/lib/proxies";
import { toErrorHandler } from "@/lib/utils/api";
import { parseError } from "@/lib/utils/errors";

const middleware = chain([authHandler, i18nHandler]);

export default async function proxy(req: NextRequest) {
  let request = req;

  // Normalize headers in dev to prevent Server Actions header mismatch
  if (process.env.NODE_ENV === "development") {
    const headers = new Headers(req.headers);
    const origin = headers.get("origin");
    const forwardedHost = headers.get("x-forwarded-host");

    if (
      origin === "http://localhost:3000" &&
      forwardedHost?.includes("app.github.dev")
    ) {
      headers.set("x-forwarded-host", "localhost:3000");
    }

    request = new NextRequest(req.url, { ...req, headers });
  }

  try {
    return await middleware(request);
  } catch (error) {
    return toErrorHandler(parseError(error));
  }
}

export const config = {
  matcher: [
    "/((?!api|static|assets|robots|sitemap|manifest|sw|service-worker|_next|_vercel|trpc|.*\\..*).*)",
  ],
};

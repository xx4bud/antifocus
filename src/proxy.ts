import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // public
    "/",
    "/(id|en)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};

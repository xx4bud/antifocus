import createMiddleware from "next-intl/middleware";
import { routing } from "~/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // public
    "/((?!api|static|assets|robots|sitemap|manifest|sw|service-worker|_next|_vercel|trpc|.*\\..*).*)",
  ],
};

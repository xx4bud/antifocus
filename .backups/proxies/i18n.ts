import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n";

const intlMiddleware = createMiddleware(routing);

export function i18nHandler(request: NextRequest) {
  return intlMiddleware(request);
}

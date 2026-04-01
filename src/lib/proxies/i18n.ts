import type { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";
import { toErrorHandler } from "@/lib/utils/api";
import { parseError } from "@/lib/utils/errors";
import type { ProxyHandler } from "@/lib/utils/types";

const intlMiddleware = createMiddleware(routing);

export const i18nHandler: ProxyHandler = async (
  request: NextRequest
): Promise<NextResponse | undefined> => {
  try {
    return intlMiddleware(request);
  } catch (error) {
    return toErrorHandler(parseError(error));
  }
};

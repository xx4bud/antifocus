import type { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";
import { toErrorHandler } from "@/lib/utils/api";
import { parseError } from "@/lib/utils/error";
import type { AppHandler } from "@/lib/utils/types";

const i18nMiddleware = createMiddleware(routing);

export const i18nHandler: AppHandler = (
  request: NextRequest
): NextResponse | undefined => {
  try {
    return i18nMiddleware(request);
  } catch (error) {
    return toErrorHandler(parseError(error));
  }
};

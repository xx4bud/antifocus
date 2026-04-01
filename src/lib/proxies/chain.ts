import type { NextRequest, NextResponse } from "next/server";
import { toErrorHandler } from "@/lib/utils/api";
import { parseError } from "@/lib/utils/errors";
import type { ProxyHandler } from "@/lib/utils/types";

export function chain(handlers: ProxyHandler[]): ProxyHandler {
  return async (request: NextRequest): Promise<NextResponse | undefined> => {
    try {
      for (const handler of handlers) {
        const result = await handler(request);
        if (result) {
          return result;
        }
      }
    } catch (error) {
      return toErrorHandler(parseError(error));
    }

    return undefined;
  };
}

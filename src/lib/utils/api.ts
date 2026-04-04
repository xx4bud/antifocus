import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parseError } from "@/lib/utils/error";
import type {
  AppError,
  AppHandler,
  AppResponse,
  AppResult,
} from "@/lib/utils/types";

export function toHandler<T>(
  result: AppResult<T>
): NextResponse<AppResponse<T>> {
  if (!result.ok) {
    return toErrorHandler(result.error);
  }

  return NextResponse.json({
    success: true,
    data: result.value,
  });
}

export function toErrorHandler<T>(
  error: AppError
): NextResponse<AppResponse<T>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.context && { context: error.context }),
      },
    },
    { status: error.statusCode }
  );
}

export function chain(handlers: AppHandler[]): AppHandler {
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

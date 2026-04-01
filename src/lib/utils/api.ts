import { NextResponse } from "next/server";
import type { AppError, AppResponse, AppResult } from "@/lib/utils/types";

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

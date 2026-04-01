import type { NextRequest, NextResponse } from "next/server";

export interface AppError {
  code: string;
  context?: Record<string, unknown>;
  message: string;
  statusCode: number;
}

export type AppResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: AppError };

export type AppResponse<T = unknown> =
  | {
      success: true;
      data: T;
      message?: string;
      metadata?: Record<string, unknown>;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        context?: Record<string, unknown>;
      };
    };

export type ProxyHandler = (
  request: NextRequest
) => Promise<NextResponse | undefined>;

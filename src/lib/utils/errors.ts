import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { APIError } from "better-auth/api";
import { DrizzleError } from "drizzle-orm";
import { ZodError } from "zod";
import { isProduction } from "@/lib/utils/env";
import type { AppError } from "@/lib/utils/types";

export function createError(
  code: string,
  message: string,
  statusCode = 500,
  context?: Record<string, unknown>
): AppError {
  return { code, message, statusCode, context };
}

export function parseZodError(error: ZodError): AppError {
  const context: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join(".");
    context[path] ??= [];
    context[path].push(issue.message);
  }

  return createError("VALIDATION_ERROR", "Validation failed", 400, context);
}

export function parseDrizzleError(error: DrizzleError): AppError {
  return createError("DATABASE_ERROR", error.message || "Database error", 500);
}

export function parseAuthError(error: APIError): AppError {
  return createError(
    "AUTH_ERROR",
    error.message || "Authentication failed",
    error.statusCode ?? error.status ?? 401
  );
}

export function parseTRPCError(error: TRPCError): AppError {
  return createError(
    error.code ?? "TRPC_ERROR",
    error.message || "Api error",
    getHTTPStatusCodeFromError(error)
  );
}

export function parseUnknownError(error: unknown): AppError {
  if (error instanceof Error) {
    return createError("INTERNAL_ERROR", error.message, 500);
  }

  if (error && typeof error === "object" && "message" in error) {
    return createError("OBJECT_ERROR", String(error.message), 500);
  }

  return createError("UNKNOWN_ERROR", String(error), 500);
}

export function parseError(error: unknown): AppError {
  console.error("🔥 Error:", error);

  let appError: AppError;

  if (error instanceof ZodError) {
    appError = parseZodError(error);
  } else if (error instanceof DrizzleError) {
    appError = parseDrizzleError(error);
  } else if (error instanceof TRPCError) {
    appError = parseTRPCError(error);
  } else if (error instanceof APIError) {
    appError = parseAuthError(error);
  } else {
    appError = parseUnknownError(error);
  }

  if (isProduction) {
    return {
      ...appError,
      message: "Internal server error",
      context: undefined,
    };
  }

  return appError;
}

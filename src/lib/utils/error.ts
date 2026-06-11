import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { type APIError, isAPIError } from "better-auth/api";
import { DrizzleError, type DrizzleQueryError } from "drizzle-orm";
import { ZodError } from "zod";

/**
 * Standardized application error format.
 */
export interface AppError {
  /** Machine-readable error code */
  code: string;
  /** Additional diagnostic context */
  context?: Record<string, unknown>;
  /** User-friendly error message */
  message: string;
  /** Suggested HTTP status code */
  statusCode?: number;
}

/**
 * Creates an immutable AppError object.
 */
export const createError = (
  code: string,
  message: string,
  statusCode?: number,
  context?: Record<string, unknown>
): AppError =>
  Object.freeze({
    code,
    message,
    statusCode,
    context,
  });

/**
 * Parses a Zod validation error into a structured AppError.
 */
export const parseZodError = (error: ZodError): AppError => {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(issue.message);
  }

  return createError(
    error.name || "VALIDATION_ERROR",
    error.message || "Validation error",
    400,
    { fieldErrors }
  );
};

/**
 * Parses a Better Auth API error into a structured AppError.
 */
export const parseAuthError = (error: APIError): AppError =>
  createError(
    error.status.toString() || "AUTH_ERROR",
    error.message || "Auth error",
    error.statusCode || 500,
    { error }
  );

/**
 * Parses a tRPC Error into a structured AppError.
 */
export const parseTrpcError = (error: TRPCError): AppError =>
  createError(
    error.code || "TRPC_ERROR",
    error.message || "TRPC error occurred",
    getHTTPStatusCodeFromError(error),
    { error }
  );

/**
 * Parses a Postgres/Drizzle Error into a structured AppError.
 */
export const parseDbError = (
  error: DrizzleError | DrizzleQueryError
): AppError =>
  createError(
    error.name || "DB_ERROR",
    error.message || "Database error occurred",
    500,
    { error }
  );

/**
 * Parses a generic API fetch error.
 */
export const parseApiError = (
  error: Error & { status?: number; statusCode?: number }
): AppError => {
  const status = error.status || error.statusCode || 500;
  return createError(
    error.name || "API_ERROR",
    error.message || "External API error",
    status,
    { error }
  );
};

/**
 * Coerces any unknown error into a normalized AppError.
 */
export const parseError = (error: unknown): AppError => {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    "message" in error &&
    !(
      "name" in error && (error as Record<string, unknown>).name === "TRPCError"
    ) &&
    !("issues" in error) &&
    typeof (error as Record<string, unknown>).code === "string"
  ) {
    return error as AppError;
  }

  if (error instanceof ZodError) {
    return parseZodError(error);
  }

  if (isAPIError(error)) {
    return parseAuthError(error);
  }

  if (error instanceof TRPCError) {
    return parseTrpcError(error);
  }

  if (error instanceof DrizzleError) {
    return parseDbError(error);
  }

  if (
    error instanceof Error &&
    "code" in error &&
    typeof (error as Record<string, unknown>).code === "string" &&
    (error as Record<string, unknown>).code?.toString().length === 5
  ) {
    return parseDbError(error);
  }
  if (
    error instanceof Error &&
    ("status" in error || "statusCode" in error || "response" in error)
  ) {
    return parseApiError(
      error as Error & { status?: number; statusCode?: number }
    );
  }

  if (error instanceof Error) {
    return createError(
      "INTERNAL_ERROR",
      error.message || `Error: ${JSON.stringify(error)}`,
      500
    );
  }

  return createError("UNKNOWN_ERROR", "Unknown error", 500);
};

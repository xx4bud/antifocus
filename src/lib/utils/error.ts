import { type APIError, isAPIError } from "better-auth/api";
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
  const firstIssue = error.issues[0];
  const message = firstIssue
    ? `${firstIssue.path.join(".")}: ${firstIssue.message}`
    : "Validation error";

  return createError("VALIDATION_ERROR", message, 400, {
    issues: error.issues.map((issue) => ({
      path: issue.path,
      message: issue.message,
      code: issue.code,
    })),
  });
};

/**
 * Parses a Better Auth API error into a structured AppError.
 */
export const parseAuthError = (error: APIError): AppError => {
  const status = error.status;

  if (typeof status === "string") {
    return createError(status, error.message || "Auth Error");
  }
  if (status === 401 || status === 403) {
    return createError("UNAUTHORIZED", error.message || "Unauthorized", status);
  }
  if (status === 400) {
    return createError("BAD_REQUEST", error.message || "Bad Request", status);
  }
  if (status === 404) {
    return createError("NOT_FOUND", error.message || "Not Found", status);
  }

  return createError(
    "INTERNAL_SERVER_ERROR",
    error.message || "Server Error",
    status
  );
};

/**
 * Coerces any unknown error into a normalized AppError.
 */
export const parseError = (error: unknown): AppError => {
  if (error && typeof error === "object" && "code" in error) {
    return error as AppError;
  }

  if (error instanceof ZodError) {
    return parseZodError(error);
  }

  if (isAPIError(error)) {
    return parseAuthError(error);
  }

  if (error instanceof Error) {
    return createError("INTERNAL_ERROR", error.message, 500);
  }

  return createError("UNKNOWN_ERROR", "An unknown error occurred", 500);
};

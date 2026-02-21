import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/unstable-core-do-not-import";
import { APIError } from "better-auth/api";
import { DrizzleError } from "drizzle-orm";
import { ZodError } from "zod";
import type { AppError } from "./types";

export function formatZodError(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(issue.message);
  }

  return fieldErrors;
}

export function parseZodError(error: ZodError): AppError {
  return {
    code: error.name || "validation_error",
    message: error.message || "validation failed",
    statusCode: 400,
    context: formatZodError(error),
  };
}

export function parseDrizzleError(error: DrizzleError): AppError {
  return {
    code: error.name || "database_error",
    message: error.message || "database error",
    statusCode: 500,
  };
}

export function parseAuthError(error: APIError): AppError {
  return {
    code: error.status ? String(error.status) : "auth_error",
    message: error.message || "authentication failed",
    statusCode: error.statusCode || 500,
  };
}

export function parseTRPCError(error: TRPCError): AppError {
  return {
    code: error.code || "trpc_error",
    message: error.message || "trpc error",
    statusCode: getHTTPStatusCodeFromError(error),
  };
}

export function parseAPIError(error: Error): AppError {
  const err = error as Error & { statusCode?: number; code?: string };
  return {
    code: err.code || "api_error",
    message: err.message || "api error",
    statusCode: err.statusCode || 500,
  };
}

export function parseError(error: unknown): AppError {
  if (error instanceof ZodError) {
    return parseZodError(error);
  }

  if (error instanceof DrizzleError) {
    return parseDrizzleError(error);
  }

  if (error instanceof TRPCError) {
    return parseTRPCError(error);
  }

  if (error instanceof APIError) {
    return parseAuthError(error);
  }

  if (error instanceof Error) {
    return parseAPIError(error);
  }

  if (error && typeof error === "object" && "message" in error) {
    return {
      code: "object_error",
      message:
        String((error as { message: unknown }).message) || "unknown error",
      statusCode: 500,
    };
  }

  return {
    code: "unknown_error",
    message: String(error) || "unknown error",
    statusCode: 500,
  };
}

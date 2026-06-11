import type { AppError } from "./error";

/**
 * Represents a standard Result pattern type.
 */
export type AppResult<T, E = AppError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/**
 * Result state for Server Actions.
 */
export type ActionState<T = unknown> = AppResult<T> | null;

/**
 * Normalized API response structure.
 */
export type AppResponse<T = unknown> =
  | {
      success: true;
      data: T;
      message?: string;
      metadata?: Record<string, unknown>;
    }
  | {
      success: false;
      error: AppError;
    };

/**
 * Creates a success AppResult.
 */
export const ok = <T>(value: T): AppResult<T, never> => ({
  ok: true,
  value,
});

/**
 * Creates a failure AppResult.
 */
export const err = <E>(error: E): AppResult<never, E> => ({
  ok: false,
  error,
});

/**
 * Maps the successful value of a result.
 */
export const map = <T, U, E>(
  result: AppResult<T, E>,
  fn: (value: T) => U
): AppResult<U, E> => (result.ok ? ok(fn(result.value)) : result);

/**
 * Maps the error value of a result.
 */
export const mapError = <T, E, F>(
  result: AppResult<T, E>,
  fn: (error: E) => F
): AppResult<T, F> => (result.ok ? result : err(fn(result.error)));

/**
 * FlatMaps (binds) a result returning function over a result.
 */
export const flatMap = <T, U, E, F>(
  result: AppResult<T, E>,
  fn: (value: T) => AppResult<U, F>
): AppResult<U, E | F> => (result.ok ? fn(result.value) : result);

/**
 * Alias for flatMap.
 */
export const andThen = flatMap;

/**
 * Pattern matches on a result and returns a value.
 */
export const match = <T, E, U>(
  result: AppResult<T, E>,
  handlers: { ok: (value: T) => U; err: (error: E) => U }
): U => (result.ok ? handlers.ok(result.value) : handlers.err(result.error));

/**
 * Executes a function, catching any exceptions and returning them as an AppResult error.
 */
export const tryCatch = <T, E>(
  fn: () => T,
  onError: (error: unknown) => E
): AppResult<T, E> => {
  try {
    return ok(fn());
  } catch (error) {
    return err(onError(error));
  }
};

/**
 * Executes an async function, catching any exceptions and returning them as an AppResult error.
 */
export const tryCatchAsync = async <T, E>(
  fn: () => Promise<T>,
  onError: (error: unknown) => E
): Promise<AppResult<T, E>> => {
  try {
    return ok(await fn());
  } catch (error) {
    return err(onError(error));
  }
};

/**
 * Converts a standard Promise to a Promise of AppResult.
 */
export const fromPromise = <T, E>(
  promise: Promise<T>,
  onError: (error: unknown) => E
): Promise<AppResult<T, E>> =>
  promise.then(ok).catch((error) => err(onError(error)));

/**
 * Maps an AppResult into a standardized AppResponse.
 */
export const toResponse = <T>(result: AppResult<T, AppError>): AppResponse<T> =>
  match(result, {
    ok: (value): AppResponse<T> => ({ success: true, data: value }),
    err: (error): AppResponse<T> => ({ success: false, error }),
  });

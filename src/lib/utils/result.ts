import type { AppError } from "./error";

export type AppResult<T, E = AppError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export type ActionState<T = unknown> = AppResult<T> | null;

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

export const ok = <T>(value: T): AppResult<T, never> => ({
  ok: true,
  value,
});

export const err = <E>(error: E): AppResult<never, E> => ({
  ok: false,
  error,
});

export const map = <T, U, E>(
  result: AppResult<T, E>,
  fn: (value: T) => U
): AppResult<U, E> => (result.ok ? ok(fn(result.value)) : result);

export const mapError = <T, E, F>(
  result: AppResult<T, E>,
  fn: (error: E) => F
): AppResult<T, F> => (result.ok ? result : err(fn(result.error)));

export const flatMap = <T, U, E, F>(
  result: AppResult<T, E>,
  fn: (value: T) => AppResult<U, F>
): AppResult<U, E | F> => (result.ok ? fn(result.value) : result);

export const andThen = flatMap;

export const match = <T, E, U>(
  result: AppResult<T, E>,
  handlers: { ok: (value: T) => U; err: (error: E) => U }
): U => (result.ok ? handlers.ok(result.value) : handlers.err(result.error));

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

export const fromPromise = <T, E>(
  promise: Promise<T>,
  onError: (error: unknown) => E
): Promise<AppResult<T, E>> =>
  promise.then(ok).catch((error) => err(onError(error)));

export const toResponse = <T>(result: AppResult<T, AppError>): AppResponse<T> =>
  match(result, {
    ok: (value): AppResponse<T> => ({ success: true, data: value }),
    err: (error): AppResponse<T> => ({ success: false, error }),
  });

export function debounce<T extends (...args: unknown[]) => Promise<unknown>>(
  func: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  if (typeof func !== "function") {
    throw new Error("Func must be a function");
  }
  if (typeof delay !== "number" || delay < 0) {
    throw new Error("Delay must be a non-negative number");
  }
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args);
          resolve(result as ReturnType<T>);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}

export async function retry<T>(
  func: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  if (typeof func !== "function") {
    throw new Error("Func must be a function");
  }
  if (typeof maxRetries !== "number" || maxRetries < 0) {
    throw new Error("MaxRetries must be a non-negative number");
  }
  if (typeof baseDelay !== "number" || baseDelay < 0) {
    throw new Error("BaseDelay must be a non-negative number");
  }
  let lastError: Error = new Error("Max retries exceeded");
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await func();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries) {
        const delay = baseDelay * 2 ** attempt;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

export function delay(ms: number): Promise<void> {
  if (typeof ms !== "number" || ms < 0) {
    throw new Error("Ms must be a non-negative number");
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function timeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  if (!(promise instanceof Promise)) {
    throw new Error("Input must be a Promise");
  }
  if (typeof timeoutMs !== "number" || timeoutMs < 0) {
    throw new Error("TimeoutMs must be a non-negative number");
  }
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Promise timed out")), timeoutMs)
    ),
  ]);
}

import { useCallback, useRef } from "react";

export const useDebounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): T => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => func(...args), delay);
    },
    [func, delay]
  ) as T;
};

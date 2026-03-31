import { useCallback, useState } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const newValue =
          typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(newValue));
        } catch {
          // ignore
        }
        return newValue;
      });
    },
    [key]
  );

  return [value, setStoredValue] as const;
};

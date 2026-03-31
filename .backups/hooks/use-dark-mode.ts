import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";

export const useDarkMode = () => {
  const [isDark, setIsDark] = useLocalStorage("dark-mode", false);

  const toggle = useCallback(() => setIsDark((prev) => !prev), [setIsDark]);

  return { isDark, toggle };
};

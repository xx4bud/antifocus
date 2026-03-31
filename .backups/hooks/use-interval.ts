import { useCallback, useRef, useState } from "react";

export const useInterval = () => {
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(
    (callback: () => void, delay: number) => {
      if (isRunning) {
        return;
      }

      setIsRunning(true);
      intervalRef.current = setInterval(callback, delay);
    },
    [isRunning]
  );

  const stop = useCallback(() => {
    if (!isRunning) {
      return;
    }

    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning]);

  return { start, stop, isRunning };
};

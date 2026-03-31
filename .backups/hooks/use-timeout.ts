import { useCallback, useRef, useState } from "react";

export const useTimeout = () => {
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(
    (callback: () => void, delay: number) => {
      if (isPending) {
        return;
      }

      setIsPending(true);
      timeoutRef.current = setTimeout(() => {
        callback();
        setIsPending(false);
      }, delay);
    },
    [isPending]
  );

  const cancel = useCallback(() => {
    if (!isPending) {
      return;
    }

    setIsPending(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [isPending]);

  return { start, cancel, isPending };
};

import { useCallback, useEffect, useRef, useState } from "react";

interface Position {
  element: HTMLElement | null;
  x: number;
  y: number;
}

export const useClickMouse = () => {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState<Position>({
    x: 0,
    y: 0,
    element: null,
  });

  const handleClick = useCallback((e: MouseEvent) => {
    setPosition({
      x: e.clientX,
      y: e.clientY,
      element: e.target as HTMLElement,
    });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener("click", handleClick);
      return () => element.removeEventListener("click", handleClick);
    }
  }, [handleClick]);

  return { ref, ...position };
};

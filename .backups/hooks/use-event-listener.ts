import { useEffect, useRef } from "react";

export const useEventListener = <
  T extends EventTarget,
  K extends keyof WindowEventMap,
>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: T | null
) => {
  const savedHandler = useRef(handler);
  savedHandler.current = handler;

  useEffect(() => {
    const targetElement = (element as EventTarget) ?? window;
    const eventListener = (event: Event) =>
      savedHandler.current(event as WindowEventMap[K]);

    targetElement.addEventListener(eventName, eventListener);
    return () => targetElement.removeEventListener(eventName, eventListener);
  }, [eventName, element]);
};

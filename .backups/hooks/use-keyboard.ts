import { useEffect, useState } from "react";

interface KeyboardEventWithKey extends KeyboardEvent {
  key: string;
}

export const useKeyboard = (targetKey: string) => {
  const [isPressed, setIsPressed] = useState(false);
  const [event, setEvent] = useState<KeyboardEventWithKey | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === targetKey) {
        setIsPressed(true);
        setEvent(e as KeyboardEventWithKey);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === targetKey) {
        setIsPressed(false);
        setEvent(e as KeyboardEventWithKey);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [targetKey]);

  return { isPressed, event };
};

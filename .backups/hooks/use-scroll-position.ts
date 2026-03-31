import { useEffect, useState } from "react";

export const useScrollPosition = () => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      setX(window.scrollX);
      setY(window.scrollY);
    };

    window.addEventListener("scroll", updatePosition);
    updatePosition(); // initial

    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return { x, y };
};

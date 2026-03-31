import { useMediaQuery } from "./use-media-query";

export const useMobile = (): boolean => {
  return useMediaQuery("(max-width: 768px)");
};

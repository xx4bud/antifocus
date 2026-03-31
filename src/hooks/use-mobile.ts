import { useMediaQuery } from "./use-media-query";

export const useIsMobile = (): boolean => {
  return useMediaQuery("(max-width: 768px)");
};

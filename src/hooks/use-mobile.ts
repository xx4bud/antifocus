"use client";

import { useMediaQuery } from "./use-media-query";

const MOBILE_BREAKPOINT = "(max-width: 768px)";

export function useIsMobile() {
  return useMediaQuery(MOBILE_BREAKPOINT);
}

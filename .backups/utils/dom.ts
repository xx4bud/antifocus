export async function copyToClipboard(text: string): Promise<void> {
  if (typeof text !== "string") {
    throw new Error("Text must be a string");
  }
  if (!navigator.clipboard) {
    throw new Error("Clipboard API not supported");
  }
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    throw new Error("Failed to copy to clipboard");
  }
}

export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function isElementVisible(element: Element): boolean {
  if (!(element instanceof Element)) {
    throw new Error("Input must be an Element");
  }
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  if (typeof func !== "function") {
    throw new Error("Func must be a function");
  }
  if (typeof delay !== "number" || delay < 0) {
    throw new Error("Delay must be a non-negative number");
  }
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  if (typeof func !== "function") {
    throw new Error("Func must be a function");
  }
  if (typeof limit !== "number" || limit < 0) {
    throw new Error("Limit must be a non-negative number");
  }
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

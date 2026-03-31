const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function capitalize(str: string): string {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str: string, length: number): string {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }
  if (length < 0) {
    throw new Error("Length must be non-negative");
  }
  return str.length > length ? `${str.slice(0, length)}...` : str;
}

export function slugify(str: string): string {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isEmpty(str: string): boolean {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }
  return str.trim().length === 0;
}

export function camelCase(str: string): string {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, "");
}

/**
 * Converts a string to kebab-case.
 * @param str - The input string.
 * @returns The kebab-cased string.
 */
export function kebabCase(str: string): string {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * Checks if a string is a valid email address (simple regex).
 * @param str - The input string.
 * @returns True if valid email, false otherwise.
 */
export function isEmail(str: string): boolean {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }
  return emailRegex.test(str);
}

/**
 * Checks if a string is a valid URL (simple regex).
 * @param str - The input string.
 * @returns True if valid URL, false otherwise.
 */
export function isURL(str: string): boolean {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Normalize string: trims leading/trailing spaces and collapses multiple spaces into one.
 * "  Hello   World  " → "Hello World"
 */
export const normalizeString = (text: string): string =>
  text.replace(/\s+/g, " ").trim();

/**
 * Normalize alphanumeric: keeps only letters and numbers, removes everything else.
 * "SKU-123.45!" → "SKU12345"
 */
export const normalizeAlphanumeric = (text: string): string =>
  text.replace(/[^a-zA-Z0-9]/g, "");

/**
 * Clamp a number within a range.
 * clamp(15, 0, 10) → 10
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Round to a specific number of decimal places.
 * roundTo(1.2345, 2) → 1.23
 */
export const roundTo = (value: number, decimals: number): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

/**
 * Calculate percentage.
 * percentage(25, 100) → 25
 */
export const percentage = (part: number, total: number): number =>
  total === 0 ? 0 : roundTo((part / total) * 100, 2);

/**
 * Check if a string is a valid numeric value.
 * isNumeric("123.45") → true
 * isNumeric("abc") → false
 */
export const isNumeric = (value: string): boolean =>
  !Number.isNaN(Number(value)) && value.trim() !== "";

/**
 * Generate a random integer between min and max (inclusive).
 */
export const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Pad a number with leading zeros.
 * padNumber(42, 4) → "0042"
 * Used for: Sequence numbering (INV-0001, PO-0042)
 */
export const padNumber = (num: number, length: number): string =>
  String(num).padStart(length, "0");

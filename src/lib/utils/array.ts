// ==============================
// Array Utilities
// ==============================

/**
 * Group an array of objects by a specific key.
 */
export const groupBy = <T extends Record<string, unknown>, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> =>
  array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );

/**
 * Chunk an array into smaller arrays of a specified size.
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  if (size <= 0) {
    return [array];
  }
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

/**
 * Remove duplicate primitive values from an array.
 */
export const unique = <T>(array: T[]): T[] => Array.from(new Set(array));

/**
 * Remove duplicate objects from an array based on a specific key.
 */
export const uniqueBy = <T extends Record<string, unknown>, K extends keyof T>(
  array: T[],
  key: K
): T[] => {
  const seen = new Set<string>();
  return array.filter((item) => {
    const itemKey = String(item[key]);
    if (seen.has(itemKey)) {
      return false;
    }
    seen.add(itemKey);
    return true;
  });
};

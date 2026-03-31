export function shuffle<T>(arr: readonly T[]): T[] {
  if (!Array.isArray(arr)) {
    throw new Error("Input must be an array");
  }
  const shuffled = Array.from(arr);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function chunk<T>(arr: T[], size: number): T[][] {
  if (!Array.isArray(arr)) {
    throw new Error("Input must be an array");
  }
  if (typeof size !== "number" || size <= 0) {
    throw new Error("Size must be a positive number");
  }
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function flatten(arr: unknown[], depth = 1): unknown[] {
  if (!Array.isArray(arr)) {
    throw new Error("Input must be an array");
  }
  if (typeof depth !== "number" || depth < 1) {
    throw new Error("Depth must be a positive number");
  }
  return arr.flat(depth);
}

export function groupBy<T, K extends string | number | symbol>(
  arr: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  if (!Array.isArray(arr)) {
    throw new Error("Input must be an array");
  }
  if (typeof keyFn !== "function") {
    throw new Error("keyFn must be a function");
  }
  return arr.reduce(
    (groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    },
    {} as Record<K, T[]>
  );
}

export function sortBy<T>(
  arr: T[],
  comparator: ((a: T, b: T) => number) | keyof T
): T[] {
  if (!Array.isArray(arr)) {
    throw new Error("Input must be an array");
  }
  const sorted = [...arr];
  if (typeof comparator === "function") {
    return sorted.sort(comparator);
  }
  if (typeof comparator === "string") {
    return sorted.sort((a, b) => {
      const aVal = a[comparator];
      const bVal = b[comparator];
      if (aVal < bVal) {
        return -1;
      }
      if (aVal > bVal) {
        return 1;
      }
      return 0;
    });
  }
  throw new Error("Comparator must be a function or property key");
}

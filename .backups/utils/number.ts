export function clamp(value: number, min: number, max: number): number {
  if (
    typeof value !== "number" ||
    typeof min !== "number" ||
    typeof max !== "number"
  ) {
    throw new Error("All inputs must be numbers");
  }
  return Math.min(Math.max(value, min), max);
}

export function formatCurrency(
  value: number,
  currency = "USD",
  locale = "en-US"
): string {
  if (typeof value !== "number") {
    throw new Error("Value must be a number");
  }
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    value
  );
}

export function toFixed(value: number, decimals: number): string {
  if (typeof value !== "number" || typeof decimals !== "number") {
    throw new Error("Value and decimals must be numbers");
  }
  if (decimals < 0) {
    throw new Error("Decimals must be non-negative");
  }
  return value.toFixed(decimals);
}

export function randomInt(min: number, max: number): number {
  if (typeof min !== "number" || typeof max !== "number") {
    throw new Error("Min and max must be numbers");
  }
  if (min > max) {
    throw new Error("Min must be less than or equal to max");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function percentage(value: number, total: number, decimals = 2): number {
  if (typeof value !== "number" || typeof total !== "number") {
    throw new Error("Value and total must be numbers");
  }
  if (total === 0) {
    throw new Error("Total cannot be zero");
  }
  return Number(((value / total) * 100).toFixed(decimals));
}

export function isNumber(value: unknown): value is number {
  return (
    typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value)
  );
}

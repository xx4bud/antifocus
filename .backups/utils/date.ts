export function formatDate(date: Date, format = "YYYY-MM-DD"): string {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return format
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}

export function relativeTime(date: Date): string {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  if (diffSec < 60) {
    return "just now";
  }
  if (diffMin < 60) {
    return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  }
  if (diffHour < 24) {
    return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  }
  return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
}

export function addDays(date: Date, days: number): Date {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  if (typeof days !== "number") {
    throw new Error("Days must be a number");
  }
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isToday(date: Date): boolean {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function parseISO(isoString: string): Date {
  if (typeof isoString !== "string") {
    throw new Error("Input must be a string");
  }
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid ISO string");
  }
  return date;
}

export function timeAgo(date: Date): string {
  return relativeTime(date);
}

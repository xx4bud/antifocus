import { clsx, type ClassValue } from "clsx";
import {
  formatDate,
  formatDistanceToNowStrict,
} from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+/, "");
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  if (
    currentDate.getTime() - from.getTime() <
    24 * 60 * 60 * 1000
  ) {
    return formatDistanceToNowStrict(from, {
      addSuffix: true,
    });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMM d, yyyy");
    }
  }
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}



import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import {
  formatDate,
  formatDistanceToNowStrict,
} from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function formatNumber(n: number): string {
  return Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(n);
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

export function decimalReviver(key: string, value: any) {
  if (value && typeof value === "object" && "__decimal__" in value) {
    return new Prisma.Decimal(value.__decimal__);
  }
  return value;
}

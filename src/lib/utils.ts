import { clsx, type ClassValue } from "clsx"
import { cache } from "react"
import { twMerge } from "tailwind-merge"
import { auth } from "./auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export function formatCurrency(value: number | string): string {
  const numericValue = Number(value);
  if (isNaN(numericValue)) {
    return "Rp 0";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numericValue);
}

export function formatRating(rating: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating);
}

export const getSession = cache(auth)

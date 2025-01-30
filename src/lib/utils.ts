import { clsx, type ClassValue } from "clsx";
import { cache } from "react";
import { twMerge } from "tailwind-merge";
import { auth } from "@/lib/auth";

export const getSession = cache(auth);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

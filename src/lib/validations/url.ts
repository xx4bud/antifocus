import { z } from "zod";

// ==============================
// Rules
// ==============================

export const URL_RULES = {
  MAX: 2048,
} as const;

// ==============================
// Schemas
// ==============================

export const urlSchema = z
  .string()
  .url("Invalid URL format")
  .max(URL_RULES.MAX, `URL must be at most ${URL_RULES.MAX} characters`);

export const optionalUrlSchema = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val))
  .pipe(urlSchema.optional());

/** Alias for image/logo/cover URL fields */
export const imageUrlSchema = optionalUrlSchema;

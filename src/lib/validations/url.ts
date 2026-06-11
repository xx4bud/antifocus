import { z } from "zod";

export const URL_RULES = {
  MAX: 2048,
} as const;

/**
 * Validate and clean absolute URL.
 */
export const urlSchema = z
  .string()
  .trim()
  .url("Invalid URL format")
  .max(URL_RULES.MAX, `URL must be at most ${URL_RULES.MAX} characters`);

/**
 * Optional absolute URL schema, mapping empty strings to undefined.
 */
export const optionalUrlSchema = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val))
  .pipe(urlSchema.optional());

/**
 * Alias for image/logo/cover URL fields.
 */
export const imageUrlSchema = optionalUrlSchema;

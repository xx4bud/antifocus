import { z } from "zod";

export const COLOR_RULES = {
  /** Matches #RGB or #RRGGBB (case-insensitive) */
  HEX_REGEX: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
} as const;

/**
 * Validate and format hexadecimal color codes (e.g. #FFF or #FFFFFF).
 */
export const colorHexSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(COLOR_RULES.HEX_REGEX, "Invalid HEX color format (e.g. #FFFFFF)");

/**
 * Optional color HEX schema, mapping empty strings to undefined.
 */
export const optionalColorHexSchema = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val))
  .pipe(colorHexSchema.optional());

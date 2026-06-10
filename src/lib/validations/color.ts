import { z } from "zod";

// ==============================
// Rules
// ==============================

export const COLOR_RULES = {
  /** Matches #RGB or #RRGGBB (case-insensitive) */
  HEX_REGEX: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
} as const;

// ==============================
// Schemas
// ==============================

export const colorHexSchema = z
  .string()
  .regex(COLOR_RULES.HEX_REGEX, "Invalid HEX color format (e.g. #FFFFFF)")
  .toUpperCase()
  .trim();

export const optionalColorHexSchema = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val))
  .pipe(colorHexSchema.optional());

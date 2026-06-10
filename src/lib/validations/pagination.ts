import { z } from "zod";
import { normalizeString } from "../utils/string";

// ==============================
// Rules
// ==============================

export const PAGINATION_RULES = {
  MAX_LIMIT: 100,
  DEFAULT_LIMIT: 20,
} as const;

// ==============================
// Schemas
// ==============================

export const paginationSchema = z.object({
  limit: z.coerce
    .number()
    .min(1, "Limit must be at least 1")
    .max(
      PAGINATION_RULES.MAX_LIMIT,
      `Max limit is ${PAGINATION_RULES.MAX_LIMIT}`
    )
    .default(PAGINATION_RULES.DEFAULT_LIMIT),

  page: z.coerce.number().min(1, "Page must be at least 1").default(1),

  // Cursor for infinite scrolling (optional, mutually exclusive with page in implementation)
  cursor: z.string().optional(),

  search: z
    .string()
    .trim()
    .transform(normalizeString)
    .optional()
    .transform((val) => (val === "" ? undefined : val)),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),

  // The specific column to sort by can be extended by the caller
  sortBy: z.string().optional(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

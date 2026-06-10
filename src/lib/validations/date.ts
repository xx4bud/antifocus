import { z } from "zod";
import { isExpired } from "../utils/date";

// ==============================
// Schemas
// ==============================

/**
 * Standard date schema. Coerces valid ISO strings or timestamps to Date objects.
 */
export const dateSchema = z.coerce.date();

export const optionalDateSchema = dateSchema.optional();

/**
 * Date that must be in the past.
 * E.g., Date of birth, historical events.
 */
export const pastDateSchema = z.coerce.date().refine((val) => isExpired(val), {
  message: "Date must be in the past",
});

/**
 * Date that must be in the future.
 * E.g., Expiration date, scheduled publication.
 */
export const futureDateSchema = z.coerce
  .date()
  .refine((val) => !isExpired(val), {
    message: "Date must be in the future",
  });

/**
 * Date range schema with start and end validation.
 */
export const dateRangeSchema = z
  .object({
    start: z.coerce.date(),
    end: z.coerce.date(),
  })
  .refine((data) => data.end >= data.start, {
    message: "End date must be exactly on or after start date",
    path: ["end"],
  });

export const optionalDateRangeSchema = dateRangeSchema.optional();

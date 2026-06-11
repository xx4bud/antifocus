import { z } from "zod/v4";
import { isExpired } from "../../utils/date";

/**
 * ISO 8601 datetime string regex patterns.
 * Supports standard ISO datetime strings (with or without milliseconds and timezone).
 */
const DATETIME_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;

/**
 * Timestamp schema (ISO 8601 with timezone).
 * Corresponds to Drizzle `timestampColumn()` — timestamp with timezone.
 */
export const timestampSchema = z
  .string()
  .regex(DATETIME_REGEX, "Must be a valid ISO 8601 datetime")
  .pipe(z.coerce.date());

export const optionalTimestampSchema = timestampSchema.optional();

/**
 * Timestamp that must be in the past.
 * E.g., Date of birth, historical events.
 */
export const pastTimestampSchema = timestampSchema.refine(
  (val) => isExpired(val),
  {
    message: "Timestamp must be in the past",
  }
);

/**
 * Timestamp that must be in the future.
 * E.g., Expiration date, scheduled publication.
 */
export const futureTimestampSchema = timestampSchema.refine(
  (val) => !isExpired(val),
  {
    message: "Timestamp must be in the future",
  }
);

/**
 * Timestamp range schema with start and end validation.
 */
export const timestampRangeSchema = z
  .object({
    start: timestampSchema,
    end: timestampSchema,
  })
  .refine((data) => data.end >= data.start, {
    message: "End timestamp must be exactly on or after start timestamp",
    path: ["end"],
  });

export const optionalTimestampRangeSchema = timestampRangeSchema.optional();

import { z } from "zod";

/**
 * Graceful boolean schema for form inputs.
 * Accepts true/false, "true"/"false", "1"/"0", "on"/"off"
 */
export const booleanSchema = z.preprocess((val) => {
  if (typeof val === "boolean") {
    return val;
  }
  if (typeof val === "string") {
    const lower = val.toLowerCase().trim();
    if (lower === "true" || lower === "1" || lower === "on") {
      return true;
    }
    if (lower === "false" || lower === "0" || lower === "off") {
      return false;
    }
  }
  if (typeof val === "number") {
    if (val === 1) {
      return true;
    }
    if (val === 0) {
      return false;
    }
  }
  return val;
}, z.boolean());

export const optionalBooleanSchema = booleanSchema.optional();

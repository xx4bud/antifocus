import {
  type CountryCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { z } from "zod";

// ==============================
// Rules
// ==============================

export const PHONE_RULES = {
  MIN: 10,
  MAX: 15,
} as const;

// ==============================
// Helpers
// ==============================

/**
 * Normalize phone number to E.164 format.
 * Defaults to Indonesian (+62) if no country code is provided.
 * "08123456789" → "+628123456789"
 * "+12133734253" → "+12133734253" (keeps valid international numbers)
 */
export const normalizePhone = (
  phone: string,
  defaultCountry: CountryCode = "ID"
): string => {
  const phoneNumber = parsePhoneNumberFromString(phone, defaultCountry);
  if (phoneNumber?.isValid()) {
    return phoneNumber.format("E.164");
  }
  // Return original if parsing fails, Zod will catch it in refine
  return phone;
};

// ==============================
// Schemas
// ==============================

export const phoneNumberSchema = z
  .string()
  .min(PHONE_RULES.MIN, "Phone number is too short")
  .max(PHONE_RULES.MAX, "Phone number is too long")
  .trim()
  .transform((val) => normalizePhone(val))
  .refine((val) => isValidPhoneNumber(val), {
    message: "Invalid phone number format",
  });

export const optionalPhoneNumberSchema = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val))
  .pipe(phoneNumberSchema.optional());

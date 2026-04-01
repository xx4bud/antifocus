import z from "zod";
import { normalizeString } from "../utils";

export function normalizePhoneNumber(v: string): string {
  return normalizeString(v).replace(/[\s\-()]/g, "");
}

export const PHONE_NUMBER_RULES = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 20,
  REGEX: /^\+?[0-9]+$/,
};

export function phoneNumberSchema() {
  return z.preprocess(
    normalizePhoneNumber,
    z
      .string()
      .min(PHONE_NUMBER_RULES.MIN_LENGTH, {
        message: `Nomor telepon minimal ${PHONE_NUMBER_RULES.MIN_LENGTH} karakter`,
      })
      .max(PHONE_NUMBER_RULES.MAX_LENGTH, {
        message: `Nomor telepon maksimal ${PHONE_NUMBER_RULES.MAX_LENGTH} karakter`,
      })
      .regex(PHONE_NUMBER_RULES.REGEX, {
        message: "Nomor telepon hanya boleh berisi angka",
      })
  );
}

export function validPhoneNumber(v: string) {
  return phoneNumberSchema().safeParse(v);
}

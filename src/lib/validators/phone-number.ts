import z from "zod";
import { normalizeString } from "~/utils/normalizers";

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
        message: "Nomor telepon terlalu pendek",
      })
      .max(PHONE_NUMBER_RULES.MAX_LENGTH, {
        message: "Nomor telepon terlalu panjang",
      })
      .regex(PHONE_NUMBER_RULES.REGEX, {
        message: "Nomor telepon hanya boleh berisi angka (dan + di awal)",
      })
  );
}

export type PhoneNumberSchema = z.infer<typeof phoneNumberSchema>;

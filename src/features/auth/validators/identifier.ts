import { z } from "zod";
import { emailSchema } from "~/lib/validators/email";
import { phoneNumberSchema } from "~/lib/validators/phone-number";
import { usernameSchema } from "~/lib/validators/username";

export function emailUsernameSchema() {
  const email = emailSchema();
  const username = usernameSchema();

  return z.union([
    email.refine((s) => email.safeParse(s).success, {
      message: "Format email tidak valid",
    }),
    username.refine((s) => username.safeParse(s).success, {
      message: "Format username tidak valid",
    }),
  ]);
}

export type EmailUsernameSchema = z.infer<typeof emailUsernameSchema>;

export function identifierSchema() {
  const email = emailSchema();
  const username = usernameSchema();
  const phoneNumber = phoneNumberSchema();

  return z
    .string()
    .trim()
    .min(1, { message: "Email/username/no. telepon wajib diisi" })
    .refine(
      (val) =>
        email.safeParse(val).success ||
        username.safeParse(val).success ||
        phoneNumber.safeParse(val).success,
      {
        message: "Gunakan email, username atau nomor telepon",
      }
    );
}

export type IdentifierSchema = z.infer<typeof identifierSchema>;

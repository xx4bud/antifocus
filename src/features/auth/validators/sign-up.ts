import { z } from "zod";
import { emailSchema } from "~/lib/validators/email";
import { nameSchema } from "~/lib/validators/name";
import { passwordSchema } from "~/lib/validators/password";
import { phoneNumberSchema } from "~/lib/validators/phone-number";

export function signUpSchema() {
  return z
    .object({
      name: nameSchema(),
      email: emailSchema(),
      phoneNumber: phoneNumberSchema(),
      password: passwordSchema(),
      confirmPassword: z.string().min(1, {
        message: "Konfirmasi kata sandi wajib diisi",
      }),
    })
    .refine((d) => d.password === d.confirmPassword, {
      message: "Konfirmasi kata sandi tidak cocok",
      path: ["confirmPassword"],
    });
}

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const signUpInput = signUpSchema();

export type SignUpData = z.infer<typeof signUpInput>;

import { z } from "zod";
import { emailSchema } from "@/lib/validators/email";
import { nameSchema } from "@/lib/validators/name";
import { passwordSchema } from "@/lib/validators/password";

/**
 * Validator for user registration
 */
export function signUpSchema() {
  return z.object({
    name: nameSchema(),
    email: emailSchema(),
    password: passwordSchema(),
  });
}

export type SignUpInput = z.input<ReturnType<typeof signUpSchema>>;
export type SignUpOutput = z.infer<ReturnType<typeof signUpSchema>>;

export function validSignUp(v: SignUpInput) {
  return signUpSchema().safeParse(v);
}

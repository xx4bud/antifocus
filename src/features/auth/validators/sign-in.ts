import z from "zod";
import { passwordSchema } from "@/lib/validators/password";
import { identifierSchema } from "./identifier";

export function signInSchema() {
  return z.object({
    identifier: identifierSchema(),
    password: passwordSchema(),
    rememberMe: z.boolean().default(false),
  });
}

export type SignInInput = z.input<ReturnType<typeof signInSchema>>;
export type SignInOutput = z.infer<ReturnType<typeof signInSchema>>;

export function validSignIn(v: SignInInput) {
  return signInSchema().safeParse(v);
}

import { z } from "zod";
import { identifierSchema } from "./identifier";

export function forgotPasswordSchema() {
  return z.object({
    identifier: identifierSchema(),
  });
}

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const forgotPasswordInput = forgotPasswordSchema();

export type ForgotPasswordData = z.infer<typeof forgotPasswordInput>;

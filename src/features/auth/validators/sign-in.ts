import { z } from "zod";
import { passwordSchema } from "~/lib/validators/password";
import { phoneNumberSchema } from "~/lib/validators/phone-number";
import { emailUsernameSchema, identifierSchema } from "./identifier";

export function signInEmailUsernameSchema() {
  return z.object({
    identifier: emailUsernameSchema(),
    password: passwordSchema(),
    rememberMe: z.boolean(),
  });
}

export type SignInEmailUsernameSchema = z.infer<
  typeof signInEmailUsernameSchema
>;

export function signInPhoneNumberSchema() {
  return z.object({
    identifier: phoneNumberSchema().refine(
      (val) => val !== undefined && val !== null,
      { message: "Nomor telepon wajib diisi" }
    ),
    password: passwordSchema(),
    rememberMe: z.boolean(),
  });
}
export type SignInPhoneNumberSchema = z.infer<typeof signInPhoneNumberSchema>;

export function signInUniversalSchema() {
  return z.object({
    identifier: identifierSchema(),
    password: passwordSchema(),
    rememberMe: z.boolean(),
  });
}

export type SignInUniversalSchema = z.infer<typeof signInUniversalSchema>;

export type SignInSchema =
  | SignInEmailUsernameSchema
  | SignInPhoneNumberSchema
  | SignInUniversalSchema;

export const signInUniversalInput = signInUniversalSchema();

export const signInEmailUsernameInput = signInEmailUsernameSchema();
export const signInPhoneNumberInput = signInPhoneNumberSchema();

export type SignInEmailUsernameData = z.infer<typeof signInEmailUsernameInput>;
export type SignInPhoneNumberData = z.infer<typeof signInPhoneNumberInput>;
export type SignInUniversalData = z.infer<typeof signInUniversalInput>;

export type SignInData =
  | SignInEmailUsernameData
  | SignInPhoneNumberData
  | SignInUniversalData;

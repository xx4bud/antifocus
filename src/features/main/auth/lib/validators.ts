import { z } from "zod";
import { emailSchema } from "@/lib/db/validations/email";
import { nameSchema } from "@/lib/db/validations/name";
import { passwordSchema } from "@/lib/db/validations/password";
import { usernameSchema } from "@/lib/db/validations/username";

export const signUpFormSchema = z
  .object({
    name: nameSchema,
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpData = z.infer<typeof signUpFormSchema>;

export const signInFormSchema = z.object({
  identifier: z.string().trim().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export type SignInData = z.infer<typeof signInFormSchema>;

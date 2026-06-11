import { z } from "zod/v4";
import { emailSchema } from "@/lib/validations/email";
import { nameSchema } from "@/lib/validations/name";
import {
  confirmPasswordRefine,
  passwordSchema,
} from "@/lib/validations/password";
import { usernameSchema } from "@/lib/validations/username";

// ==============================
// Authentication Validators
// ==============================

export const signInSchema = z.object({
  identifier: z.string().min(1, "Email or Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false).optional(),
});

export const signInFormSchema = signInSchema;
export type SignInInput = z.infer<typeof signInSchema>;
export type SignInData = SignInInput;

export const signUpSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(...confirmPasswordRefine);

export const signUpFormSchema = signUpSchema;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignUpData = SignUpInput;

// ==============================
// Password Management
// ==============================

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(...confirmPasswordRefine);

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ==============================
// User Management & Profile
// ==============================

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  username: usernameSchema.optional(),
  phoneNumber: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;

export const banUserSchema = z.object({
  banReason: z.string().min(5, "Reason is too short").max(500),
  banExpires: z.date().optional(),
});

export type BanUserData = z.infer<typeof banUserSchema>;

// ==============================
// Organization / Admin Switch
// ==============================

export const switchOrganizationSchema = z.object({
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type SwitchOrganizationInput = z.infer<typeof switchOrganizationSchema>;

export const impersonateUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export type ImpersonateUserInput = z.infer<typeof impersonateUserSchema>;

// ==============================
// Admin & Filters
// ==============================

export const userFiltersSchema = z.object({
  search: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export type UserFiltersInput = z.infer<typeof userFiltersSchema>;

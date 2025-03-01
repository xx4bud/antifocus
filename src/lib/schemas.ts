import { UserRole, UserStatus } from "./constants";
import * as z from "zod";

export const RegexSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const RegexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const SignUpFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .regex(
        new RegExp("^[a-zA-Z\\s]*$"),
        "Name must be alphabetic"
      ),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email")
      .regex(RegexEmail, "Invalid email"),
    password: z
      .string()
      .trim()
      .min(1, "Password is required")
      .regex(
        new RegExp(".*[A-Z].*"),
        "One uppercase character"
      )
      .regex(
        new RegExp(".*[a-z].*"),
        "One lowercase character"
      )
      .regex(new RegExp(".*\\d.*"), "One number")
      .regex(
        new RegExp(
          ".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"
        ),
        "One special character"
      )
      .max(32, "Password must be less than 32 characters"),
    confirmPassword: z
      .string()
      .trim()
      .min(1, "Confirm Password is required")
      .regex(
        new RegExp(".*[A-Z].*"),
        "One uppercase character"
      )
      .regex(
        new RegExp(".*[a-z].*"),
        "One lowercase character"
      )
      .regex(new RegExp(".*\\d.*"), "One number")
      .regex(
        new RegExp(
          ".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"
        ),
        "One special character"
      )
      .max(
        32,
        "Confirm Password must be less than 32 characters"
      ),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );
export type SignUpFormValue = z.infer<typeof SignUpFormSchema>;

export const SignInFormSchema = z
  .object({
    identifier: z
      .string()
      .trim()
      .min(1, "Email or username is required")
      .refine(
        (value) =>
          RegexEmail.test(value) || RegexSlug.test(value),
        {
          message: "Email or username is invalid",
        }
      ),
    password: z
      .string()
      .trim()
      .min(1, "Password is required")
      .regex(
        new RegExp(".*[A-Z].*"),
        "One uppercase character"
      )
      .regex(
        new RegExp(".*[a-z].*"),
        "One lowercase character"
      )
      .regex(new RegExp(".*\\d.*"), "One number")
      .regex(
        new RegExp(
          ".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"
        ),
        "One special character"
      )
      .max(32, "Password must be less than 32 characters"),
  })
  .refine(
    (data) => {
      const isEmail = RegexEmail.test(data.identifier);
      const isSlug = RegexSlug.test(data.identifier);
      return isEmail || isSlug;
    },
    {
      path: ["identifier"],
      message: "Email or username is invalid",
    }
  );
export type SignInFormValue = z.infer<typeof SignInFormSchema>;

export const MediaSchema = z.object({
  format: z.string().optional(),
  url: z.string().url().min(1, "URL harus diisi"),
  publicId: z.string().optional(),
  alt: z.string().optional(),
  order: z.coerce.number().int().nonnegative().default(0),
  width: z.coerce.number().int().nonnegative().default(0),
  height: z.coerce.number().int().nonnegative().default(0),
  size: z.coerce.number().int().nonnegative().default(0),
  metadata: z.record(z.unknown()).optional(),
});
export type MediaValue = z.infer<typeof MediaSchema>;

export const MediaFormSchema = z.object({
  media: MediaSchema.nullable(),
})
export type MediaFormValue = z.infer<typeof MediaFormSchema>;

export const CategoryFormSchema = z.object({
  media: z.array(MediaSchema).min(1, "Media harus diisi"),
  name: z.string().min(1, "Nama harus diisi").max(100, "Nama terlalu panjang"),
  slug: z.string().min(1, "Slug harus diisi").max(100, "Slug terlalu panjang").regex(RegexSlug, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung"),
  description: z.string().max(500, "Deskripsi terlalu panjang").optional(),
  featured: z.boolean().default(false),
  parentId: z.string().optional(),
});
export type CategoryFormValue = z.infer<typeof CategoryFormSchema>;

export const UserFormSchema = z.object({
  media: z.array(MediaSchema).min(1, "Media is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
});
export type UserFormValue = z.infer<typeof UserFormSchema>;

import { UserRole, UserStatus } from "./constants";
import * as z from "zod";

export const RegexSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

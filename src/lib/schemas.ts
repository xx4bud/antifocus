import { ProductStatus } from "@prisma/client";
import * as z from "zod";

const regexSlug = /^[a-zA-Z0-9._-]*$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SignUpSchema = z
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
      .regex(regexEmail, "Invalid email"),
    password: z
      .string()
      .trim()
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
      .min(1, "Password is required")
      .max(32, "Password must be less than 32 characters"),
    confirmPassword: z
      .string()
      .trim()
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
      .min(1, "Password is required")
      .max(32, "Password must be less than 32 characters"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

export type SignUpValues = z.infer<typeof SignUpSchema>;

export const SignInSchema = z
  .object({
    identifier: z
      .string()
      .trim()
      .min(1, "Email is required")
      .regex(regexEmail, "Invalid email")
      .or(
        z
          .string()
          .trim()
          .min(1, "Username is required")
          .regex(
            regexSlug,
            "username only contains letters, numbers, dots, and dashes"
          )
      ),
    password: z
      .string()
      .trim()
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
      .min(1, "Password is required")
      .max(32, "Password must be less than 32 characters"),
  })
  .refine(
    (data) => {
      const isEmail = regexEmail.test(data.identifier);
      const isSlug = regexSlug.test(data.identifier);
      return isEmail || isSlug;
    },
    {
      path: ["identifier"],
      message: "Email or username is invalid",
    }
  );

export type SignInValues = z.infer<typeof SignInSchema>;

export const PhotoSchema = z.object({
  url: z
    .string()
    .trim()
    .url("Invalid image URL.")
    .min(1, "Image URL is required."),
  publicId: z
    .string()
    .trim()
    .min(1, "Public ID of the image is required."),
});

export type PhotoValues = z.infer<typeof PhotoSchema>;

export const CampaignsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(250, "Name must be less than 250 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(
      3000,
      "Description must be less than 5000 characters"
    ),
  photos: z
    .array(PhotoSchema)
    .min(1, "At least one image is required"),
});

export type CampaignsValues = z.infer<
  typeof CampaignsSchema
>;

export const CategoriesSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(250, "Name must be less than 250 characters."),
  photos: z
    .array(PhotoSchema)
    .min(1, "At least one image is required."),
  subCategories: z
    .array(
      z.object({
        name: z
          .string()
          .trim()
          .min(1, "Name is required.")
          .max(
            250,
            "Name must be less than 250 characters."
          ),
        description: z
          .string()
          .trim()
          .min(
            10,
            "Description must be at least 10 characters."
          )
          .max(
            3000,
            "Description must be less than 5000 characters."
          ),
        photos: z
          .array(PhotoSchema)
          .min(1, "At least one image is required."),
      })
    )
    .min(1, "At least one subcategory is required."),
});

export type CategoriesValues = z.infer<
  typeof CategoriesSchema
>;

export const ProductVariantSchema = z.object({
  photos: z
    .array(PhotoSchema)
    .min(1, "At least one image is required."),
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(250, "Name must be less than 250 characters."),
  price: z.coerce
    .number()
    .min(1, "Variant price must be greater than 1"),
  stock: z.coerce
    .number()
    .int()
    .min(0, "Variant stock cannot be negative."),
});

export const ProductsSchema = z
  .object({
    photos: z
      .array(PhotoSchema)
      .min(1, "At least one image is required."),
    name: z
      .string()
      .trim()
      .min(1, "Name is required.")
      .max(250, "Name must be less than 250 characters."),
    description: z
      .string()
      .trim()
      .min(1, "Description is required.")
      .min(
        10,
        "Description must be at least 10 characters."
      )
      .max(
        3000,
        "Description must be less than 3000 characters."
      ),
    categories: z
      .array(z.string())
      .min(1, "At least one category is required."),
    status: z.nativeEnum(ProductStatus),
    price: z.coerce.number().optional(),
    stock: z.coerce.number().int().optional(),
    variants: z.array(ProductVariantSchema).optional(),
  })
  .refine(
    (data) =>
      (data.variants?.length || 0) > 0 ||
      (data.price !== undefined &&
        data.stock !== undefined),
    {
      message:
        "Either price and stock or variants must be provided.",
    }
  );

export type ProductsValues = z.infer<typeof ProductsSchema>;

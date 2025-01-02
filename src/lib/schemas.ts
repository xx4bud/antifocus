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

export const CampaignsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(10, "Name must be at least 10 characters")
    .max(250, "Name must be less than 250 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(
      5000,
      "Description must be less than 5000 characters"
    ),
  photos: z
    .object({
      url: z
        .string()
        .trim()
        .url("Invalid image URL")
        .min(1, "Url of image is required"),
      publicId: z
        .string()
        .trim()
        .min(1, "Public ID of image is required"),
    })
    .array()
    .min(1, "At least one image is required")
    .max(1, "Only one image is allowed"),
});

export type CampaignsValues = z.infer<
  typeof CampaignsSchema
>;

export const CategoriesSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(250, "Name must be less than 250 characters"),
  subCategories: z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Name is required")
        .max(250, "Name must be less than 250 characters"),
      description: z
        .string()
        .trim()
        .min(1, "Description is required")
        .max(
          5000,
          "Description must be less than 5000 characters"
        ),
      photos: z
        .object({
          url: z
            .string()
            .trim()
            .url("Invalid image URL")
            .min(1, "Url of image is required"),
          publicId: z
            .string()
            .trim()
            .min(1, "Public ID of image is required"),
        })
        .array()
        .min(1, "At least one image is required"),
    })
    .array()
    .min(1, "At least one subcategory is required"),
  photos: z
    .object({
      url: z
        .string()
        .trim()
        .url("Invalid image URL")
        .min(1, "Url of image is required"),
      publicId: z
        .string()
        .trim()
        .min(1, "Public ID of image is required"),
    })
    .array()
    .min(1, "At least one image is required"),
});

export type CategoriesValues = z.infer<
  typeof CategoriesSchema
>;

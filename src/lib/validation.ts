import * as z from "zod";

const regexSlug = /^[a-zA-Z0-9._-]*$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// SignUp Schema
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
      .email("Invalid email")
      .regex(regexEmail, "Invalid email"),
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

export type SignUpValues = z.infer<typeof SignUpSchema>;

// SignIn Schema
export const SignInSchema = z
  .object({
    identifier: z
      .string()
      .trim()
      .min(1, "Email or username is required")
      .refine(
        (value) =>
          regexEmail.test(value) || regexSlug.test(value),
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

// Photo Schema
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

// SubCategories Schema
export const SubCategoriesSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(250, "Name must be less than 250 characters"),
  photos: z
    .array(PhotoSchema)
    .min(1, "At least one image is required"),
});

export type SubCategoriesValues = z.infer<
  typeof SubCategoriesSchema
>;

// Category Schema
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
    .array(SubCategoriesSchema)
    .min(1, "At least one subcategory is required."),
});

export type CategoriesValues = z.infer<
  typeof CategoriesSchema
>;

// Specs Info Schema
export const SpecsInfoSchema = z.object({
  label: z.string().trim().min(1, "Label is required."),
  value: z.union([
    z.string().trim(),
    z
      .array(z.string().trim())
      .min(1, "Value array cannot be empty"),
  ]),
});

export type SpecsInfoValues = z.infer<
  typeof SpecsInfoSchema
>;

export const ShippingInfoSchema = z.object({
  weight: z.coerce
    .number()
    .nonnegative("Weight must be non-negative"),
  variantWeight: z.coerce
    .number()
    .nonnegative("Variant weight must be non-negative")
    .optional(),
});

export type ShippingInfoValues = z.infer<
  typeof ShippingInfoSchema
>;

export const WholesaleSchema = z.object({
  price: z.coerce
    .number()
    .nonnegative("Price must be non-negative"),
  minOrder: z.coerce
    .number()
    .int("Min order must be an integer.")
    .nonnegative("Min order must be non-negative"),
  maxOrder: z.coerce
    .number()
    .int("Max order must be an integer.")
    .nonnegative("Max order must be non-negative"),
});

export type WholesaleValues = z.infer<
  typeof WholesaleSchema
>;

export const VariantOptionSchema = z.object({
  value: z.string().trim().min(1, "Value is required."),
  price: z.coerce
    .number()
    .nonnegative("Price must be non-negative"),
  stock: z.coerce
    .number()
    .int("Stock must be an integer.")
    .nonnegative("Stock must be non-negative"),
  photos: z
    .array(PhotoSchema)
    .min(1, "At least one image is required."),
});

export type VariantOptionValues = z.infer<
  typeof VariantOptionSchema
>;

export const VariantKeySchema = z.object({
  label: z.string().trim().min(1, "Label is required."),
  value: z.string().trim().min(1, "Value is required."),
});

export type VariantKeyValues = z.infer<
  typeof VariantKeySchema
>;

export const VariantSchema = z.object({
  key: VariantKeySchema,
  options: z.array(VariantOptionSchema),
});

export type VariantValues = z.infer<typeof VariantSchema>;

export const SalesInfoSchema = z.object({
  price: z.coerce
    .number()
    .nonnegative("Price must be non-negative"),
  stock: z.coerce
    .number()
    .int("Stock must be an integer.")
    .nonnegative("Stock must be non-negative"),
  variations: z.array(VariantSchema).optional(),
  wholesale: z.array(WholesaleSchema).optional(),
});

export const ProductsSchema = z.object({
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
    .max(
      1000,
      "Description must be less than 1000 characters."
    ),
  subCategories: z
    .array(
      z.object({
        id: z.string().min(1, "Subcategory is required."),
      })
    )
    .min(1, "At least one subcategory is required."),
  specsInfo: z
    .array(SpecsInfoSchema)
    .min(1, "At least one spec is required."),
  salesInfo: z
    .array(SalesInfoSchema)
    .min(1, "Sales info is required."),
  shippingInfo: z
    .array(ShippingInfoSchema)
    .min(1, "At least one shipping info is required."),
});

export type ProductsValues = z.infer<typeof ProductsSchema>;

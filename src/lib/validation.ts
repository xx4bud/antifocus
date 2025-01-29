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
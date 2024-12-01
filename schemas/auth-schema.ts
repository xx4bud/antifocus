import * as z from 'zod';

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SignUpSchema = z
  .object({
    email: z
      .string()
      .trim()
      .regex(regexEmail, { message: 'Invalid email' })
      .min(1, 'Email is required'),
    password: z
      .string()
      .trim()
      .regex(new RegExp('.*[A-Z].*'), 'One uppercase character')
      .regex(new RegExp('.*[a-z].*'), 'One lowercase character')
      .regex(new RegExp('.*\\d.*'), 'One number')
      .regex(
        new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
        'One special character'
      )
      .min(1, 'Password is required')
      .max(32, 'Password must be less than 32 characters'),
    confirmPassword: z
      .string()
      .trim()
      .regex(new RegExp('.*[A-Z].*'), 'One uppercase character')
      .regex(new RegExp('.*[a-z].*'), 'One lowercase character')
      .regex(new RegExp('.*\\d.*'), 'One number')
      .regex(
        new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
        'One special character'
      )
      .min(1, 'Password is required')
      .max(32, 'Password must be less than 32 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type SignUpValues = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z
    .string()
    .trim()
    .regex(regexEmail, { message: 'Invalid email' })
    .min(1, 'Email is required'),
  password: z
    .string()
    .trim()
    .regex(new RegExp('.*[A-Z].*'), 'One uppercase character')
    .regex(new RegExp('.*[a-z].*'), 'One lowercase character')
    .regex(new RegExp('.*\\d.*'), 'One number')
    .regex(
      new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
      'One special character'
    )
    .min(1, 'Password is required')
    .max(32, 'Password must be less than 32 characters'),
});

export type SignInValues = z.infer<typeof SignInSchema>;

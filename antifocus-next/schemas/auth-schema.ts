import * as z from 'zod';

const requiredString = z.string().trim().min(1, 'Required');
const regexUsername = /^[a-zA-Z0-9._-]*$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SignUpSchema = z
  .object({
    email: requiredString.regex(regexEmail, 'Invalid email'),
    password: requiredString
      .regex(new RegExp('.*[A-Z].*'), 'One uppercase character')
      .regex(new RegExp('.*[a-z].*'), 'One lowercase character')
      .regex(new RegExp('.*\\d.*'), 'One number')
      .regex(
        new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
        'One special character'
      )
      .min(1, 'Password is required')
      .max(32, 'Password must be less than 32 characters'),
    confirmPassword: requiredString
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
  identifier: requiredString
    .regex(regexEmail, 'Invalid email')
    .or(requiredString.regex(regexUsername, 'Invalid username')),
  password: requiredString
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
.refine((data) => {
  const isEmail = regexEmail.test(data.identifier);
  const isUsername = regexUsername.test(data.identifier);
  return isEmail || isUsername;
}, {
  path: ['identifier'],
  message: 'Identifier must be a valid email or username',
});

export type SignInValues = z.infer<typeof SignInSchema>;

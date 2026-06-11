"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { emailSchema } from "@/lib/db/validations/email";
import { usernameSchema } from "@/lib/db/validations/username";
import { parseError } from "@/lib/utils/error";
import { tryCatchAsync } from "@/lib/utils/result";
import {
  type SignInData,
  type SignUpData,
  signInFormSchema,
  signUpFormSchema,
} from "./validators";

/**
 * Server Action to handle user sign up.
 */
export const signUpAction = async (data: SignUpData) =>
  tryCatchAsync(async () => {
    const validated = signUpFormSchema.parse(data);

    const response = await auth.api.signUpEmail({
      body: {
        email: validated.email,
        password: validated.password,
        name: validated.name,
        username: validated.username,
      },
      headers: await headers(),
    });

    return response;
  }, parseError);

/**
 * Server Action to handle user sign in using email or username.
 */
export const signInAction = async (data: SignInData) =>
  tryCatchAsync(async () => {
    const validated = signInFormSchema.parse(data);
    const identifier = validated.identifier.toLowerCase();

    const isEmail = identifier.includes("@");

    if (isEmail) {
      emailSchema.parse(identifier);
    } else {
      usernameSchema.parse(identifier);
    }

    if (isEmail) {
      const response = await auth.api.signInEmail({
        body: {
          email: identifier,
          password: validated.password,
        },
        headers: await headers(),
      });
      return response;
    }

    const response = await auth.api.signInUsername({
      body: {
        username: identifier,
        password: validated.password,
      },
      headers: await headers(),
    });
    return response;
  }, parseError);

/**
 * Server Action to handle user sign out.
 */
export const signOutAction = async () =>
  tryCatchAsync(async () => {
    await auth.api.signOut({
      headers: await headers(),
    });
    return { success: true };
  }, parseError);

/**
 * Server Action to handle user social sign in (e.g. Google OAuth).
 */
export const signInSocialAction = async (provider: "google") =>
  tryCatchAsync(async () => {
    const response = await auth.api.signInSocial({
      body: {
        provider,
        callbackURL: "/",
      },
      headers: await headers(),
    });
    return response;
  }, parseError);

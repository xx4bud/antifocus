"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { parseError } from "@/lib/utils/errors";
import type { AppResponse } from "@/lib/utils/types";
import { type SignInInput, validSignIn } from "../validators/sign-in";

/**
 * Server action for user authentication with layered architecture.
 * Supports email, username, and phone number login via Better Auth.
 */
export async function signInAction(values: SignInInput): Promise<AppResponse> {
  const parsed = validSignIn(values);

  if (!parsed.success) {
    return {
      success: false,
      error: parseError(parsed.error),
    };
  }

  const { identifier, password, rememberMe } = parsed.data;
  const commonBody = {
    password,
    dontRememberMe: !rememberMe,
  };

  try {
    const requestHeaders = await headers();
    let response: unknown;

    // Delegate to appropriate Better Auth provider based on identifier type
    switch (identifier.type) {
      case "email":
        response = await auth.api.signInEmail({
          body: { ...commonBody, email: identifier.value },
          headers: requestHeaders,
        });
        break;

      case "username":
        response = await auth.api.signInUsername({
          body: { ...commonBody, username: identifier.value },
          headers: requestHeaders,
        });
        break;

      case "phone_number":
        response = await auth.api.signInPhoneNumber({
          body: { ...commonBody, phoneNumber: identifier.value },
          headers: requestHeaders,
        });
        break;

      default:
        throw new Error("Metode masuk tidak didukung");
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: parseError(error),
    };
  }
}

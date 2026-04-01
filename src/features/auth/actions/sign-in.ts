"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { parseError } from "@/lib/utils/errors";
import type { AppResponse } from "@/lib/utils/types";
import { type SignInInput, validSignIn } from "../validators/sign-in";

/**
 * Server action for user authentication
 */
export async function signInAction(values: SignInInput): Promise<AppResponse> {
  const result = validSignIn(values);

  if (!result.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Data masuk tidak valid",
        context: result.error.flatten().fieldErrors,
      },
    };
  }

  const { identifier, password, rememberMe } = result.data;
  const commonBody = {
    password,
    dontRememberMe: !rememberMe,
  };

  try {
    let response: unknown;
    const requestHeaders = await headers();

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
        throw new Error("Tipe pengenal tidak valid");
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    const appError = parseError(error);

    return {
      success: false,
      error: {
        code: appError.code,
        message: appError.message,
        context: appError.context,
      },
    };
  }
}

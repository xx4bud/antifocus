"use server";

import { auth } from "@/lib/auth";
import { parseError } from "@/lib/utils/errors";
import type { AppResponse } from "@/lib/utils/types";
import { type SignUpInput, validSignUp } from "../validators/sign-up";

/**
 * Server action for user registration
 */
export async function signUpAction(values: SignUpInput): Promise<AppResponse> {
  const result = validSignUp(values);

  if (!result.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Data pendaftaran tidak valid",
        context: result.error.flatten().fieldErrors,
      },
    };
  }

  try {
    const response = await auth.api.signUpEmail({
      body: {
        email: result.data.email,
        password: result.data.password,
        name: result.data.name,
      },
    });

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

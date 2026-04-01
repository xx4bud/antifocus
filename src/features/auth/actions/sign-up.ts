"use server";

import { auth } from "@/lib/auth";
import { parseError } from "@/lib/utils/errors";
import type { AppResponse } from "@/lib/utils/types";
import { updateUserMetadata } from "../mutations/user";
import { getUserByEmail } from "../queries";
import { generateUsernameFromEmail } from "../utils/username";
import { type SignUpInput, validSignUp } from "../validators/sign-up";

/**
 * Server action for user registration with layered architecture.
 */
export async function signUpAction(values: SignUpInput): Promise<AppResponse> {
  const parsed = validSignUp(values);

  if (!parsed.success) {
    return {
      success: false,
      error: parseError(parsed.error),
    };
  }

  const { name, email, password } = parsed.data;

  try {
    // 1. Layered lookup check using predefined queries
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return {
        success: false,
        error: {
          code: "ACCOUNT_ALREADY_EXISTS",
          message:
            "Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.",
        },
      };
    }

    // 2. Main Better Auth registration
    const response = await auth.api.signUpEmail({
      body: { email, password, name },
    });

    if (!response?.user) {
      throw new Error("Failed to create user session");
    }

    // 3. Post-signup metadata enrichment (Unique Username)
    const suggestedUsername = generateUsernameFromEmail(email);

    await updateUserMetadata(response.user.id, {
      username: suggestedUsername,
    });

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

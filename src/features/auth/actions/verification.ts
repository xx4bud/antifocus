"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { parseError } from "@/lib/utils/errors";
import type { AppResponse } from "@/lib/utils/types";

/**
 * Server action for email verification.
 */
export async function verificationEmailAction(
  token: string
): Promise<AppResponse> {
  try {
    if (!token) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Token verifikasi tidak valid",
        },
      };
    }

    const result = await auth.api.verifyEmail({
      query: { token },
      headers: await headers(),
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: parseError(error),
    };
  }
}

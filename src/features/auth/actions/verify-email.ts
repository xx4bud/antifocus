"use server";

import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { parseError } from "~/utils/error";
import type { AppResponse } from "~/utils/types";
import { baseURL } from "~/utils/urls";

export async function verifyEmail(
  token: string
): Promise<AppResponse<unknown>> {
  try {
    if (!token) {
      return {
        success: false,
        error: {
          message: "Token verifikasi tidak valid",
          code: "invalid_token",
          statusCode: 400,
        },
      };
    }

    const headersList = await headers();
    const origin = headersList.get("origin") || "";

    const callbackURL = new URL("/verify-email", origin || baseURL);

    const response = await auth.api.verifyEmail({
      query: { token, callbackURL: callbackURL.toString() },
      headers: await headers(),
      asResponse: true,
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: {
          message:
            result?.message ||
            "Gagal memverifikasi email. Token mungkin sudah kadaluarsa.",
          code: result?.code || "verification_failed",
          statusCode: response.status,
        },
      };
    }

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

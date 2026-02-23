"use server";

import { headers } from "next/headers";
import {
  type ResetPasswordData,
  resetPasswordInput,
} from "~/features/auth/validators/reset-password";
import { auth } from "~/lib/auth";
import { parseError } from "~/utils/error";
import type { AppResponse } from "~/utils/types";

export async function resetPassword(
  data: ResetPasswordData
): Promise<AppResponse<unknown>> {
  try {
    const token = data.token;
    if (!token) {
      return {
        success: false,
        error: {
          message: "Token tidak valid",
          code: "invalid_token",
          statusCode: 400,
        },
      };
    }

    const parsed = resetPasswordInput.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error,
      };
    }

    const { password } = parsed.data;

    const response = await auth.api.resetPassword({
      headers: await headers(),
      body: {
        token,
        newPassword: password,
      },
      asResponse: true,
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: {
          message:
            result ?? "Gagal mereset kata sandi, silahkan coba lagi nanti",
          code: "reset_password_failed",
          statusCode: 400,
        },
      };
    }

    return {
      success: true,
      data: "Kata sandi berhasil direset",
    };
  } catch (error) {
    return {
      success: false,
      error: parseError(error),
    };
  }
}

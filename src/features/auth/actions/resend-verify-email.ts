"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { db } from "~/lib/db";
import { users } from "~/lib/db/schemas";
import { parseError } from "~/utils/error";
import type { AppResponse } from "~/utils/types";
import { baseURL } from "~/utils/urls";

export async function resendVerifyEmail(
  email: string
): Promise<AppResponse<unknown>> {
  try {
    if (!email) {
      return {
        success: false,
        error: {
          message: "Email wajib diisi",
          code: "email_required",
          statusCode: 400,
        },
      };
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return {
        success: false,
        error: {
          message: "Akun dengan email tersebut tidak ditemukan",
          code: "user_not_found",
          statusCode: 404,
        },
      };
    }

    if (user.emailVerified) {
      return {
        success: false,
        error: {
          message: "Email sudah diverifikasi",
          code: "email_already_verified",
          statusCode: 400,
        },
      };
    }

    const headersList = await headers();
    const origin = headersList.get("origin") || "";

    const callbackURL = new URL("/verify-email", origin || baseURL);

    const response = await auth.api.sendVerificationEmail({
      headers: headersList,
      body: {
        email: user.email,
        callbackURL: callbackURL.toString(),
      },
      asResponse: true,
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: {
          message:
            result?.message ||
            "Gagal mengirim email verifikasi. Silakan coba beberapa saat lagi.",
          code: result?.code || "send_verification_failed",
          statusCode: response.status,
        },
      };
    }

    return {
      success: true,
      data: "Email verifikasi telah dikirim. Silakan cek inbox Anda.",
    };
  } catch (error) {
    return {
      success: false,
      error: parseError(error),
    };
  }
}

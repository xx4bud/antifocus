"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import {
  type ForgotPasswordData,
  forgotPasswordInput,
} from "~/features/auth/validators/forgot-password";
import { auth } from "~/lib/auth";
import { db } from "~/lib/db";
import { users } from "~/lib/db/schemas";
import { emailSchema } from "~/lib/validators/email";
import { phoneNumberSchema } from "~/lib/validators/phone-number";
import { parseError } from "~/utils/error";
import type { AppResponse } from "~/utils/types";
import { baseURL } from "~/utils/urls";

export async function forgotPassword(
  data: ForgotPasswordData
): Promise<AppResponse<unknown>> {
  try {
    const parsed = forgotPasswordInput.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error,
      };
    }

    const { identifier } = parsed.data;

    const isEmail = emailSchema().safeParse(identifier).success;
    const isPhone = phoneNumberSchema().safeParse(identifier).success;

    if (!(isEmail || isPhone)) {
      return {
        success: false,
        error: {
          message: "Identifier tidak valid",
          code: "invalid_identifier",
          statusCode: 400,
        },
      };
    }

    const user = await db.query.users.findFirst({
      where: isEmail
        ? eq(users.email, identifier)
        : eq(users.phoneNumber, identifier),
    });

    if (!user) {
      return {
        success: false,
        error: {
          message: "User tidak ditemukan",
          code: "user_not_found",
          statusCode: 404,
        },
      };
    }

    if (isEmail) {
      const headersList = await headers();
      const origin = headersList.get("origin") || "";

      const link = new URL("/reset-password", origin || baseURL);

      const response = await auth.api.requestPasswordReset({
        headers: headersList,
        body: {
          email: user.email,
          redirectTo: link.toString(),
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
    } else if (isPhone) {
      // await auth.api.requestPasswordResetPhoneNumber({
      //   body: {
      //     phoneNumber: user.phoneNumber as string,
      //   },
      // });

      return {
        success: false,
        error: {
          message:
            "Permintaan lupa kata sandi nomor telepon belum diimplementasi",
          code: "phone_number_not_implemented",
          statusCode: 501,
        },
      };
    }

    return {
      success: true,
      data: "Jika akun terdaftar, kami telah mengirimkan email/sms untuk mereset kata sandi",
    };
  } catch (error) {
    return {
      success: false,
      error: parseError(error),
    };
  }
}

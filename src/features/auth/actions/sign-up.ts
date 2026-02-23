"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { generateUsernameFromEmail } from "~/features/auth/actions/generate-username";
import {
  type SignUpData,
  signUpInput,
} from "~/features/auth/validators/sign-up";
import { auth } from "~/lib/auth";
import { db } from "~/lib/db";
import { users } from "~/lib/db/schemas";
import { parseError } from "~/utils/error";
import type { AppResponse } from "~/utils/types";

export async function signUp(data: SignUpData): Promise<AppResponse<unknown>> {
  try {
    const parsed = signUpInput.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error,
      };
    }

    const { name, email, password, phoneNumber } = parsed.data;

    const existingUser = await db.query.users.findFirst({
      where: (user, { or: orFn, eq: eqFn }) =>
        orFn(
          eqFn(user.email, email),
          phoneNumber ? eqFn(user.phoneNumber, phoneNumber) : undefined
        ),
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return {
          success: false,
          error: {
            message: "Email sudah terdaftar",
            code: "email_already_exists",
            statusCode: 400,
          },
        };
      }
      if (phoneNumber && existingUser.phoneNumber === phoneNumber) {
        return {
          success: false,
          error: {
            message: "Nomor telepon sudah terdaftar",
            code: "phone_number_already_exists",
            statusCode: 400,
          },
        };
      }
    }

    const username = await generateUsernameFromEmail(email);

    if (!username) {
      return {
        success: false,
        error: {
          message: "Gagal membuat username",
          code: "username_generation_failed",
          statusCode: 500,
        },
      };
    }

    const response = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        username,
        phoneNumber,
      },
      asResponse: true,
      headers: await headers(),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: {
          message:
            result?.message ||
            "Gagal membuat akun. Silakan coba beberapa saat lagi.",
          code: result?.code || "auth_api_error",
          statusCode: response.status,
        },
      };
    }

    await db
      .update(users)
      .set({
        name,
        email,
        username,
        phoneNumber,
      })
      .where(eq(users.id, result.user.id));

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

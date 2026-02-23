"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import {
  type SignInData,
  signInUniversalSchema,
} from "~/features/auth/validators/sign-in";
import { auth } from "~/lib/auth";
import { verifyPassword } from "~/lib/auth/configs/password";
import { db } from "~/lib/db";
import { users } from "~/lib/db/schemas";
import type { User } from "~/lib/db/types";
import { emailSchema } from "~/lib/validators/email";
import { phoneNumberSchema } from "~/lib/validators/phone-number";
import { usernameSchema } from "~/lib/validators/username";
import { parseError } from "~/utils/error";
import type { AppResponse } from "~/utils/types";

type LoginType = "email" | "username" | "phone" | null;

function determineLoginType(identifier: string): LoginType {
  const isEmail = emailSchema().safeParse(identifier).success;
  const isUsername = usernameSchema().safeParse(identifier).success;
  const isPhone = phoneNumberSchema().safeParse(identifier).success;

  if (isEmail) {
    return "email";
  }
  if (isUsername) {
    return "username";
  }
  if (isPhone) {
    return "phone";
  }
  return null;
}

async function findUserByIdentifier(identifier: string, loginType: LoginType) {
  if (!loginType) {
    return null;
  }

  const conditions: ReturnType<typeof eq>[] = [];
  if (loginType === "email") {
    conditions.push(eq(users.email, identifier));
  }
  if (loginType === "username") {
    conditions.push(eq(users.username, identifier));
  }
  if (loginType === "phone") {
    conditions.push(eq(users.phoneNumber, identifier));
  }

  if (conditions.length === 0) {
    return null;
  }

  const user = await db.query.users.findFirst({
    where: (_user, { or }) => or(...conditions),
    with: {
      accounts: true,
    },
  });
  return user;
}

function checkUserBanStatus(
  user: typeof users.$inferSelect
): AppResponse<never> | null {
  if (!user.banned) {
    return null;
  }

  let message = "Akun telah di banned";
  if (user.banReason) {
    message += ` Karena ${user.banReason}`;
  }
  if (user.banExpires && new Date(user.banExpires) > new Date()) {
    message += `Sampai dengan ${new Date(user.banExpires).toLocaleString()}`;
  }
  return {
    success: false,
    error: {
      message,
      code: "user_banned",
      statusCode: 403,
    },
  };
}

async function performAuthSignIn(
  loginType: LoginType,
  identifier: string,
  password: string,
  rememberMe: boolean
): Promise<globalThis.Response> {
  if (loginType === "email") {
    return await auth.api.signInEmail({
      body: { email: identifier, password, rememberMe },
      asResponse: true,
      headers: await headers(),
    });
  }
  if (loginType === "username") {
    return await auth.api.signInUsername({
      body: { username: identifier, password, rememberMe },
      asResponse: true,
      headers: await headers(),
    });
  }
  if (loginType === "phone") {
    return await auth.api.signInPhoneNumber({
      body: { phoneNumber: identifier, password, rememberMe },
      asResponse: true,
      headers: await headers(),
    });
  }
  throw new Error("Invalid login type");
}

export async function signIn(
  data: SignInData
): Promise<AppResponse<User | undefined>> {
  try {
    const parsed = signInUniversalSchema().safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error,
      };
    }

    const { identifier, password, rememberMe = false } = parsed.data;

    const loginType = determineLoginType(identifier);

    if (!loginType) {
      return {
        success: false,
        error: {
          message: "Format identifier tidak dikenali (Email/Username/Phone)",
          code: "invalid_identifier_format",
          statusCode: 400,
        },
      };
    }

    const existingUser = await findUserByIdentifier(identifier, loginType);

    if (!existingUser) {
      return {
        success: false,
        error: {
          message: "Akun tidak ditemukan",
          code: "user_not_found",
          statusCode: 404,
        },
      };
    }

    const emailAccount = existingUser.accounts?.find(
      (a) => a.providerId === "credential"
    );

    if (!emailAccount?.password) {
      return {
        success: false,
        error: {
          message:
            "Akun belum memiliki kata sandi, coba masuk dengan metode lain",
          code: "no_password_set",
          statusCode: 400,
        },
      };
    }

    const passwordMatch = await verifyPassword(password, emailAccount.password);

    if (!passwordMatch) {
      return {
        success: false,
        error: {
          message: "Kata sandi salah",
          code: "invalid_password",
          statusCode: 401,
        },
      };
    }

    const banCheck = checkUserBanStatus(existingUser);
    if (banCheck) {
      return banCheck;
    }

    const response = await performAuthSignIn(
      loginType,
      identifier,
      password,
      rememberMe
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const code = result?.code || "auth_api_error";

      if (code === "EMAIL_NOT_VERIFIED") {
        return {
          success: false,
          error: {
            message: "Email belum diverifikasi",
            code: "EMAIL_NOT_VERIFIED",
            statusCode: 403,
          },
        };
      }

      return {
        success: false,
        error: {
          message:
            result?.message ||
            "Gagal masuk akun. Silakan coba beberapa saat lagi.",
          code,
          statusCode: response.status,
        },
      };
    }

    return {
      success: true,
      data: result.user,
    };
  } catch (error) {
    return {
      success: false,
      error: parseError(error),
    };
  }
}

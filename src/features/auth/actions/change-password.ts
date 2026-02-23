"use server";

import { headers } from "next/headers";
import {
  type ChangePasswordData,
  changePasswordInput,
} from "~/features/auth/validators/change-password";
import { auth } from "~/lib/auth";
import { parseError } from "~/utils/error";
import type { AppResponse } from "~/utils/types";

export async function changePassword(
  data: ChangePasswordData
): Promise<AppResponse<unknown>> {
  try {
    const parsed = changePasswordInput.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error,
      };
    }

    const { currentPassword, newPassword } = parsed.data;

    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword,
        newPassword,
      },
    });

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      error: parseError(error),
    };
  }
}

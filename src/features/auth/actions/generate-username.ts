"use server";

import type { AppResponse } from "@/lib/utils/types";
import { generateUsernameFromEmail } from "../utils/username";

export async function generateUsernameAction(
  email: string
): Promise<AppResponse<{ username: string }>> {
  try {
    const username = generateUsernameFromEmail(email);
    return { success: true, data: { username } };
  } catch (_error) {
    return {
      success: false,
      error: {
        code: "GENERATION_ERROR",
        message: "Gagal membuat saran username",
      },
    };
  }
}

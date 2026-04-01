"use server";

import { parseError } from "@/lib/utils/errors";
import type { AppResponse } from "@/lib/utils/types";
import { getUserByUsername } from "../queries";
import { generateUsernameFromEmail } from "../utils/username";

/**
 * Server action for generating a unique username suggestion.
 */
export async function generateUsernameAction(
  email: string
): Promise<AppResponse<{ username: string }>> {
  try {
    const username = generateUsernameFromEmail(email);

    // Check availability via layered query
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      const uniqueUsername = `${username}${Math.floor(Math.random() * 100)}`;
      return {
        success: true,
        data: { username: uniqueUsername },
      };
    }

    return {
      success: true,
      data: { username },
    };
  } catch (error) {
    return {
      success: false,
      error: parseError(error),
    };
  }
}

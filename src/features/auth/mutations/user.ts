"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { type NewUser, type User, users } from "@/lib/db/schema/auth";

/**
 * Update user metadata
 * @param id User ID to update
 * @param data Partial user data
 */
export async function updateUserMetadata(
  id: string,
  data: Partial<NewUser>
): Promise<User | null> {
  const [updatedUser] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  return updatedUser ?? null;
}

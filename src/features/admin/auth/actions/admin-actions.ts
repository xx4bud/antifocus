"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { db, schema } from "~/lib/db";

export async function banUser(userId: string, reason?: string) {
  await auth.api.banUser({
    headers: await headers(),
    body: {
      userId,
      banReason: reason,
    },
  });
  revalidatePath("/admin/users");
}

export async function unbanUser(userId: string) {
  await auth.api.unbanUser({
    headers: await headers(),
    body: { userId },
  });
  revalidatePath("/admin/users");
}

export async function setUserRole(userId: string, role: string) {
  await db
    .update(schema.users)
    .set({ role })
    .where(eq(schema.users.id, userId));
  revalidatePath("/admin/users");
}

export async function revokeSession(sessionToken: string) {
  await auth.api.revokeSession({
    headers: await headers(),
    body: { token: sessionToken },
  });
  revalidatePath("/admin/sessions");
}

export async function removeUser(userId: string) {
  await auth.api.removeUser({
    headers: await headers(),
    body: { userId },
  });
  revalidatePath("/admin/users");
}

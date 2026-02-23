import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { users } from "~/lib/db/schemas";

export async function generateUsernameFromEmail(
  email: string
): Promise<string> {
  if (!email) {
    throw new Error("Email is required");
  }

  const baseUsername =
    email.split("@")[0] ?? "".replace(/[^a-z0-9._-]/g, "").substring(0, 20);

  const existingUser = await db.query.users.findFirst({
    where: eq(users.username, baseUsername),
  });

  if (!existingUser) {
    return baseUsername;
  }

  let isUnique = false;
  let newUsername = baseUsername;

  while (!isUnique) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    newUsername = `${baseUsername}${randomSuffix}`;

    const check = await db.query.users.findFirst({
      where: eq(users.username, newUsername),
    });

    if (!check) {
      isUnique = true;
    }
  }

  return newUsername;
}

import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import { accounts, users } from "@/lib/db/schema";
import { ENTITY_STATUS, USER_ROLE } from "@/lib/db/schema/enums";
import { hashPassword } from "@/lib/utils/hash";
import type { SeedContext } from "./seed-context";

export const seedAuth = async (ctx: SeedContext) => {
  console.log("🌱 Seeding Auth...");

  const hashResult = await hashPassword("password123");
  const hashedPassword = hashResult.ok ? hashResult.value : "";

  const userSeeds = [
    {
      id: ctx.users.superadminId,
      name: "Super Admin",
      email: "superadmin@antifocus.my.id",
      emailVerified: true,
      role: USER_ROLE.SUPERADMIN,
      status: ENTITY_STATUS.ACTIVE,
    },
    {
      id: ctx.users.memberId,
      name: "Org Member",
      email: "member@antifocus.my.id",
      emailVerified: true,
      role: USER_ROLE.USER,
      status: ENTITY_STATUS.ACTIVE,
    },
    {
      id: ctx.users.guestUserId,
      name: "Guest User",
      email: "user@antifocus.my.id",
      emailVerified: true,
      role: USER_ROLE.USER,
      status: ENTITY_STATUS.ACTIVE,
    },
  ];

  for (const user of userSeeds) {
    await db.insert(users).values(user);

    await db.insert(accounts).values({
      id: createId(),
      userId: user.id,
      providerId: "credential",
      accountId: user.email,
      password: hashedPassword,
    });
  }
};

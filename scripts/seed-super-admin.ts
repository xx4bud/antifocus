import { eq } from "drizzle-orm";
import { hashPassword } from "~/lib/auth/configs/password";
import { db } from "~/lib/db";
import { accounts, users } from "~/lib/db/schemas";

export const seedSuperAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!(adminEmail && adminPassword)) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD env vars are required for seeding super admin."
    );
  }

  let user = await db.query.users.findFirst({
    where: eq(users.email, adminEmail),
  });

  if (user) {
    if (user.role !== "super_admin") {
      [user] = await db
        .update(users)
        .set({ role: "super_admin" })
        .where(eq(users.id, user.id))
        .returning();
      console.log(`Updated user '${adminEmail}' to super_admin role.`);
    } else {
      console.log(`User '${adminEmail}' already exists as super_admin.`);
    }
  } else {
    [user] = await db
      .insert(users)
      .values({
        name: "Super Admin",
        email: adminEmail,
        username: "superadmin",
        role: "super_admin",
        emailVerified: true,
      })
      .returning();
    console.log(`Created super admin user '${adminEmail}'.`);
  }

  if (!user) {
    throw new Error("Failed to create super admin user.");
  }

  const existingAccount = await db.query.accounts.findFirst({
    where: (accounts, { and, eq }) =>
      and(eq(accounts.userId, user.id), eq(accounts.providerId, "credential")),
  });

  if (existingAccount) {
    await db
      .update(accounts)
      .set({ password: await hashPassword(adminPassword) })
      .where(eq(accounts.id, existingAccount.id));
    console.log(`Updated credentials password for '${adminEmail}'.`);
  } else {
    await db.insert(accounts).values({
      userId: user.id,
      accountId: adminEmail,
      providerId: "credential",
      password: await hashPassword(adminPassword),
    });
    console.log(`Created credentials account for '${adminEmail}'.`);
  }

  // const existingMember = await db.query.members.findFirst({
  //   where: (members, { and, eq }) =>
  //     and(
  //       eq(members.organizationId, organizationId),
  //       eq(members.userId, user.id)
  //     ),
  // });

  // if (existingMember) {
  //   console.log(`Super admin is already a member of 'Antifocus' organization.`);
  // } else {
  //   await db.insert(members).values({
  //     organizationId,
  //     userId: user.id,
  //     role: "owner",
  //   });
  //   console.log(`Added super admin to 'Antifocus' organization as owner.`);
  // }
};

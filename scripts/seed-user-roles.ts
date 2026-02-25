import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { userRoles } from "~/lib/db/schemas";

export const seedUserRoles = async () => {
  console.log("Seeding global user roles...");

  const defaultRoles = [
    {
      role: "user",
      permission: {
        profile: true,
        orders: ["read"],
      },
      isSystem: true,
      enabled: true,
      position: "3",
    },
    {
      role: "member",
      permission: {
        profile: true,
        products: ["read"],
        orders: ["read", "create"],
        customers: ["read"],
      },
      isSystem: true,
      enabled: true,
      position: "2",
    },
    {
      role: "admin",
      permission: {
        profile: true,
        products: true,
        orders: true,
        customers: true,
        settings: true,
      },
      isSystem: true,
      enabled: true,
      position: "1",
    },
    {
      role: "super_admin",
      permission: { all: true },
      isSystem: true,
      enabled: true,
      position: "0",
    },
  ];

  for (const roleData of defaultRoles) {
    const existing = await db.query.userRoles.findFirst({
      where: eq(userRoles.role, roleData.role),
    });

    if (existing) {
      console.log(`  ℹ️ User role '${roleData.role}' already exists.`);
    } else {
      await db.insert(userRoles).values(roleData);
      console.log(`  ✅ Created user role '${roleData.role}'.`);
    }
  }

  console.log("User role seeding complete.");
};

import { and, eq, isNull } from "drizzle-orm";
import { db } from "~/lib/db";
import {
  customers,
  members,
  organizationRoles,
  organizations,
  users,
} from "~/lib/db/schemas";
import { SYSTEM_ROLE } from "~/lib/db/schemas/constants";

export const seedOrganization = async () => {
  console.log("Seeding default organization...");

  // Find the super admin user
  const superAdmin = await db.query.users.findFirst({
    where: eq(users.role, SYSTEM_ROLE.super_admin),
  });

  if (!superAdmin) {
    console.warn(
      "⚠️ No super admin found. Run seed-super-admin first. Skipping organization seed."
    );
    return;
  }

  // Upsert organization
  let org = await db.query.organizations.findFirst({
    where: eq(organizations.slug, "antifocus"),
  });

  if (org) {
    console.log("ℹ️ Organization 'Antifocus' already exists.");
  } else {
    [org] = await db
      .insert(organizations)
      .values({
        name: "Antifocus",
        slug: "antifocus",
        status: "active",
        settings: {
          currency: "IDR",
          timezone: "Asia/Jakarta",
          locale: "id-ID",
        },
      })
      .returning();
    console.log("✅ Created 'Antifocus' organization.");
  }

  if (!org) {
    throw new Error("Failed to create organization.");
  }

  // Seed default org roles
  const defaultRoles = [
    {
      role: "owner",
      permission: { all: true },
      isSystem: true,
      position: "0",
    },
    {
      role: "admin",
      permission: {
        products: true,
        orders: true,
        customers: true,
        settings: true,
        members: true,
      },
      isSystem: true,
      position: "1",
    },
    {
      role: "member",
      permission: {
        products: ["read"],
        orders: ["read", "create", "update"],
        customers: ["read", "create"],
      },
      isSystem: true,
      position: "2",
    },
  ];

  for (const roleData of defaultRoles) {
    const existing = await db.query.organizationRoles.findFirst({
      where: and(
        eq(organizationRoles.organizationId, org.id),
        eq(organizationRoles.role, roleData.role)
      ),
    });

    if (!existing) {
      await db.insert(organizationRoles).values({
        organizationId: org.id,
        ...roleData,
      });
      console.log(`  ✅ Created org role '${roleData.role}'.`);
    }
  }

  // Add super admin as owner member
  const existingMember = await db.query.members.findFirst({
    where: and(
      eq(members.organizationId, org.id),
      eq(members.userId, superAdmin.id)
    ),
  });

  if (!existingMember) {
    await db.insert(members).values({
      organizationId: org.id,
      userId: superAdmin.id,
      role: "owner",
    });
    console.log("✅ Added super admin as organization owner.");
  }

  // Create a walk-in customer for POS/manual orders
  const existingWalkin = await db.query.customers.findFirst({
    where: and(
      eq(customers.organizationId, org.id),
      isNull(customers.userId),
      eq(customers.name, "Walk-in Customer")
    ),
  });

  if (!existingWalkin) {
    await db.insert(customers).values({
      organizationId: org.id,
      name: "Walk-in Customer",
      email: "walkin@antifocus.com",
      metadata: { isDefault: true },
    });
    console.log("✅ Created walk-in customer.");
  }

  console.log("Organization seeding complete.");
};

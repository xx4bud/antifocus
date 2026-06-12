import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import {
  branches,
  customers,
  members,
  organizations,
  suppliers,
} from "@/lib/db/schema";
import { BRANCH_STATUS, ENTITY_STATUS, ORG_ROLE } from "@/lib/db/schema/enums";
import type { SeedContext } from "./seed-context";

export const seedOrg = async (ctx: SeedContext) => {
  console.log("🌱 Seeding Org...");

  // 1. Organization
  await db.insert(organizations).values({
    id: ctx.org.orgId,
    name: "Antifocus",
    slug: "antifocus",
    status: ENTITY_STATUS.ACTIVE,
  });

  // 2. Memberships
  await db.insert(members).values([
    {
      id: createId(),
      organizationId: ctx.org.orgId,
      userId: ctx.users.superadminId,
      role: ORG_ROLE.OWNER,
      status: ENTITY_STATUS.ACTIVE,
    },
    {
      id: ctx.org.memberRecordId,
      organizationId: ctx.org.orgId,
      userId: ctx.users.memberId,
      role: ORG_ROLE.ADMIN,
      status: ENTITY_STATUS.ACTIVE,
    },
  ]);

  // 3. Branches
  await db.insert(branches).values({
    id: ctx.org.branchId,
    organizationId: ctx.org.orgId,
    name: "Main Branch",
    status: BRANCH_STATUS.OPEN,
  });

  // 4. Customers
  await db.insert(customers).values({
    id: ctx.org.customerId,
    organizationId: ctx.org.orgId,
    userId: ctx.users.guestUserId,
    name: "Guest User",
    phoneNumber: "+6281234567890",
    status: ENTITY_STATUS.ACTIVE,
  });

  // 5. Suppliers
  await db.insert(suppliers).values({
    id: ctx.org.supplierId,
    organizationId: ctx.org.orgId,
    name: "Main Supplier",
    phoneNumber: "+6281298765432",
    status: ENTITY_STATUS.ACTIVE,
  });
};

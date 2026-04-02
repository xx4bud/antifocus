import { db } from "@/lib/db";
import { userRoles } from "@/lib/db/schema/auth";
import { generateId } from "@/lib/utils/ids";

export async function seedUserRoles() {
  console.info("👑 Seeding user roles...");

  const roles = ["user", "admin", "super_admin"];

  try {
    for (const role of roles) {
      await db
        .insert(userRoles)
        .values({
          id: generateId(),
          role,
          system: true,
          enabled: true,
        })
        .onConflictDoNothing({ target: userRoles.role });
    }
    console.info(`✅ Seeded ${roles.length} system roles successfully.`);
  } catch (error) {
    console.error("❌ Failed to seed user roles:", error);
    throw error;
  }
}

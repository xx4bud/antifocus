import { db } from "@/lib/db";
import { members, organizations } from "@/lib/db/schema/organization";
import { generateId } from "@/lib/utils/ids";

export async function seedOrganization(ownerUserId: string) {
  console.info("🏢 Seeding default organization...");

  const orgId = generateId();

  try {
    const existingList = await db.select().from(organizations);
    const existing = existingList[0];
    if (existing) {
      console.info("⚠️ Organization(s) already exist, skipping...");
      return existing.id;
    }

    // Insert generic starting organization
    await db.insert(organizations).values({
      id: orgId,
      name: "Antifocus HQ",
      slug: "antifocus-hq",
      status: "active",
    });

    // Assign the super admin as the owner of this organization
    await db.insert(members).values({
      id: generateId(),
      organizationId: orgId,
      userId: ownerUserId,
      role: "owner",
      status: "active",
    });

    console.info("✅ Seeded default organization and owner successfully.");
    console.info("   - Organization Name: Antifocus HQ");
    console.info("   - Slug: antifocus-hq");

    return orgId;
  } catch (error) {
    console.error("❌ Failed to seed organization:", error);
    throw error;
  }
}

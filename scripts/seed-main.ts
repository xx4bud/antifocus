import { seedOrganization } from "./seed-organization";
import { seedReset } from "./seed-reset";
import { seedSuperAdmin } from "./seed-super-admin";
import { seedUserRoles } from "./seed-user-roles";

async function main() {
  console.info("🌱 Starting database seed script...\n");

  try {
    // 1. Reset tables with CASCADE
    await seedReset();

    // 2. Inject global standard User Roles
    await seedUserRoles();

    // 3. Inject default super_admin and retrieve their ID
    const superAdminId = await seedSuperAdmin();

    // 4. Inject HQ organization using the superAdmin as its initial owner
    await seedOrganization(superAdminId);

    console.info("\n🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n💥 Error during database seeding:", error);
    process.exit(1);
  }
}

main();

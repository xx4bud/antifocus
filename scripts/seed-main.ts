import { seedMarketing } from "./seed-marketing";
import { seedOrganization } from "./seed-organization";
import { seedProducts } from "./seed-products";
import { seedReset } from "./seed-reset";
import { seedSuperAdmin } from "./seed-super-admin";
import { seedUserRoles } from "./seed-user-roles";

const main = async () => {
  try {
    console.log("🚀 Starting db seed...\n");

    // 1. clean all tables
    await seedReset();
    console.log();

    // 2. global user roles
    await seedUserRoles();
    console.log();

    // 3. super admin user + credentials
    await seedSuperAdmin();
    console.log();

    // 4. default organization + roles + walk-in customer
    await seedOrganization();
    console.log();

    // 5. sample categories + products + variants
    await seedProducts();
    console.log();

    // 6. marketing banners
    await seedMarketing();
    console.log();

    console.log("🎉 Seeding complete successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

main();

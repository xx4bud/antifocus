import { seedReset } from "./seed-reset";
import { seedSuperAdmin } from "./seed-super-admin";

const main = async () => {
  try {
    console.log("Starting db seed...");

    // 1. clean
    await seedReset();

    // 2. seed super admin
    await seedSuperAdmin();

    console.log("Seeding complete successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

main();

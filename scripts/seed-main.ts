import { seedReset } from "./seed-reset";

const main = async () => {
  try {
    console.log("Starting db seed...");

    // 1. clean
    await seedReset();

    console.log("Seeding complete successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

main();

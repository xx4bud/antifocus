import { seedAuth } from "./seed-auth";
import { seedCatalog } from "./seed-catalog";
import { createSeedContext } from "./seed-context";
import { seedCore } from "./seed-core";
import { seedFinance } from "./seed-finance";
import { seedMarketing } from "./seed-marketing";
import { seedOrder } from "./seed-order";
import { seedOrg } from "./seed-org";
import { seedProduction } from "./seed-production";
import { seedReset } from "./seed-reset";
import { seedSupply } from "./seed-supply";
import { seedTaxonomy } from "./seed-taxonomy";

const main = async () => {
  console.log("🚀 Starting comprehensive database seeding...");

  // 1. Reset all database tables (TRUNCATE CASCADE)
  await seedReset();

  // 2. Initialize shared context
  const ctx = createSeedContext();

  // 3. Execute seeds in dependency order
  await seedAuth(ctx);
  await seedOrg(ctx);
  await seedCore(ctx);
  await seedTaxonomy(ctx);
  await seedFinance(ctx);
  await seedCatalog(ctx);
  await seedSupply(ctx);
  await seedOrder(ctx);
  await seedProduction(ctx);
  await seedMarketing(ctx);

  console.log("🔑 Login Superadmin: superadmin@antifocus.my.id / password123");
  console.log(
    "✨ Seeding process completed successfully! All 10 domains seeded."
  );
  process.exit(0);
};

main().catch((e) => {
  console.error("❌ Seeding failed with error:", e);
  process.exit(1);
});

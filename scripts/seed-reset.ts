import { sql } from "drizzle-orm";
import { db } from "~/lib/db";

export const seedReset = async () => {
  console.log("Resetting database...");

  await db.execute(sql`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE "' || r.tablename || '" CASCADE';
      END LOOP;
    END $$;
  `);

  console.log("Database reset successfully.");
};

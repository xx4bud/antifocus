import { hash } from "@node-rs/argon2";
import { db } from "@/lib/db";
import { accounts, users } from "@/lib/db/schema/auth";
import { generateId } from "@/lib/utils/ids";

export async function seedSuperAdmin() {
  console.info("🦸 Seeding super admin...");

  const adminEmail = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!(adminEmail && password)) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  }

  try {
    // Check if super admin already exists
    const existing = await db.query.users.findFirst({
      where: (table, { eq }) => eq(table.email, adminEmail),
    });

    if (existing) {
      console.info("⚠️ Super admin already exists, skipping...");
      return existing.id;
    }

    const userId = generateId();

    // Insert the user explicitly
    await db.insert(users).values({
      id: userId,
      name: "Antifocus Super Admin",
      email: adminEmail,
      emailVerified: true,
      role: "super_admin",
      status: "active",
      username: "admin",
    });

    // Hash password using default node-rs/argon2 params
    const passwordHash = await hash(password, {
      memoryCost: 19_456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // Create the credentials account for better-auth
    await db.insert(accounts).values({
      id: generateId(),
      accountId: userId, // Using userId as accountId for credential provider
      providerId: "credential",
      userId,
      password: passwordHash,
    });

    console.info("✅ Seeded super admin successfully.");
    console.info(`   - Email: ${adminEmail}`);
    console.info(`   - Password: ${password}`);

    return userId;
  } catch (error) {
    console.error("❌ Failed to seed super admin:", error);
    throw error;
  }
}

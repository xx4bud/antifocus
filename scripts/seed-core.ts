import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import { addresses, files, sequences, settings } from "@/lib/db/schema";
import { ADDRESS_TYPE } from "@/lib/db/schema/enums";
import type { SeedContext } from "./seed-context";

// Verified IDs from check-images.ts
const unsplashIds = [
  "photo-1523381210434-271e8be1f52b",
  "photo-1483985988355-763728e1935b",
  "photo-1541099649105-f69ad21f3246",
  "photo-1521572267360-ee0c2909d518",
  "photo-1562157873-818bc0726f68",
  "photo-1556911220-e15b29be8c8f",
  "photo-1620799140408-edc6dcb6d633",
  "photo-1576995853123-5a10305d93c0",
  "photo-1548883354-7622d03aca27",
  "photo-1624378439575-d8705ad7ae80",
  "photo-1551854838-212c50b4c184",
  "photo-1591195853828-11db59a44f6b",
  "photo-1539185441755-769473a23570",
  "photo-1588850561407-ed78c282e89b",
  "photo-1618354691373-d851c5c3a990",
  "photo-1544816155-12df9643f363",
];

export const seedCore = async (ctx: SeedContext) => {
  console.log("🌱 Seeding Core...");

  // 1. Files
  const fileSeeds = unsplashIds.map((id) => {
    const fileId = createId();
    ctx.files[id] = fileId; // Store for later
    return {
      id: fileId,
      organizationId: ctx.org.orgId,
      providerId: "unsplash",
      name: `unsplash-${id}.jpg`,
      url: `https://images.unsplash.com/${id}?w=800&q=80`,
      mime: "image/jpeg",
      public: true,
    };
  });

  for (const file of fileSeeds) {
    await db.insert(files).values(file);
  }

  // 2. Addresses
  await db.insert(addresses).values({
    id: createId(),
    organizationId: ctx.org.orgId,
    userId: ctx.users.guestUserId,
    name: "Home",
    phoneNumber: "+6281234567890",
    street1: "Jl. Sudirman No. 1",
    type: ADDRESS_TYPE.SHIPPING,
  });

  // 3. Sequences
  await db.insert(sequences).values([
    {
      id: createId(),
      organizationId: ctx.org.orgId,
      name: "order",
      prefix: "ORD-",
      padding: 5,
    },
    {
      id: createId(),
      organizationId: ctx.org.orgId,
      name: "invoice",
      prefix: "INV-",
      padding: 5,
    },
  ]);

  // 4. Settings
  await db.insert(settings).values([
    {
      id: createId(),
      organizationId: ctx.org.orgId,
      category: "store",
      key: "currency",
      value: "IDR",
    },
  ]);
};

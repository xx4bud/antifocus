import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import { banners, posts, promotions } from "@/lib/db/schema";
import {
  BANNER_POSITION,
  POST_STATUS,
  PROMOTION_TARGET,
  PROMOTION_TYPE,
} from "@/lib/db/schema/enums";
import type { SeedContext } from "./seed-context";

export const seedMarketing = async (ctx: SeedContext) => {
  console.log("🌱 Seeding Marketing...");

  await db.insert(promotions).values({
    id: ctx.marketing.promotionId,
    organizationId: ctx.org.orgId,
    name: "Grand Opening",
    type: PROMOTION_TYPE.PERCENTAGE,
    target: PROMOTION_TARGET.ORDER,
    value: 20,
    enabled: true,
  });

  const fileIds = Object.values(ctx.files);
  if (fileIds.length > 1) {
    await db.insert(banners).values({
      id: createId(),
      organizationId: ctx.org.orgId,
      position: BANNER_POSITION.HERO,
      fileId: fileIds[1] as string,
      name: "Hero Banner",
      enabled: true,
      priority: 0,
    });
  }

  await db.insert(posts).values({
    id: createId(),
    organizationId: ctx.org.orgId,
    authorId: ctx.users.superadminId,
    title: "Welcome to Antifocus",
    slug: "welcome",
    content: "We are finally open!",
    status: POST_STATUS.PUBLISHED,
  });
};

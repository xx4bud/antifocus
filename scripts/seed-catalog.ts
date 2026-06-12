import { createId } from "@paralleldrive/cuid2";
import { db } from "@/lib/db";
import {
  designAreas,
  productImages,
  products,
  variants,
} from "@/lib/db/schema";
import { PRODUCT_STATUS, PRODUCT_TYPE } from "@/lib/db/schema/enums";
import type { SeedContext } from "./seed-context";

export const seedCatalog = async (ctx: SeedContext) => {
  console.log("🌱 Seeding Catalog...");

  await db.insert(products).values({
    id: ctx.catalog.productId,
    organizationId: ctx.org.orgId,
    unitId: ctx.taxonomy.unitId,
    taxRateId: ctx.finance.taxRateId,
    name: "Antifocus Signature Hoodie",
    slug: "antifocus-signature-hoodie",
    type: PRODUCT_TYPE.GOOD,
    status: PRODUCT_STATUS.LIVE,
  });

  // Take the first file from ctx.files
  const fileIds = Object.values(ctx.files);
  if (fileIds.length > 0) {
    await db.insert(productImages).values({
      id: createId(),
      organizationId: ctx.org.orgId,
      productId: ctx.catalog.productId,
      fileId: fileIds[0] as string,
      main: true,
      position: 0,
    });
  }

  await db.insert(variants).values({
    id: ctx.catalog.variantId,
    organizationId: ctx.org.orgId,
    productId: ctx.catalog.productId,
    sku: "AF-HDY-001",
    price: 450_000,
    costPrice: 200_000,
  });

  await db.insert(designAreas).values({
    id: ctx.catalog.designAreaId,
    organizationId: ctx.org.orgId,
    productId: ctx.catalog.productId,
    variantId: ctx.catalog.variantId,
    name: "Front Chest",
    width: 200,
    height: 100,
    x: 0,
    y: 0,
  });
};

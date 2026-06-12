import { db } from "@/lib/db";
import {
  attributeOptions,
  attributes,
  categories,
  collections,
  tags,
  units,
} from "@/lib/db/schema";
import { ATTRIBUTE_TYPE } from "@/lib/db/schema/enums";
import type { SeedContext } from "./seed-context";

export const seedTaxonomy = async (ctx: SeedContext) => {
  console.log("🌱 Seeding Taxonomy...");

  await db.insert(units).values({
    id: ctx.taxonomy.unitId,
    organizationId: ctx.org.orgId,
    name: "Pieces",
    code: "pcs",
    rate: 1.0,
  });

  await db.insert(categories).values({
    id: ctx.taxonomy.categoryId,
    organizationId: ctx.org.orgId,
    name: "Apparel",
    slug: "apparel",
  });

  await db.insert(tags).values({
    id: ctx.taxonomy.tagId,
    organizationId: ctx.org.orgId,
    name: "New Arrival",
    slug: "new-arrival",
  });

  await db.insert(attributes).values({
    id: ctx.taxonomy.attributeId,
    organizationId: ctx.org.orgId,
    name: "Color",
    slug: "color",
    type: ATTRIBUTE_TYPE.SELECT,
  });

  await db.insert(attributeOptions).values({
    id: ctx.taxonomy.attributeOptionId,
    organizationId: ctx.org.orgId,
    attributeId: ctx.taxonomy.attributeId,
    label: "Black",
    value: { hex: "#000000" },
  });

  await db.insert(collections).values({
    id: ctx.taxonomy.collectionId,
    organizationId: ctx.org.orgId,
    name: "Winter Collection",
    slug: "winter",
  });
};

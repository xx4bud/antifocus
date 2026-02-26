import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import {
  categories,
  medias,
  organizations,
  productCategories,
  productMedias,
  products,
  productVariants,
} from "~/lib/db/schemas";

const categoryData = [
  {
    name: "Stiker",
    slug: "stiker",
    position: 0,
    image:
      "https://images.unsplash.com/photo-1635405074683-96d6921a2a68?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Banner",
    slug: "banner-cetak",
    position: 1,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Kartu Nama",
    slug: "kartu-nama",
    position: 2,
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Brosur & Flyer",
    slug: "brosur-flyer",
    position: 3,
    image:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Undangan",
    slug: "undangan",
    position: 4,
    image:
      "https://images.unsplash.com/photo-1607827448387-a67db1383b59?w=400&h=400&fit=crop&q=80",
  },
];

const productData = [
  {
    name: "Stiker Vinyl Custom",
    slug: "stiker-vinyl-custom",
    description:
      "Stiker vinyl tahan air dengan finishing glossy/matte. Cocok untuk label produk, stiker branding, dan dekorasi.",
    basePrice: "15000",
    weight: 50,
    status: "active" as const,
    enabled: true,
    categorySlug: "stiker",
    imageUrl:
      "https://images.unsplash.com/photo-1635405074683-96d6921a2a68?w=800&h=800&fit=crop&q=80",
    variants: [
      {
        name: "A6 (10.5x14.8cm) - Glossy",
        sku: "STK-VNL-A6-GL",
        price: "15000",
        stock: 100,
        position: 0,
      },
      {
        name: "A5 (14.8x21cm) - Glossy",
        sku: "STK-VNL-A5-GL",
        price: "25000",
        stock: 100,
        position: 1,
      },
      {
        name: "A4 (21x29.7cm) - Glossy",
        sku: "STK-VNL-A4-GL",
        price: "35000",
        stock: 100,
        position: 2,
      },
      {
        name: "A6 (10.5x14.8cm) - Matte",
        sku: "STK-VNL-A6-MT",
        price: "17000",
        stock: 80,
        position: 3,
      },
      {
        name: "A5 (14.8x21cm) - Matte",
        sku: "STK-VNL-A5-MT",
        price: "28000",
        stock: 80,
        position: 4,
      },
      {
        name: "A4 (21x29.7cm) - Matte",
        sku: "STK-VNL-A4-MT",
        price: "38000",
        stock: 80,
        position: 5,
      },
    ],
  },
  {
    name: "Kartu Nama Premium",
    slug: "kartu-nama-premium",
    description:
      "Kartu nama berkualitas tinggi dengan bahan art carton 260gsm. Tersedia finishing laminasi doff dan glossy.",
    basePrice: "50000",
    weight: 30,
    status: "active" as const,
    enabled: true,
    categorySlug: "kartu-nama",
    imageUrl:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=800&fit=crop&q=80",
    variants: [
      {
        name: "1 Box (100pcs) - Doff",
        sku: "KN-PREM-100-DF",
        price: "50000",
        stock: 200,
        position: 0,
      },
      {
        name: "1 Box (100pcs) - Glossy",
        sku: "KN-PREM-100-GL",
        price: "50000",
        stock: 200,
        position: 1,
      },
      {
        name: "2 Box (200pcs) - Doff",
        sku: "KN-PREM-200-DF",
        price: "90000",
        stock: 150,
        position: 2,
      },
      {
        name: "2 Box (200pcs) - Glossy",
        sku: "KN-PREM-200-GL",
        price: "90000",
        stock: 150,
        position: 3,
      },
    ],
  },
  {
    name: "Brosur A4 Lipat 3",
    slug: "brosur-a4-lipat-3",
    description:
      "Brosur A4 lipat 3 full color cetak bolak-balik. Bahan art paper 150gsm.",
    basePrice: "1500",
    weight: 15,
    status: "active" as const,
    enabled: true,
    categorySlug: "brosur-flyer",
    imageUrl:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&h=800&fit=crop&q=80",
    variants: [
      {
        name: "100 lembar",
        sku: "BRS-A4-L3-100",
        price: "150000",
        stock: 50,
        position: 0,
      },
      {
        name: "250 lembar",
        sku: "BRS-A4-L3-250",
        price: "325000",
        stock: 50,
        position: 1,
      },
      {
        name: "500 lembar",
        sku: "BRS-A4-L3-500",
        price: "600000",
        stock: 30,
        position: 2,
      },
      {
        name: "1000 lembar",
        sku: "BRS-A4-L3-1000",
        price: "1050000",
        stock: 20,
        position: 3,
      },
    ],
  },
  {
    name: "X-Banner 60x160cm",
    slug: "x-banner-60x160",
    description:
      "X-Banner standing display ukuran 60x160cm. Cetak digital printing resolusi tinggi termasuk tiang.",
    basePrice: "75000",
    weight: 800,
    status: "active" as const,
    enabled: true,
    categorySlug: "banner-cetak",
    dimensions: { length: 600, width: 1600, height: 0 },
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=800&fit=crop&q=80",
    variants: [
      {
        name: "Flexi China (standar)",
        sku: "XBN-60-FLC",
        price: "75000",
        stock: 50,
        position: 0,
      },
      {
        name: "Flexi Korea (premium)",
        sku: "XBN-60-FLK",
        price: "95000",
        stock: 30,
        position: 1,
      },
      {
        name: "Albatros (ultra premium)",
        sku: "XBN-60-ALB",
        price: "125000",
        stock: 20,
        position: 2,
      },
    ],
  },
];

async function seedCategories(orgId: string) {
  const categoryMap = new Map<string, string>();

  for (const cat of categoryData) {
    let existing = await db.query.categories.findFirst({
      where: eq(categories.slug, cat.slug),
    });

    if (!existing) {
      [existing] = await db
        .insert(categories)
        .values({
          organizationId: orgId,
          ...cat,
        })
        .returning();
      console.log(`  ✅ Created category '${cat.name}'.`);
    }

    if (existing) {
      categoryMap.set(cat.slug, existing.id);
    }
  }

  return categoryMap;
}

async function seedProductMedia(
  orgId: string,
  productId: string,
  imageUrl: string
) {
  // Create the media record
  const [media] = await db
    .insert(medias)
    .values({
      organizationId: orgId,
      provider: "other",
      fileType: "image",
      mimeType: "image/jpeg",
      name: `product-${productId}`,
      url: imageUrl,
      width: 800,
      height: 800,
      size: 0,
    })
    .returning();

  if (media) {
    // Link media to product
    await db.insert(productMedias).values({
      productId,
      mediaId: media.id,
      isMain: true,
      position: 0,
    });
  }
}

async function seedProductItem(
  orgId: string,
  categoryMap: Map<string, string>,
  prod: (typeof productData)[number]
) {
  let existing = await db.query.products.findFirst({
    where: eq(products.slug, prod.slug),
  });

  if (existing) {
    console.log(`  ℹ️ Product '${prod.name}' already exists.`);
  } else {
    const { variants, categorySlug, dimensions, imageUrl, ...productValues } =
      prod;
    [existing] = await db
      .insert(products)
      .values({
        organizationId: orgId,
        ...productValues,
        dimensions: dimensions ?? null,
      })
      .returning();
    console.log(`  ✅ Created product '${prod.name}'.`);

    // Link to category
    const catId = categoryMap.get(categorySlug);
    if (existing && catId) {
      await db.insert(productCategories).values({
        productId: existing.id,
        categoryId: catId,
        isPrimary: true,
      });
    }

    // Create product media (image)
    if (existing && imageUrl) {
      await seedProductMedia(orgId, existing.id, imageUrl);
      console.log("    → Linked product image.");
    }

    // Create variants
    if (existing) {
      for (const variant of variants) {
        await db.insert(productVariants).values({
          productId: existing.id,
          ...variant,
        });
      }
      console.log(`    → Created ${variants.length} variants.`);
    }
  }
}

export const seedProducts = async () => {
  console.log("Seeding sample products & categories...");

  const org = await db.query.organizations.findFirst({
    where: eq(organizations.slug, "antifocus"),
  });

  if (!org) {
    console.warn("⚠️ No organization found. Skipping product seed.");
    return;
  }

  const categoryMap = await seedCategories(org.id);

  for (const prod of productData) {
    await seedProductItem(org.id, categoryMap, prod);
  }

  console.log("Product seeding complete.");
};

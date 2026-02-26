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
    image: "https://picsum.photos/seed/print1/800/800",
  },
  {
    name: "Banner & Spanduk",
    slug: "banner-spanduk",
    position: 1,
    image: "https://picsum.photos/seed/print2/800/800",
  },
  {
    name: "Kartu Nama",
    slug: "kartu-nama",
    position: 2,
    image: "https://picsum.photos/seed/print3/800/800",
  },
  {
    name: "Brosur & Flyer",
    slug: "brosur-flyer",
    position: 3,
    image: "https://picsum.photos/seed/print4/800/800",
  },
  {
    name: "Undangan",
    slug: "undangan",
    position: 4,
    image: "https://picsum.photos/seed/print5/800/800",
  },
  {
    name: "Buku & Majalah",
    slug: "buku-majalah",
    position: 5,
    image: "https://picsum.photos/seed/print6/800/800",
  },
  {
    name: "Merchandise",
    slug: "merchandise",
    position: 6,
    image: "https://picsum.photos/seed/print7/800/800",
  },
  {
    name: "Packaging",
    slug: "packaging",
    position: 7,
    image: "https://picsum.photos/seed/print8/800/800",
  },
  {
    name: "Apparel Custom",
    slug: "apparel-custom",
    position: 8,
    image: "https://picsum.photos/seed/print9/800/800",
  },
  {
    name: "Stempel",
    slug: "stempel",
    position: 9,
    image: "https://picsum.photos/seed/print10/800/800",
  },
];

const productData = [
  // 1. Stiker
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
    imageUrl: "https://picsum.photos/seed/print11/800/800",
    variants: [
      {
        name: "A6 - Glossy",
        sku: "STK-VNL-A6-GL",
        price: "15000",
        stock: 100,
        position: 0,
      },
      {
        name: "A4 - Glossy",
        sku: "STK-VNL-A4-GL",
        price: "35000",
        stock: 100,
        position: 1,
      },
      {
        name: "A4 - Matte",
        sku: "STK-VNL-A4-MT",
        price: "38000",
        stock: 80,
        position: 2,
      },
    ],
  },
  {
    name: "Stiker Cromo Die Cut",
    slug: "stiker-cromo-die-cut",
    description:
      "Stiker kertas cromo dipotong sesuai bentuk desain (Die Cut). Ekonomis untuk label kemasan kering.",
    basePrice: "10000",
    weight: 50,
    status: "active" as const,
    enabled: true,
    categorySlug: "stiker",
    imageUrl: "https://picsum.photos/seed/print12/800/800",
    variants: [
      {
        name: "Lembar A3+ (Tanpa Potong)",
        sku: "STK-CRM-A3",
        price: "10000",
        stock: 500,
        position: 0,
      },
      {
        name: "Lembar A3+ (Die Cut)",
        sku: "STK-CRM-A3-DC",
        price: "15000",
        stock: 500,
        position: 1,
      },
    ],
  },
  // 2. Banner & Spanduk
  {
    name: "X-Banner 60x160cm",
    slug: "x-banner-60x160",
    description:
      "X-Banner standing display ukuran 60x160cm. Cetak digital printing resolusi tinggi termasuk tiang.",
    basePrice: "75000",
    weight: 800,
    status: "active" as const,
    enabled: true,
    categorySlug: "banner-spanduk",
    dimensions: { length: 600, width: 1600, height: 0 },
    imageUrl: "https://picsum.photos/seed/print13/800/800",
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
    ],
  },
  {
    name: "Spanduk Flexi Outdoor",
    slug: "spanduk-flexi-outdoor",
    description:
      "Cetak Spanduk/Baliho bahan Flexi Outdoor. Harga dihitung per meter persegi (1x1m).",
    basePrice: "25000",
    weight: 200,
    status: "active" as const,
    enabled: true,
    categorySlug: "banner-spanduk",
    imageUrl: "https://picsum.photos/seed/print14/800/800",
    variants: [
      {
        name: "Flexi 280gr (Standard)",
        sku: "SPD-FLX-280",
        price: "25000",
        stock: 999,
        position: 0,
      },
      {
        name: "Flexi 340gr (Tebal)",
        sku: "SPD-FLX-340",
        price: "35000",
        stock: 999,
        position: 1,
      },
    ],
  },
  // 3. Kartu Nama
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
    imageUrl: "https://picsum.photos/seed/print15/800/800",
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
    ],
  },
  {
    name: "Kartu Nama Transparan PVC",
    slug: "kartu-nama-transparan-pvc",
    description:
      "Kartu nama eksklusif menggunakan bahan plastik PVC transparan anti air dan elegan.",
    basePrice: "120000",
    weight: 40,
    status: "active" as const,
    enabled: true,
    categorySlug: "kartu-nama",
    imageUrl: "https://picsum.photos/seed/print16/800/800",
    variants: [
      {
        name: "1 Box (100pcs) - 1 Sisi",
        sku: "KN-PVC-100",
        price: "120000",
        stock: 100,
        position: 0,
      },
      {
        name: "2 Box (200pcs) - 1 Sisi",
        sku: "KN-PVC-200",
        price: "220000",
        stock: 100,
        position: 1,
      },
    ],
  },
  // 4. Brosur & Flyer
  {
    name: "Brosur A4 Lipat 3",
    slug: "brosur-a4-lipat-3",
    description:
      "Brosur A4 lipat 3 full color cetak bolak-balik. Bahan art paper 150gsm.",
    basePrice: "150000",
    weight: 15,
    status: "active" as const,
    enabled: true,
    categorySlug: "brosur-flyer",
    imageUrl: "https://picsum.photos/seed/print17/800/800",
    variants: [
      {
        name: "100 lembar",
        sku: "BRS-A4-L3-100",
        price: "150000",
        stock: 50,
        position: 0,
      },
      {
        name: "500 lembar",
        sku: "BRS-A4-L3-500",
        price: "600000",
        stock: 30,
        position: 1,
      },
    ],
  },
  {
    name: "Flyer A5 Art Paper",
    slug: "flyer-a5-art-paper",
    description:
      "Flyer promosi ukuran A5 cetak 1 sisi. Bahan art paper mengkilap. Cocok untuk bagi-bagi di jalan.",
    basePrice: "90000",
    weight: 5,
    status: "active" as const,
    enabled: true,
    categorySlug: "brosur-flyer",
    imageUrl: "https://picsum.photos/seed/print18/800/800",
    variants: [
      {
        name: "Rim (500 lbr) - 120gsm",
        sku: "FLY-A5-120G-500",
        price: "90000",
        stock: 200,
        position: 0,
      },
      {
        name: "Rim (500 lbr) - 150gsm",
        sku: "FLY-A5-150G-500",
        price: "110000",
        stock: 200,
        position: 1,
      },
    ],
  },
  // 5. Undangan
  {
    name: "Undangan Hardcover Elegan",
    slug: "undangan-hardcover-elegan",
    description:
      "Undangan pernikahan premium bahan hardcover board tebal dilapisi fancy paper dengan hot print emas/perak.",
    basePrice: "15000",
    weight: 80,
    status: "active" as const,
    enabled: true,
    categorySlug: "undangan",
    imageUrl: "https://picsum.photos/seed/print19/800/800",
    variants: [
      {
        name: "Paket 300 Pcs",
        sku: "INV-HC-300",
        price: "4500000",
        stock: 10,
        position: 0,
      },
      {
        name: "Paket 500 Pcs",
        sku: "INV-HC-500",
        price: "6500000",
        stock: 10,
        position: 1,
      },
    ],
  },
  {
    name: "Undangan Softcover Rustic",
    slug: "undangan-softcover-rustic",
    description:
      "Undangan aesthetic tema rustic dengan bahan kertas kraft samson 280gsm. Termasuk tali rami.",
    basePrice: "4500",
    weight: 20,
    status: "active" as const,
    enabled: true,
    categorySlug: "undangan",
    imageUrl: "https://picsum.photos/seed/print20/800/800",
    variants: [
      {
        name: "Paket 300 Pcs",
        sku: "INV-SC-RST-300",
        price: "1350000",
        stock: 20,
        position: 0,
      },
      {
        name: "Paket 1000 Pcs",
        sku: "INV-SC-RST-1000",
        price: "3500000",
        stock: 20,
        position: 1,
      },
    ],
  },
  // 6. Buku & Majalah
  {
    name: "Cetak Buku Novel A5",
    slug: "cetak-buku-novel-a5",
    description:
      "Cetak buku ukuran A5. Cover Art Carton 260gsm Laminasi, Isi Bookpaper 72gsm Hitam Putih. Minimal cetak 10 buku.",
    basePrice: "25000",
    weight: 250,
    status: "active" as const,
    enabled: true,
    categorySlug: "buku-majalah",
    imageUrl: "https://picsum.photos/seed/print21/800/800",
    variants: [
      {
        name: "50-100 Halaman",
        sku: "BK-NVL-50",
        price: "25000",
        stock: 999,
        position: 0,
      },
      {
        name: "101-200 Halaman",
        sku: "BK-NVL-150",
        price: "35000",
        stock: 999,
        position: 1,
      },
    ],
  },
  {
    name: "Majalah Perusahaan A4",
    slug: "majalah-perusahaan-a4",
    description:
      "Cetak Company Profile / Majalah Full Color elegan di Art Paper 150gsm. Binding straples tengah.",
    basePrice: "35000",
    weight: 150,
    status: "active" as const,
    enabled: true,
    categorySlug: "buku-majalah",
    imageUrl: "https://picsum.photos/seed/print22/800/800",
    variants: [
      {
        name: "12 Halaman (Min 50 pcs)",
        sku: "MJLH-A4-12P",
        price: "35000",
        stock: 999,
        position: 0,
      },
      {
        name: "24 Halaman (Min 50 pcs)",
        sku: "MJLH-A4-24P",
        price: "55000",
        stock: 999,
        position: 1,
      },
    ],
  },
  // 7. Merchandise
  {
    name: "Mug Keramik Custom",
    slug: "mug-keramik-custom",
    description:
      "Cetak gambar sesukamu di mug keramik standar 11oz kualitas SNI coating tebal. Box gratis.",
    basePrice: "22000",
    weight: 350,
    status: "active" as const,
    enabled: true,
    categorySlug: "merchandise",
    imageUrl: "https://picsum.photos/seed/print23/800/800",
    variants: [
      {
        name: "Mug Putih Polos",
        sku: "MUG-PUTIH",
        price: "22000",
        stock: 1000,
        position: 0,
      },
      {
        name: "Mug Warna Dalam",
        sku: "MUG-INCOLOR",
        price: "26000",
        stock: 500,
        position: 1,
      },
    ],
  },
  {
    name: "Lanyard ID Card Printing",
    slug: "lanyard-id-card-printing",
    description:
      "Tali lanyard lebar 2cm dicetak full color dua sisi (sublimasi). Pemasangan kait besi dan stopper plastik.",
    basePrice: "15000",
    weight: 20,
    status: "active" as const,
    enabled: true,
    categorySlug: "merchandise",
    imageUrl: "https://picsum.photos/seed/print24/800/800",
    variants: [
      {
        name: "Satuan (Tanpa Minimum)",
        sku: "LNYD-1",
        price: "25000",
        stock: 200,
        position: 0,
      },
      {
        name: "Partai (Grosir 50+)",
        sku: "LNYD-50",
        price: "12500",
        stock: 2000,
        position: 1,
      },
    ],
  },
  // 8. Packaging
  {
    name: "Box Kemasan Kue Ukuran 20x20",
    slug: "box-kemasan-kue-20x20",
    description:
      "Packaging kardus corrugated (E-Flute) model pond kunci untuk kue, brownies, pakaian. Dapat disablon/cetak 1 warna.",
    basePrice: "4000",
    weight: 100,
    status: "active" as const,
    enabled: true,
    categorySlug: "packaging",
    imageUrl: "https://picsum.photos/seed/print25/800/800",
    variants: [
      {
        name: "Polos (Min 50 pcs)",
        sku: "BOX-20-POL",
        price: "4000",
        stock: 1000,
        position: 0,
      },
      {
        name: "Cetak 1 Warna (Min 100 pcs)",
        sku: "BOX-20-PRT",
        price: "5500",
        stock: 1000,
        position: 1,
      },
    ],
  },
  {
    name: "Paper Bag Kraft Tebal",
    slug: "paper-bag-kraft-tebal",
    description:
      "Tas belanja kertas bahan Kraft coklat polos ramah lingkungan (eco-friendly). Tali kur atau kertas.",
    basePrice: "2500",
    weight: 30,
    status: "active" as const,
    enabled: true,
    categorySlug: "packaging",
    imageUrl: "https://picsum.photos/seed/print26/800/800",
    variants: [
      {
        name: "Small (15x8x21cm)",
        sku: "PB-KFT-S",
        price: "2500",
        stock: 500,
        position: 0,
      },
      {
        name: "Medium (20x10x25cm)",
        sku: "PB-KFT-M",
        price: "3500",
        stock: 500,
        position: 1,
      },
      {
        name: "Large (25x12x32cm)",
        sku: "PB-KFT-L",
        price: "4500",
        stock: 500,
        position: 2,
      },
    ],
  },
  // 9. Apparel Custom
  {
    name: "Kaos Sablon DTF Custom",
    slug: "kaos-sablon-dtf-custom",
    description:
      "Cetak kaos satuan tulisan atau gambar full color tanpa batasan warna. Bahan Premium Cotton Combed 30s reaktif yang adem dan lembut.",
    basePrice: "85000",
    weight: 200,
    status: "active" as const,
    enabled: true,
    categorySlug: "apparel-custom",
    imageUrl: "https://picsum.photos/seed/print27/800/800",
    variants: [
      {
        name: "Hitam - L (Sablon A4)",
        sku: "TSHIRT-BLK-L-A4",
        price: "85000",
        stock: 50,
        position: 0,
      },
      {
        name: "Putih - XL (Sablon A3)",
        sku: "TSHIRT-WHT-XL-A3",
        price: "105000",
        stock: 50,
        position: 1,
      },
    ],
  },
  {
    name: "Topi Trucker Custom Polyflex",
    slug: "topi-trucker-custom-polyflex",
    description:
      "Topi jaring trucker sablon tulisan/logo 1 warna bahan polyflex tahan lama dan tidak mudah mengelupas.",
    basePrice: "35000",
    weight: 100,
    status: "active" as const,
    enabled: true,
    categorySlug: "apparel-custom",
    imageUrl: "https://picsum.photos/seed/print28/800/800",
    variants: [
      {
        name: "Hitam Jaring Putih",
        sku: "HAT-TRC-BW",
        price: "35000",
        stock: 100,
        position: 0,
      },
      {
        name: "Hitam Full",
        sku: "HAT-TRC-BB",
        price: "35000",
        stock: 100,
        position: 1,
      },
    ],
  },
  // 10. Stempel
  {
    name: "Stempel Warna Flash",
    slug: "stempel-warna-flash",
    description:
      "Stempel warna otomatis (sudah ada tinta, tanpa bak tinta ekstra) tahan hingga 1000 kali pengecapan.",
    basePrice: "65000",
    weight: 50,
    status: "active" as const,
    enabled: true,
    categorySlug: "stempel",
    imageUrl: "https://picsum.photos/seed/print29/800/800",
    variants: [
      {
        name: "Bulat (Diameter 3.5cm) - 1 Warna",
        sku: "STP-FL-B35-1C",
        price: "65000",
        stock: 50,
        position: 0,
      },
      {
        name: "Kotak (2x5cm) - 2 Warna",
        sku: "STP-FL-K25-2C",
        price: "85000",
        stock: 50,
        position: 1,
      },
    ],
  },
  {
    name: "Stempel Kayu Runaflek Biasa",
    slug: "stempel-kayu-runaflek-biasa",
    description:
      "Stempel konvensional dari gagang kayu dengan bantalan karet cetak bening (Runaflek). Butuh bantalan tinta luar.",
    basePrice: "25000",
    weight: 40,
    status: "active" as const,
    enabled: true,
    categorySlug: "stempel",
    imageUrl: "https://picsum.photos/seed/print30/800/800",
    variants: [
      {
        name: "Kecil (Maks 2x4cm)",
        sku: "STP-KY-S",
        price: "25000",
        stock: 100,
        position: 0,
      },
      {
        name: "Besar (Maks 4x6cm)",
        sku: "STP-KY-L",
        price: "40000",
        stock: 100,
        position: 1,
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

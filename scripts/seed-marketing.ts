import { db } from "~/lib/db";
import { banners } from "~/lib/db/schemas";

export const seedMarketing = async () => {
  console.log("Seeding marketing banners...");

  const existingBanners = await db.query.banners.findFirst({});

  if (existingBanners) {
    console.log("ℹ️ Banners already exist. Skipping.");
    return;
  }

  const bannerData = [
    {
      title: "Grand Opening Sale 🎉",
      description:
        "Diskon 20% untuk semua produk cetak! Berlaku hingga akhir bulan.",
      imageUrl:
        "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=1200&h=400&fit=crop&q=80",
      link: "/promo/grand-opening",
      position: 0,
      placement: "hero",
    },
    {
      title: "Cetak Kartu Nama 50rb/box",
      description:
        "Kartu nama premium 100pcs mulai 50rb. Laminasi doff/glossy.",
      imageUrl:
        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=400&fit=crop&q=80",
      link: "/products/kartu-nama-premium",
      position: 1,
      placement: "hero",
    },
    {
      title: "Custom Stiker Vinyl",
      description: "Stiker tahan air untuk label & branding. Mulai 15rb!",
      imageUrl:
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&h=400&fit=crop&q=80",
      link: "/products/stiker-vinyl-custom",
      position: 2,
      placement: "hero",
    },
  ];

  await db.insert(banners).values(bannerData);
  console.log(`✅ Created ${bannerData.length} marketing banners.`);
};

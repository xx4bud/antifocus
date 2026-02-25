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
      imageUrl: "https://placehold.co/1200x400/0ea5e9/white?text=Grand+Opening",
      link: "/promo/grand-opening",
      position: 0,
      placement: "hero",
    },
    {
      title: "Cetak Kartu Nama 50rb/box",
      description:
        "Kartu nama premium 100pcs mulai 50rb. Laminasi doff/glossy.",
      imageUrl:
        "https://placehold.co/1200x400/8b5cf6/white?text=Kartu+Nama+Premium",
      link: "/products/kartu-nama-premium",
      position: 1,
      placement: "hero",
    },
    {
      title: "Custom Stiker Vinyl",
      description: "Stiker tahan air untuk label & branding. Mulai 15rb!",
      imageUrl: "https://placehold.co/1200x400/f97316/white?text=Stiker+Custom",
      link: "/products/stiker-vinyl-custom",
      position: 2,
      placement: "hero",
    },
  ];

  await db.insert(banners).values(bannerData);
  console.log(`✅ Created ${bannerData.length} marketing banners.`);
};

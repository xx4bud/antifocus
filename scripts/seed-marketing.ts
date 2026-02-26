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
      imageUrl: "https://picsum.photos/seed/print1/800/800",
      link: "/promo/grand-opening",
      position: 0,
      placement: "hero",
    },
    {
      title: "Cetak Kartu Nama 50rb/box",
      description:
        "Kartu nama premium 100pcs mulai 50rb. Laminasi doff/glossy.",
      imageUrl: "https://picsum.photos/seed/print2/800/800",
      link: "/categories/kartu-nama",
      position: 1,
      placement: "hero",
    },
    {
      title: "Custom Stiker Vinyl",
      description: "Stiker tahan air untuk label & branding. Mulai 15rb!",
      imageUrl: "https://picsum.photos/seed/print3/800/800",
      link: "/categories/stiker",
      position: 2,
      placement: "hero",
    },
  ];

  await db.insert(banners).values(bannerData);
  console.log(`✅ Created ${bannerData.length} marketing banners.`);
};

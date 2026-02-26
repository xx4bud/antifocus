import type { Metadata } from "next";
import {
  getHomeBanners,
  getHomeCategories,
  getHomeFeaturedProducts,
} from "~/features/home/actions/get-home-data";
import { CategoryCarousel } from "~/features/home/components/category-carousel";
import { HeroBanner } from "~/features/home/components/hero-banner";
import { ProductGrid } from "~/features/home/components/product-grid";
import { createMetadata } from "~/utils/seo";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Antifocus — Platform Cetak Digital",
    description:
      "Platform cetak digital terpercaya untuk semua kebutuhan printing Anda. Pesan custom stiker, banner, undangan, dan lainnya.",
    keywords: ["cetak digital", "printing", "stiker", "banner", "undangan"],
  });
}

export default async function Home() {
  const [banners, categories, products] = await Promise.all([
    getHomeBanners(),
    getHomeCategories(12),
    getHomeFeaturedProducts(12),
  ]);

  return (
    <main className="flex w-full flex-1 flex-col gap-6 py-6">
      <HeroBanner banners={banners} />
      <CategoryCarousel categories={categories} />
      <ProductGrid products={products} />
    </main>
  );
}

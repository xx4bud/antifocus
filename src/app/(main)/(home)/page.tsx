import FeaturedCategories from "@/components/main/home/featured-categories";
import FeaturedProducts from "@/components/main/home/featured-products";
import { Banner } from "@/components/shared/banner";
import { homeBanners } from "@/lib/data";
import { getProducts } from "@/lib/queries/product";
import { getFeaturedCategories } from "@/lib/queries/slug";

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getFeaturedCategories(),
    getProducts({}, "", 1, 12),
  ])

  return (
    <div className="flex flex-1 flex-col gap-3 py-3">
      <Banner banners={homeBanners} />
      <FeaturedCategories categories={categories} />
      <FeaturedProducts products={products.products} />
    </div>
  );
}

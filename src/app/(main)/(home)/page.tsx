import { FeaturedCategories } from "@/components/shared/featured-categories";
import { AppBanner } from "@/components/shared/app-banner";
import { getCategories } from "@/app/actions/category";
import { getProducts } from "@/app/actions/product";
import { FeaturedProducts } from "@/components/shared/featured-products";

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({}, "", 1, 12),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-3 py-3">
      <AppBanner />
      <FeaturedCategories categories={categories} />
      <FeaturedProducts products={products.products} />
    </div>
  );
}

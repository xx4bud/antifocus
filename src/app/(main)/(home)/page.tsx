import FeaturedCategories from "@/components/main/home/featured-categories";
import FeaturedProducts from "@/components/main/home/featured-products";
import { Banner } from "@/components/shared/banner";
import { getProducts } from "@/lib/queries/product";
import { getFeaturedCategories } from "@/lib/queries/slug";
import banner1 from "@assets/images/carousel-1.webp";
import banner2 from "@assets/images/carousel-2.webp";

export const homeBanners = [
  {
    id: 1,
    src: banner1,
    alt: "Antifocus Banner 1",
  },
  {
    id: 2,
    src: banner2,
    alt: "Antifocus Banner 2",
  },
];


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

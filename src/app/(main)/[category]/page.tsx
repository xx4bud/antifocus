import NotFound from "@/app/not-found";
import { AppBreadcrumb } from "@/components/shared/breadcrumb";
import { ProductCard } from "@/components/shared/cards/product-card";
import { CategorySelect } from "@/components/shared/category-select";
import { Prelink } from "@/components/ui/prelink";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";
import {
  getCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/queries/slug";
import { ProductData } from "@/lib/types";
import { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { category } = await params;
  const [Category, Categories, Products] =
    await Promise.all([
      getCategoryBySlug(category),
      getCategories(),
      getProductsByCategory(category),
    ]);
  if (!Category || !Categories || !Products)
    return <NotFound />;

  return (
    <>
      {/* Breadcrumb */}
      <AppBreadcrumb />
      <div className="flex flex-1 flex-col gap-3 px-2 pb-3 md:flex-row">
        {/* Sidebar */}
        <aside className="md:w-1/5">
          <CategorySelect categories={Categories} />
        </aside>
        <div className="md:w-4/5">
          {/* Product List */}
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
            {Products.map((product: ProductData) => (
              <Prelink
                key={product.id}
                prefetch={true}
                href={`/${product.categories[0].slug}/${product.subCategories[0].slug}/${product.slug}`}
              >
                <ProductCard product={product} />
              </Prelink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany();
  return categories.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = await getCategoryBySlug(category);
  return {
    title:
      categoryData?.name || "Category | " + siteConfig.name,
  };
}

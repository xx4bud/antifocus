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
  getProductsBySubCategory,
  getSubCategoryBySlug,
} from "@/lib/queries/slug";
import { ProductData } from "@/lib/types";
import { Metadata } from "next";

interface SubCategoryPageProps {
  params: Promise<{
    category: string;
    subCategory: string;
  }>;
}

export default async function SubCategoryPage({
  params,
}: SubCategoryPageProps) {
  const { category, subCategory } = await params;
  const [Category, SubCategory, Categories, Products] =
    await Promise.all([
      getCategoryBySlug(category),
      getSubCategoryBySlug(subCategory),
      getCategories(),
      getProductsBySubCategory(subCategory),
    ]);
  if (!Category || !SubCategory || !Categories || !Products)
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
                <ProductCard
                  key={product.id}
                  product={product}
                />
              </Prelink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const subCategories = await prisma.subCategory.findMany({
    select: {
      slug: true,
      category: {
        select: { slug: true },
      },
    },
  });
  return subCategories.map((sub) => ({
    subCategory: sub.slug,
    category: sub.category?.slug,
  }));
}

export async function generateMetadata({
  params,
}: SubCategoryPageProps): Promise<Metadata> {
  const { subCategory } = await params;
  const SubCategory =
    await getSubCategoryBySlug(subCategory);
  return {
    title:
      SubCategory?.name ||
      "SubCategory | " + siteConfig.name,
  };
}

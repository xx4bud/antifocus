import { getSubCategory } from "@/app/actions/category";
import { getProducts } from "@/app/actions/product";
import NotFound from "@/app/not-found";
import { AppBreadcrumb } from "@/components/shared/app-breadcrumb";
import { ProductCard } from "@/components/shared/product-card";
import { SortFilter } from "@/components/shared/sort-filter";
import { Prelink } from "@/components/ui/prelink";
import prisma from "@/lib/prisma";
import { FiltersQuery } from "@/lib/types";
import { Metadata } from "next";

interface SubCategoryPageProps {
  params: Promise<{
    category: string;
    subCategory: string;
  }>;
  searchParams: Promise<FiltersQuery>;
}

export default async function SubCategoryPage({
  params,
  searchParams,
}: SubCategoryPageProps) {
  const { category, subCategory } = await params;
  const { q, maxPrice, minPrice, option, variant, sort } =
    await searchParams;
  const [subCategoryData, productsData] = await Promise.all(
    [
      getSubCategory(subCategory),
      getProducts(
        {
          q,
          minPrice: Number(minPrice) || 0,
          maxPrice:
            Number(maxPrice) || Number.MAX_SAFE_INTEGER,
          category,
          subCategory,
          option,
          variant,
        },
        sort
      ),
    ]
  );

  if (!subCategoryData || !productsData)
    return <NotFound />;

  return (
    <>
      <AppBreadcrumb />
      <div className="relative flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        {/* <aside className="md:w-1/5">sidebar</aside> */}
        {/* Products */}
        <div className="flex flex-1 flex-col md:w-4/5">
          <SortFilter/>
          <div className="grid grid-cols-2 gap-3 p-1 sm:grid-cols-3 md:grid-cols-4">
            {productsData.products.map((product: any) => (
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
    await getSubCategory(subCategory);
  return {
    title:
      SubCategory?.name ||
      "SubCategory",
  };
}

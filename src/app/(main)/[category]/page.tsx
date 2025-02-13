import { getCategory } from "@/app/actions/category";
import { getProducts } from "@/app/actions/product";
import NotFound from "@/app/not-found";
import { AppBreadcrumb } from "@/components/shared/app-breadcrumb";
import { ProductCard } from "@/components/shared/product-card";
import { SortFilter } from "@/components/shared/sort-filter";
import { Input } from "@/components/ui/input";
import { Prelink } from "@/components/ui/prelink";
import prisma from "@/lib/prisma";
import { FiltersQuery } from "@/lib/types";
import { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<FiltersQuery>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;
  const {
    q,
    subCategory,
    maxPrice,
    minPrice,
    option,
    variant,
    sort,
  } = await searchParams;
  const [categoryData, productsData] = await Promise.all([
    getCategory(category),
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
  ]);

  if (!categoryData || !productsData) return <NotFound />;

  return (
    <>
      <AppBreadcrumb />
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-1/5">
          sidebar
        </aside>
        {/* Products */}
        <div className="flex flex-1 flex-col md:w-4/5">
          <div className="flex w-full items-center">
            <div className="flex w-full md:w-1/2">
              <SortFilter />
            </div>
            <div className="hidden md:block md:w-1/2">
              <Input placeholder="search by.." />
            </div>
          </div>
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
  const categories = await prisma.category.findMany();
  return categories.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = await getCategory(category);
  return {
    title:
      categoryData?.name || "Category",
  };
}
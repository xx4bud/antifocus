// src/app/(main)/(collections)/[categorySlug]/page.tsx
import NotFound from "@/app/not-found";
import { formatCurrency } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import { CategorySelect } from "@/components/shared/category-select";
import { getCategories, getCategory } from "@/lib/queries/category";
import { getProductsByCategory } from "@/lib/queries/product";
import { AppBreadcrumb } from "@/components/shared/breadcrumb";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { ProductCard } from "@/components/shared/product-card";
import { ProductData } from "@/lib/types";

interface CategoryPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany();
  return categories.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const categoryData = await getCategory(categorySlug);
  return {
    title: categoryData?.name || "Category",
  };
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { categorySlug } = await params;
  const categoryDecoded = decodeURIComponent(categorySlug);

  const categoryData = await getCategory(categoryDecoded);
  if (!categoryData) {
    return <NotFound />;
  }

  const categoriesData = await getCategories();
  if (!categoriesData) return <NotFound title="categories" />;

  const productsData =
    await getProductsByCategory(categoryDecoded);
  if (!productsData) return <NotFound title="product" />;

  return (
    <>
      {/* Breadcrumb */}
      <AppBreadcrumb/>
     
      <div className="flex flex-1 flex-col gap-3 px-2 md:flex-row">
        {/* Sidebar */}
        <aside className="md:w-1/5">
          <CategorySelect categories={categoriesData} />
        </aside>
        <div className="md:w-4/5">
          {/* Product List */}
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
            {productsData.map((product: ProductData) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

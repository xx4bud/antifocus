import NotFound from "@/app/not-found";
import { AppBreadcrumb } from "@/components/shared/breadcrumb";
import { CategorySelect } from "@/components/shared/category-select";
import { ProductCard } from "@/components/shared/product-card";
import prisma from "@/lib/prisma";
import {
  getCategories,
  getSubCategories,
  getSubCategory,
} from "@/lib/queries/category";
import { getProductBySubCategory } from "@/lib/queries/product";
import { ProductData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Star } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

interface SubCategoryPageProps {
  params: Promise<{
    subcategorySlug: string;
  }>;
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
  const { subcategorySlug } = await params;
  const subCategoryData =
    await getSubCategory(subcategorySlug);
    
  return {
    title: subCategoryData?.name || "SubCategory",
  };
}

export default async function SubCategoryPage({
  params,
}: SubCategoryPageProps) {
  const { subcategorySlug } = await params;
  const subcategoryDecoded =
    decodeURIComponent(subcategorySlug);

  const categoriesData = await getCategories();

  const subData = await getSubCategory(subcategoryDecoded);
  if (!subData) {
    return <NotFound />;
  }

  const subsData = await getSubCategories();
  if (!subsData) return <NotFound title="subcategories" />;

  const productsData = await getProductBySubCategory(
    subcategoryDecoded
  );
  if (!productsData) return <NotFound title="product" />;

  return (
    <>
      {/* Breadcrumb */}
      <AppBreadcrumb />
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

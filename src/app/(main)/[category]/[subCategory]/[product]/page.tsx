import NotFound from "@/app/not-found";
import { AppBreadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";
import {
  getCategoryBySlug,
  getProductBySlug,
  getSubCategoryBySlug,
} from "@/lib/queries/slug";
import { VariantData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";

interface ProductPageProps {
  params: Promise<{
    category: string;
    subCategory: string;
    product: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { category, subCategory, product } = await params;
  const Category = await getCategoryBySlug(category);
  const SubCategory =
    await getSubCategoryBySlug(subCategory);
  const Product = await getProductBySlug(product);
  if (!Category || !SubCategory || !Product)
    return <NotFound />;

  return (
    <>
      <AppBreadcrumb />
      <div className="flex flex-col gap-4 p-1 pb-3">
        {/* Detail Produk */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-row gap-4">
            <div className="hidden flex-col gap-4 md:flex">
              <div className="relative size-20 aspect-square">
                <Image
                  src={
                    Product.media[0]?.url ||
                    "/placeholder.svg"
                  }
                  alt={Product.name}
                  width={80}
                  height={80}
                  quality={30}
                  decoding="sync"
                  sizes="(max-width: 768px) 100vw, 80px"
                  loading="eager"
                  className="aspect-square h-full w-full rounded object-cover"
                />
              </div>
            </div>
            <div className="relative aspect-square h-full w-full">
              <Image
                src={
                  Product.media[0]?.url ||
                  "/placeholder.svg"
                }
                alt={Product.name}
                width={500}
                height={500}
                quality={50}
                decoding="sync"
                loading="eager"
                sizes="(max-width: 768px) 100vw, 500px"
                className="h-full w-full rounded object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="line-clamp-2 text-xl font-bold">
              {Product.name}
            </h1>
            <p className="text-md text-muted-foreground">
              {Product.description}
            </p>
            <div className="flex flex-col gap-2">
              {Product.variants.map(
                (variant: VariantData) => (
                  <div key={variant.id}>
                    <span className="text-lg font-semibold">
                      {formatCurrency(
                        Number(variant.price)
                      )}
                    </span>
                  </div>
                )
              )}
            </div>
            <Button asChild>
              <Link
                href={siteConfig.links.whatsapp}
                target="_blank"
              >
                <FaWhatsapp />
                WhatsApp
              </Link>
            </Button>
          </div>
        </section>

        {/* Review Produk */}
        {/* <section className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">Reviews</h2>
          <p>{Product.reviews.length} Review</p>
        </section> */}
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: {
      slug: true,
      categories: {
        select: {
          slug: true,
        },
      },
      subCategories: {
        select: {
          slug: true,
        },
      },
    },
  });
  return products.map((product) => ({
    product: product.slug,
    category: product.categories[0].slug,
    subcategory: product.subCategories[0].slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { product } = await params;
  const Product = await getProductBySlug(product);
  return {
    title: Product?.name || "Product | " + siteConfig.name,
  };
}

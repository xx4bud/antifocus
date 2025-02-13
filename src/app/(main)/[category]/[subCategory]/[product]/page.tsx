import { getProduct } from "@/app/actions/product";
import NotFound from "@/app/not-found";
import { AppBreadcrumb } from "@/components/shared/app-breadcrumb";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";

interface ProductPageProps {
  params: Promise<{
    product: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { product } = await params;
  const productData = await getProduct(product);

  if (!productData) return <NotFound />;

  return (
    <>
      <AppBreadcrumb />
      <div className="flex flex-col gap-4 p-1 pb-3">
        {/* Detail Produk */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-row gap-4">
            <div className="hidden flex-col gap-4 md:flex">
              <div className="relative aspect-square size-20">
                <Image
                  src={
                    productData.media[0]?.url ||
                    "/placeholder.svg"
                  }
                  alt={productData.name}
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
                  productData.media[0]?.url ||
                  "/placeholder.svg"
                }
                alt={productData.name}
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
              {productData.name}
            </h1>
            <p className="text-md text-muted-foreground">
              {productData.description}
            </p>
            <div className="flex flex-col gap-2">
              {productData.variants.map((variant: any) => (
                <div key={variant.id}>
                  <span className="text-lg font-semibold">
                    {formatCurrency(Number(variant.price))}
                  </span>
                </div>
              ))}
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
  const Product = await getProduct(product);
  return {
    title: Product?.name || "Product",
  };
}

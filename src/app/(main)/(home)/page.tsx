import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Prelink } from "@/components/ui/prelink";
import prisma from "@/lib/prisma";
import { getAllCategories } from "@/lib/queries/category";
import { getAllProducts } from "@/lib/queries/product";
import { formatCurrency } from "@/lib/utils";
import banner1 from "@assets/images/carousel-1.webp";
import banner2 from "@assets/images/carousel-2.webp";
import {
  ArrowRight,
  CircleArrowRight,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";

const bannerImages = [
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
  const [CategoryData, ProductData] = await Promise.all([
    getAllCategories(),
    getAllProducts({ take: 6 }),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero Section */}
      <section className="pt-3">
        <Carousel>
          <CarouselContent>
            {bannerImages.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative h-40 overflow-hidden rounded-lg border sm:h-80">
                  <Image
                    src={banner.src}
                    alt={banner.alt}
                    loading="eager"
                    width={1128}
                    height={320}
                    quality={50}
                    className="h-full w-full rounded-lg object-cover transition-transform duration-300 hover:scale-[1.01]"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
      {/* Category Carousel */}
      <section className="pt-3">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="-my-1 text-xl font-bold sm:text-2xl">
            Shop by category
          </h1>
          <p className="text-sm text-muted-foreground sm:text-lg">
            Explore our curated product categories
          </p>
        </div>
        <Carousel>
          <CarouselContent className="pt-3">
            {CategoryData.map((category) => (
              <CarouselItem
                key={category.id}
                className="basis-1/3 sm:basis-1/4 md:basis-1/6"
              >
                <Link href={`/${category.slug}`}>
                  <div className="relative overflow-hidden rounded-lg border p-6 transition-transform duration-300 hover:scale-[1.03]">
                    <Image
                      src={
                        category.media[0]?.url ||
                        "/placeholder.svg"
                      }
                      alt={category.name}
                      loading="eager"
                      width={200}
                      height={200}
                      quality={50}
                      className="aspect-square h-full w-full rounded-full object-cover"
                    />
                    <p className="line-clamp-2 pt-2 text-center text-sm font-medium md:text-lg">
                      {category.name}
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
            {/* View All Category */}
            <CarouselItem className="basis-1/3 sm:basis-1/4 md:basis-1/6">
              <div className="relative h-full overflow-hidden rounded-lg border p-6 transition-transform duration-300 hover:scale-[1.03]">
                <div className="flex aspect-square items-center justify-center">
                  <CircleArrowRight className="size-14" />
                </div>
                <p className="line-clamp-2 pt-2 text-center text-sm font-medium md:text-lg">
                  View All
                </p>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </section>
      {/* Discovery Product */}
      <section className="p-1 py-3">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="-my-1 text-xl font-bold sm:text-2xl">
            Discovery Product
          </h1>
          <p className="text-sm text-muted-foreground sm:text-lg">
            We curate a selection of products based on
            trends and preferences.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3.5 pt-4 md:grid-cols-6">
          {ProductData.products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
        <div className="flex flex-1 pt-3.5">
          <Button className="flex-1" variant={"outline"}>
            View All
            <ArrowRight />
          </Button>
        </div>
      </section>
    </div>
  );
}

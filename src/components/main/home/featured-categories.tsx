"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";
import { CircleArrowRight } from "lucide-react";
import { FeaturedCategoriesData } from "@/lib/queries/slug";
import { CategoryCard } from "@/components/shared/cards/category-card";

interface FeaturedCategoriesProps {
  categories: FeaturedCategoriesData[];
}

export default function FeaturedCategories({
  categories,
}: FeaturedCategoriesProps) {
  return (
    <div>
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
          {categories?.map((category) => (
            <CarouselItem
              key={category.id}
              className="basis-1/3 sm:basis-1/4 md:basis-1/6"
            >
              <Link href={`/${category.slug}`}>
                <CategoryCard category={category} />
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
    </div>
  );
}

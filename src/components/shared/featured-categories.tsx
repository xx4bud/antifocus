"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";
import { CircleArrowRight } from "lucide-react";
import { CategoryCard } from "@/components/shared/category-card";
import { CategoryData } from "@/lib/types";

interface FeaturedCategoriesProps {
  categories: CategoryData[]
}

export function FeaturedCategories({
  categories,
}: FeaturedCategoriesProps) {
  return (
    <section className="space-y-2">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="-my-1 text-xl font-bold sm:text-2xl">
          Shop By Category
        </h1>
        <p className="text-sm text-muted-foreground sm:text-lg">
          Explore our collection of categories
        </p>
      </div>
      <Carousel>
        <CarouselContent>
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
          {/* All Categories */}
          <CarouselItem className="basis-1/3 sm:basis-1/4 md:basis-1/6">
            <Link href="/categories">
              <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border py-4 transition-transform duration-300 hover:scale-[1.02]">
                <div className="flex size-[80%] items-center justify-center rounded-full">
                  <CircleArrowRight className="size-16 text-primary" />
                </div>
                <p className="line-clamp-2 text-center text-sm font-medium md:text-lg">
                  View All
                </p>
              </div>
            </Link>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </section>
  );
}

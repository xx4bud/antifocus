"use client";

import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

import { Link } from "~/i18n/navigation";

interface Category {
  id: string;
  image: string | null;
  name: string;
  position: number;
  slug: string;
}

interface CategoryCarouselProps {
  categories: Category[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Kategori</h2>
          <p className="text-muted-foreground text-sm">
            Jelajahi produk berdasarkan kategori
          </p>
        </div>
        <Link
          className="hidden items-center gap-1 font-medium text-primary text-sm transition-colors hover:text-primary/80 md:flex"
          href="/search"
        >
          Lihat Semua
          <IconArrowRight className="size-4" />
        </Link>
      </div>

      <div className="relative px-0 md:px-12">
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            slidesToScroll: 2,
          }}
        >
          <CarouselContent className="-ml-3">
            {categories.map((category) => (
              <CarouselItem
                className="basis-1/3 pl-3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                key={category.id}
              >
                <Link
                  className="group flex flex-col items-center gap-3"
                  href={{
                    pathname: "/[slug]",
                    params: { slug: category.slug },
                  }}
                >
                  <div className="relative size-16 overflow-hidden rounded-full border-2 border-transparent bg-muted ring-2 ring-transparent transition-all duration-300 group-hover:border-primary group-hover:ring-primary/20 sm:size-20 md:size-24">
                    {category.image ? (
                      <Image
                        alt={category.name}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                        fill
                        sizes="96px"
                        src={category.image}
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <span className="font-bold text-lg text-primary/60">
                          {category.name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="line-clamp-2 text-center font-medium text-xs transition-colors group-hover:text-primary sm:text-sm">
                    {category.name}
                  </span>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}

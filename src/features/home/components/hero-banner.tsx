"use client";

import { IconArrowRight } from "@tabler/icons-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { cn } from "~/utils/styles";

interface Banner {
  description: string;
  id: string;
  imageUrl: string;
  link: string;
  title: string;
}

interface HeroBannerProps {
  banners: Banner[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  if (banners.length === 0) {
    return (
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-primary/80 px-8 py-16 text-primary-foreground md:py-24">
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h1 className="mb-4 font-bold text-3xl tracking-tight md:text-5xl">
            Selamat Datang di Antifocus
          </h1>
          <p className="mb-8 text-lg text-primary-foreground/80">
            Platform cetak digital terpercaya untuk semua kebutuhan printing
            Anda.
          </p>
          <Button
            asChild
            className="gap-2 rounded-full px-8"
            size="lg"
            variant="secondary"
          >
            <a href="/search">
              Mulai Belanja
              <IconArrowRight className="size-4" />
            </a>
          </Button>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]" />
      </section>
    );
  }

  return (
    <section className="relative">
      <Carousel
        className="w-full"
        opts={{ align: "start", loop: true }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
        setApi={setApi}
      >
        <CarouselContent className="-ml-0">
          {banners.map((banner) => (
            <CarouselItem className="pl-0" key={banner.id}>
              <a
                className="group relative block overflow-hidden rounded-2xl"
                href={banner.link}
              >
                <div className="relative aspect-[21/9] w-full overflow-hidden md:aspect-[21/7]">
                  <Image
                    alt={banner.title}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    fill
                    priority
                    sizes="100vw"
                    src={banner.imageUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 z-10 p-6 md:p-10">
                  <h2 className="mb-2 font-bold text-2xl text-white tracking-tight drop-shadow-lg md:text-4xl">
                    {banner.title}
                  </h2>
                  <p className="mb-4 max-w-lg text-sm text-white/80 md:text-base">
                    {banner.description}
                  </p>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 font-medium text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/30">
                    Selengkapnya
                    <IconArrowRight className="size-4" />
                  </span>
                </div>
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dot indicators */}
      {banners.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {banners.map((banner, index) => (
            <button
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                current === index
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              key={banner.id}
              onClick={() => scrollTo(index)}
              type="button"
            />
          ))}
        </div>
      )}
    </section>
  );
}

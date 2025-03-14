"use client";

import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { FeaturedBanner } from "@/lib/types";

interface FeaturedBannersProps {
  banners: FeaturedBanner[];
}

export function FeaturedBanners({
  banners,
}: FeaturedBannersProps) {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      onMouseEnter={() => plugin.current.stop()}
      onMouseLeave={() => plugin.current.play()}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.id}>
            <div className="relative h-40 overflow-hidden rounded-lg border sm:h-80">
              <Image
                src={banner.src}
                alt={banner.alt}
                loading="eager"
                priority
                width={1128}
                height={320}
                quality={50}
                sizes="(max-width: 768px) 100vw, 1128px"
                className="h-full w-full rounded-lg object-cover transition-transform duration-300 hover:scale-[1.01]"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

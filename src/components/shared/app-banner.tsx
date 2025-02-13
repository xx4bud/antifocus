"use client";

import banner1 from "@assets/images/carousel-1.webp";
import banner2 from "@assets/images/carousel-2.webp";
import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

export const banners = [
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

export function AppBanner() {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );
  return (
    <Carousel
      dir="ltr"
      plugins={[plugin.current]}
      className="mx-auto w-full"
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

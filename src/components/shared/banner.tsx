import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { StaticImageData } from "next/image";

interface Banner {
  id: number;
  src: string | StaticImageData;
  alt: string;
}

interface BannerProps {
  banners: Banner[];
}

export function Banner({ banners }: BannerProps) {
  return (
    <Carousel>
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

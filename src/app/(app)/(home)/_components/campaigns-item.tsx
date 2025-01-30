"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CampaignData } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

interface CampaignsItemProps {
  campaigns: CampaignData[];
}
export function CampaignsItem({
  campaigns,
}: CampaignsItemProps) {
  const plugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: true,
    })
  );

  return (
    <Carousel
      className="w-full"
      opts={{ loop: true }}
      plugins={[plugin.current]}
      onMouseEnter={() => plugin.current.stop()}
      onMouseLeave={() => plugin.current.play()}
    >
      <CarouselContent className="pt-3 shadow">
        {campaigns.map((campaign) => (
          <CarouselItem
            key={campaign.id}
            className="group overflow-hidden transition-transform duration-100"
          >
            <div className="relative h-40 w-full overflow-hidden rounded-lg md:h-80">
              <Link href={`/`}>
                <Image
                  loading="lazy"
                  src={campaign.photos?.[0].url}
                  alt={campaign.name || campaign.slug}
                  width={1128}
                  height={320}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                  sizes="(max-width: 768px) 100vw, 
                (max-width: 1024px) 75vw, 
                50vw"
                />
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
